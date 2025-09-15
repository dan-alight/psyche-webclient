import { useState, useEffect, useRef } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import config from "@/config";
import { Container, type ContainerVariant } from "@/components/Container";
import type {
  ConversationMessageRead,
  ConversationMessageCreate,
  ChatRequest,
  AiModelRead,
  ConversationMessagePart,
} from "@/types/api";
import ControlPanel from "@/components/ControlPanel";
import styles from "./$conversationId.module.scss";

export const Route = createFileRoute("/chat/$conversationId")({
  component: Conversation,
});

function AssistantMessage({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const thinkStartTag = "<think>";
  const thinkEndTag = "</think>";

  const startTagIndex = content.indexOf(thinkStartTag);

  if (startTagIndex !== 0) {
    return <>{content}</>;
  }

  const endTagIndex = content.indexOf(thinkEndTag);

  let thinkContent;
  let postThinkContent = "";

  if (endTagIndex === -1) {
    thinkContent = content.substring(startTagIndex + thinkStartTag.length);
  } else {
    thinkContent = content.substring(
      startTagIndex + thinkStartTag.length,
      endTagIndex
    );
    postThinkContent = content.substring(endTagIndex + thinkEndTag.length);
  }

  thinkContent = thinkContent.trim();
  postThinkContent = postThinkContent.trim();

  return (
    <>
      <details
        className={styles.thinkingBox}
        open={isOpen}
        onToggle={(e) => setIsOpen(e.currentTarget.open)}
      >
        <summary className={styles.thinkingSummary}>Thinking</summary>
        {<p className={styles.thinkingContent}>{thinkContent}</p>}
      </details>
      {postThinkContent}
    </>
  );
}

async function fetchMessages(conversationId: string) {
  const res = await fetch(
    `${config.HTTP_URL}/conversations/${conversationId}/messages`
  );
  if (!res.ok) throw new Error("Failed to fetch conversation messages");
  return res.json();
}

async function fetchActiveModels(): Promise<AiModelRead[]> {
  const res = await fetch(`${config.HTTP_URL}/ai-models/active`);
  if (!res.ok) throw new Error("Failed to fetch active models");
  return res.json();
}

interface AiConfig {
  ai_model_id?: number;
}

function Conversation() {
  const queryClient = useQueryClient();
  const { conversationId } = useParams({ from: "/chat/$conversationId" });

  const [aiConfig, setAiConfig] = useState<AiConfig>({});
  const [messageText, setMessageText] = useState("");

  const { data: messages } = useQuery<ConversationMessageRead[]>({
    queryKey: ["conversationMessages", conversationId],
    queryFn: () => fetchMessages(conversationId),
  });

  const { data: activeModels = [], isLoading: modelsLoading } = useQuery<
    AiModelRead[]
  >({
    queryKey: ["activeModels"],
    queryFn: fetchActiveModels,
  });

  const effectiveConfig: AiConfig = {
    ...aiConfig,
    ai_model_id: aiConfig.ai_model_id ?? activeModels[0]?.id,
  };

  const websocket = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (
      !messages ||
      !websocket.current ||
      !messageText.trim() ||
      !effectiveConfig.ai_model_id
    )
      return;

    const conversationMessageCreate: ConversationMessageCreate = {
      type: "conversation_message_create",
      content: messageText,
      conversation_id: Number(conversationId),
      parent_message_id:
        messages.length > 0 ? messages[messages.length - 1].id : null,
    };

    const chatRequest: ChatRequest = {
      action: conversationMessageCreate,
      config: effectiveConfig,
    };

    websocket.current.send(JSON.stringify(chatRequest));
    setMessageText("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket(`${config.WS_URL}/chat`);
    websocket.current = ws;
    ws.onopen = () => console.log("WebSocket connection established");
    ws.onmessage = (event) => {
      const res = JSON.parse(event.data);
      const message_type = res["type"];
      if (message_type === "conversation_message_read") {
        queryClient.setQueryData<ConversationMessageRead[]>(
          ["conversationMessages", conversationId],
          (old = []) => [...old, res]
        );
      } else if (message_type === "conversation_message_part") {
        const part = res as ConversationMessagePart;
        queryClient.setQueryData<ConversationMessageRead[]>(
          ["conversationMessages", conversationId],
          (old = []) =>
            old.map((msg) =>
              msg.id === part.conversation_message_id
                ? { ...msg, content: msg.content + part.content }
                : msg
            )
        );
      } else if (message_type === "task_status") {
        console.log("Task status received:", res);
      }
    };
    ws.onerror = (error) => console.error("WebSocket error:", error);
    ws.onclose = (e) => console.log("WebSocket connection closed:", e.reason);

    return () => {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      ws.close();
      websocket.current = null;
    };
  }, [conversationId]);

  const containerVariant: ContainerVariant = "content";

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.messagesContainerWrapper}>
          <div className={styles.messagesContainer}>
            <Container
              variant={containerVariant}
              className={styles.messagesList}
            >
              {messages?.map((msg, index) => {
                return (
                  <div
                    key={index}
                    className={`${styles.message} ${
                      msg.role === "user"
                        ? styles.userMessage
                        : styles.assistantMessage
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <AssistantMessage content={msg.content} />
                    ) : (
                      msg.content
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </Container>
          </div>
          <div className={styles.formContainer}>
            <form
              className={styles.form}
              name="sendMessageForm"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <textarea
                className={styles.input}
                name="messageInputField"
                required
                placeholder="Enter your message"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button type="submit" className={styles.sendButton}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
      <ControlPanel>
        <h4>Settings</h4>
        {modelsLoading ? (
          <div>Loading models...</div>
        ) : (
          <div>
            <label htmlFor="model-select">Model:</label>
            <select
              id="model-select"
              value={aiConfig["ai_model_id"] || ""}
              onChange={(e) => {
                const model = activeModels.find(
                  (m) => m.id === Number(e.target.value)
                );
                setAiConfig((prev) => ({
                  ...prev,
                  ai_model_id: model ? model.id : undefined,
                }));
              }}
            >
              {activeModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </ControlPanel>
    </>
  );
}
