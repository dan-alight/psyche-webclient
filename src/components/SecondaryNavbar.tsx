import { NavLink } from "react-router";
import { pxToRem } from "@/utils";
import { useTheme } from "@emotion/react";

export default function SecondaryNavbar({
  children,
}: {
  children?: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <div
      css={{
        position: "sticky",
        top: 0,
        maxWidth: pxToRem(200),
        width: "100%",

        padding: `${theme.spacing.sm}rem`,
        borderRight: `1px solid ${theme.colors.separator}`,
        display: "flex",
        flexDirection: "column",
        gap: `${theme.spacing.sm}rem`,
        boxSizing: "border-box",
        background: theme.colors.background,
      }}
    >
      {children}
    </div>
  );
}
