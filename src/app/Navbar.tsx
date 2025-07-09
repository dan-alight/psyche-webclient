import { useTheme } from "@emotion/react";
import { Link, NavLink } from "react-router";

export default function Navbar() {
  const theme = useTheme();
  return (
    <>
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
      </>
    
  );
}
