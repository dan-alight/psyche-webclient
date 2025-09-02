import { useState, useEffect, useRef } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import config from "@/config";
import { Container, type ContainerVariant } from "@/components/Container";
import type { ConversationMessageRead } from "@/types/api";
import styles from "./$conversationId.module.css";

export const Route = createFileRoute("/chat/$conversationId")({
  component: Conversation,
});

async function fetchMessages(conversationId: string) {
  const res = await fetch(
    `${config.HTTP_URL}/conversations/${conversationId}/messages`
  );
  if (!res.ok) throw new Error("Failed to fetch conversation messages");
  return res.json();
}

function Conversation() {
  const queryClient = useQueryClient();

  const websocket = useRef<WebSocket | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useParams({ from: "/chat/$conversationId" });

  const { data: messages } = useQuery<ConversationMessageRead[]>({
    queryKey: ["conversationMessages", conversationId],
    queryFn: () => fetchMessages(conversationId),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket(`${config.WS_URL}/chat`);
    websocket.current = ws;
    ws.onopen = () => console.log("WebSocket connection established");
    ws.onmessage = (event) => {
      const res = JSON.parse(event.data);
      if (res["type"] === "conversation_message_read") {
        queryClient.setQueryData<ConversationMessageRead[]>(
          ["conversationMessages", conversationId],
          (old = []) => [...old, res]
        );
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

  const sendMessage = async () => {
    if (!messages || !websocket.current || !messageText.trim()) return;
    const message = {
      content: messageText,
      conversation_id: conversationId,
      parent_message_id:
        messages.length > 0 ? messages[messages.length - 1].id : null,
    };
    websocket.current.send(JSON.stringify(message));
    setMessageText("");
  };

  const containerVariant: ContainerVariant = "content";

  return (
    <div className={styles.pageContainer}>
      <div className={styles.messagesContainerWrapper}>
        <div className={styles.messagesContainer}>
          <Container
            variant={containerVariant}
            className={styles.messagesList}
          >
            {messages?.map((msg, index) => (
              <div key={index} className={styles.message}>
                {msg.content}
              </div>
            ))}
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
            <input
              className={styles.input}
              name="messageInputField"
              type="text"
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
  );
}