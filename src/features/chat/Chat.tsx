/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from "react";
import { css, useTheme } from "@emotion/react";
import config from "@/config";

interface Message {
  id: number;
  conversationId: number;
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const theme = useTheme();
  const websocket = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${config.WS_URL}/chat`);
    websocket.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      // Assuming the backend echos the message in the format: { "echo": { "text": "..." } }
      if (response.echo && response.echo.text) {
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup on component unmount
    return () => {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;      
      ws.close();
      websocket.current = null;
    };
  }, []);

  const buttonStyles = css({
    backgroundColor: theme.colors.primary,
    color: theme.colors.text,
    border: `4px solid ${theme.colors.border}`,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,

  });

  return (
    <div>
      <button css={buttonStyles}>hello chat</button>
    </div>
  );
}
