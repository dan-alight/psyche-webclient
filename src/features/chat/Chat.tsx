import { useState, useEffect, useRef, useMemo } from "react";
import { css, useTheme } from "@emotion/react";
import config from "@/config";
import { Container, type ContainerVariant } from "@/components/Container";
import { pxToRem } from "@/utils";
import { useControlPanel } from "@/contexts/ControlPanelContext";
import SecondaryNavbar from "@/components/SecondaryNavbar";
import ControlPanel from "@/app/ControlPanel";

export default function Chat() {
  const theme = useTheme();
  const websocket = useRef<WebSocket | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { setPanelContent } = useControlPanel();
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
      setPanelContent(null);
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

  const horizontalPadding = `${theme.spacing.sm}rem`;
  const verticalPadding = `${theme.spacing.sm}rem`;

  return (
    <>
      <SecondaryNavbar></SecondaryNavbar>
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
            minWidth: "min-content"
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
              {messages.map((msg, index) => (
                <div
                  key={index}
                  css={{
                    padding: verticalPadding,
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  {msg}
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
              overflowX:"hidden",
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
      <ControlPanel>
        <div>hello world</div>
      </ControlPanel>
    </>
  );
}