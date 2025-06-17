import React from "react";
import { useControlPanel } from "../contexts/ControlPanelContext";

/**
 * Renders the content provided by the ControlPanelContext.
 * If the content is null, this component renders nothing.
 */
export const ControlPanel: React.FC = () => {
  const { panelContent } = useControlPanel();

  // If there is no content, don't render the panel.
  if (!panelContent) {
    return null;
  }

  // A basic container for the panel. You can add your styling here.
  // Using css prop as seen in your App example.
  return (
    <div
      css={{
        width: "250px", // Example width
        padding: "1rem",
        borderLeft: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
        overflowY: "auto",
      }}
    >
      {panelContent}
    </div>
  );
};
