import { useState, useEffect, useRef } from "react";
import { css, useTheme, Global } from "@emotion/react";
import config from "@/config";
import { Container, type ContainerVariant } from "@/components/Container";
import { pxToRem } from "@/utils";

const defaultTheme = {
  colors: {
    primary: "#61dafb",
    secondary: "#f0f2f5",
    background: "#ffffff",
    text: "#282c34",
    border: "#cccccc",
  },
  spacing: {
    sm: "8px",
    md: "16px",
    lg: "24px",
  },
};

export default function Chat() {
  const theme = useTheme() || defaultTheme;
  const websocket = useRef<WebSocket | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState(
    Array.from({ length: 50 }, (_, i) => `Message number ${i + 1}`)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket(`${config.WS_URL}/chat`);
    websocket.current = ws;
    ws.onopen = () => console.log("WebSocket connection established");
    ws.onmessage = (event) => {
      const res = JSON.parse(event.data);
      console.log("WebSocket res:", res);
      // setMessages(prev => [...prev, res.content]);
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
  }, []);

  const sendMessage = async () => {
    if (!websocket.current || !messageText.trim()) return;
    const message = { content: messageText };
    websocket.current.send(JSON.stringify(message));
    setMessages((prev) => [...prev, messageText]);
    setMessageText("");
  };

  const containerVariant: ContainerVariant = "content";

  return (
    // 1. This is the main container. It uses Flexbox to position its children.
    // It takes up 100% of the height given by the <Outlet> container in App.tsx.
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // This is key!
        scrollbarGutter: "stable",
      }}
    >
      {/* 2. This is the message list. It grows to fill all available space
           and handles its own scrolling. This PREVENTS the main page scrollbar from appearing. */}
      <div
        css={{
          flex: 1,
          overflowY: "auto", // This makes ONLY this container scrollable.
        }}
      >
        <Container
          variant={containerVariant}
          css={{
            display: "flex",
            flexDirection: "column",
            gap: `${theme.spacing.sm}rem`,
            padding: `${theme.spacing.sm}rem`,
            //marginBottom: `${theme.spacing.sm}rem`,
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              css={{
                padding: `${theme.spacing.sm}rem`,
                border: `1px solid ${theme.colors.border}`,
                marginBottom: theme.spacing.sm, // Add space between messages
              }}
            >
              {msg}
            </div>
          ))}
        </Container>
      </div>

      {/* 3. This is the form container. It no longer needs to be sticky.
           Flexbox places it naturally at the bottom. */}
      <div
        css={{
          scrollbarGutter: "stable",
          width: "100%",
          overflowY: "hidden",
   //marginBottom: 8,    
   paddingLeft:`${theme.spacing.sm}rem`,
   paddingRight:`${theme.spacing.sm}rem`,
   paddingBottom:`${theme.spacing.sm}rem`,
   boxSizing:"border-box"
        }}
      >
        <form
          css={{
            display: "flex",
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            maxWidth: pxToRem(theme.containerWidths[containerVariant]),
            width: "100%",

            //gap: theme.spacing.lg,

            margin: "0 auto",
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
              fontSize: `${theme.typography.fontSize.lg}rem`,
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
              //border: 0,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
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
  );
}
