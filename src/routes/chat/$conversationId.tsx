import { useState, useEffect, useRef } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@emotion/react";
import config from "@/config";
import { Container, type ContainerVariant } from "@/components/Container";
import { pxToRem } from "@/utils";
import type { ConversationMessageRead } from "@/types/api";

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
  const theme = useTheme();
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

  const horizontalPadding = `${theme.spacing.sm}rem`;
  const verticalPadding = `${theme.spacing.sm}rem`;

  return (
    <div
      css={{
        width: "100%",
        overflowX: "auto",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flex: 1,
          minWidth: "min-content",
        }}
      >
        <div
          css={{
            flex: 1,
            overflowY: "auto",
            scrollbarGutter: "stable",
          }}
        >
          <Container
            variant={containerVariant}
            css={{
              display: "flex",
              flexDirection: "column",
              gap: verticalPadding,
              paddingLeft: `${horizontalPadding}`,
              paddingRight: `${horizontalPadding}`,
              paddingTop: `${verticalPadding}`,
              width: `calc(100% - (${horizontalPadding} * 2))`,
              overflowX: "hidden",
            }}
          >
            {messages?.map((msg, index) => (
              <div
                key={index}
                css={{
                  padding: verticalPadding,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </Container>
        </div>
        <div
          css={{
            scrollbarGutter: "stable",
            width: "100%",
            overflowY: "hidden",
            overflowX: "hidden",
            paddingBottom: verticalPadding,
          }}
        >
          <form
            css={{
              display: "flex",
              paddingLeft: `${horizontalPadding}`,
              paddingRight: `${horizontalPadding}`,
              maxWidth: pxToRem(theme.containerWidths[containerVariant]),
              margin: "0 auto",
              width: `calc(100% - (${horizontalPadding} * 2))`,
            }}
            name="sendMessageForm"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <input
              css={{
                flex: 1,
                padding: `${theme.spacing.md}rem`,
                fontSize: `${theme.typography.fontSize.sm}rem`,
              }}
              name="messageInputField"
              type="text"
              required
              placeholder="Enter your message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button
              type="submit"
              css={{
                background: theme.colors.primary,
                padding: `${theme.spacing.sm}rem ${theme.spacing.md}rem`,
                fontSize: `${theme.typography.fontSize.lg}rem`,
                cursor: "pointer",
                "&:hover": {
                  filter: "brightness(95%)",
                },
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
