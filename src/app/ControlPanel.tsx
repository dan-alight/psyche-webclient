import React from "react";
import { useControlPanel } from "../contexts/ControlPanelContext";
import { useTheme } from "@emotion/react";

/**
 * Renders the content provided by the ControlPanelContext.
 * If the content is null, this component renders nothing.
 */
export const ControlPanel: React.FC = () => {
  const { panelContent } = useControlPanel();
  const theme = useTheme();

  // If there is no content, don't render the panel.
  if (!panelContent) {
    return null;
  }

  // A basic container for the panel. You can add your styling here.
  // Using css prop as seen in your App example.
  return (
    <div
      css={{
        maxWidth: "16rem",
        width:"100%",
        //padding: `${theme.spacing.sm}rem`,
        borderLeft: `1px solid ${theme.colors.separator}`,
        background: theme.colors.background,
        overflowY: "auto",
      }}
    >
      {panelContent}
    </div>
  );
};
