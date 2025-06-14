import { useTheme } from "@emotion/react";
import { Link } from "react-router";

export default function NavBar() {
  const theme = useTheme();
  return (
    <div
      css={{
        background: theme.colors.background,
        borderRight: `1px solid ${theme.colors.border}`,
        padding: `${theme.spacing.sm}rem`,
        display: "flex",
        flexDirection: "column",
        gap: `${theme.spacing.sm}rem`,
      }}
    >
      <Link to="/">Home</Link>
      <Link to="options">Options</Link>
    </div>
  );
}
