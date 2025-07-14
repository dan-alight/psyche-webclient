import React from "react";
import { useTheme } from "@emotion/react";
import { pxToRem } from "@/utils";

export default function ControlPanel({
  children,
}: {
  children?: React.ReactNode;
}) {
  const theme = useTheme();

  return (
    <div
      css={{
        maxWidth: pxToRem(200),
        width: "100%",
        padding: `${theme.spacing.sm}rem`,
        borderLeft: `1px solid ${theme.colors.separator}`,
        background: theme.colors.background,
        overflowY: "auto",
      }}
    >
      {children}
    </div>
  );
}
