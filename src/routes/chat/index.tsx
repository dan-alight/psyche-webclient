import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import styles from "./index.module.css";

export const Route = createFileRoute("/chat/")({
  component: ChatLanding,
});

function ChatLanding() {
  const navigate = useNavigate({ from: "/chat/" });

  useEffect(() => {}, []);

  return <div className={styles.container}></div>;
}