import React from "react";
import styles from "./ControlPanel.module.css";

export default function ControlPanel({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div className={styles.controlPanel}>{children}</div>;
}