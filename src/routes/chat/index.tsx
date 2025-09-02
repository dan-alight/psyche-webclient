import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/chat/")({
  component: ChatLanding,
});

function ChatLanding() {
  const navigate = useNavigate({ from: "/chat/" });

  useEffect(() => {}, []);

  return (
    <div
      css={{
        width: "100%",
        overflowX: "auto",
      }}
    ></div>
  );
}
