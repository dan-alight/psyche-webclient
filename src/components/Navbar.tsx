import { useTheme } from "@emotion/react";
import { css } from "@emotion/react";
import { Link } from "@tanstack/react-router";
import { pxToRem } from "@/utils";

export default function Navbar() {
  const theme = useTheme();

  const activeProps = {
    style: {
      fontWeight: "bold",
      color: theme.colors.link.active,
    },
  };

  const inactiveProps = {
    style: {
      fontWeight: "normal",
      color: theme.colors.link.default,
    },
  };

  return (
    <div
      css={(theme) => ({
        background: theme.colors.background,
        borderRight: `1px solid ${theme.colors.separator}`,
        padding: `${theme.spacing.sm}rem`,
        display: "flex",
        flexDirection: "column",
        gap: `${theme.spacing.sm}rem`,
        boxSizing: "border-box",
        maxWidth: pxToRem(100),
        width: "100%",
        position: "sticky",
        top: 0,
        height: "100vh",
      })}
    >
      <Link to="/chat" activeProps={activeProps} inactiveProps={inactiveProps}>
        Chat
      </Link>
      <Link
        to="/journal"
        activeProps={activeProps}
        inactiveProps={inactiveProps}
      >
        Journal
      </Link>
      <Link
        to="/options"
        activeProps={activeProps}
        inactiveProps={inactiveProps}
      >
        Options
      </Link>
    </div>
  );
}
