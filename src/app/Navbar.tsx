import { useTheme } from "@emotion/react";
import { Link, NavLink } from "react-router";
import { pxToRem } from "@/utils"; // Assuming you have a utility function for px to rem conversion

export default function Navbar() {
  const theme = useTheme();
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
      <NavLink
        to="/"
        end
        style={({ isActive }) => ({
          color: isActive
            ? theme.colors.link.active
            : theme.colors.link.default,
          fontWeight: isActive ? "bold" : "normal",
        })}
      >
        Home
      </NavLink>
      <NavLink
        to="journal"
        style={({ isActive }) => ({
          color: isActive
            ? theme.colors.link.active
            : theme.colors.link.default,
          fontWeight: isActive ? "bold" : "normal",
        })}
      >
        Journal
      </NavLink>
      <NavLink
        to="options"
        style={({ isActive }) => ({
          color: isActive
            ? theme.colors.link.active
            : theme.colors.link.default,
          fontWeight: isActive ? "bold" : "normal",
        })}
      >
        Options
      </NavLink>
    </div>
  );
}
