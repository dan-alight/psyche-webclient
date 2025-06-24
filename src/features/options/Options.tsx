import { useState, useEffect } from "react";
import { Outlet, Link, NavLink } from "react-router";
import config from "@/config";
import type {
  AiProviderRead,
  ApiKeyCreate,
  ApiKeyUpdate,
  ApiKeyRead,
} from "@/types/api";

import { useTheme } from "@emotion/react";
import { pxToRem } from "@/utils";
import { Container } from "@/components/Container";

export default function Options() {
  const theme = useTheme();

  return (
    <Container
      variant="wide"
      css={{
        display: "grid",
        gridTemplateColumns: "1fr 5fr", // Same 1:2 ratio, more explicit
      }}
    >
      <div
        css={{
          padding: `${theme.spacing.sm}rem`,
          //borderRight: `1px solid ${theme.colors.separator}`,
          display: "flex",
          flexDirection: "column",
          gap: `${theme.spacing.sm}rem`,
        }}
      >
        <NavLink
          to="/options"
          end
          style={({ isActive }) => ({
            color: isActive
              ? theme.colors.link.active
              : theme.colors.link.default,
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Providers
        </NavLink>

        {/* sidebar content */}
      </div>
      <div
        css={{
          height: "100vh",
          overflowY: "auto",
          padding: `${theme.spacing.sm}rem`,
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </div>
    </Container>
  );
}
