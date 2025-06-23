import { useState, useEffect } from "react";
import { Outlet, Link, NavLink } from "react-router";
import config from "@/config";
import type {
  AiProvider,
  ApiKeyCreate,
  ApiKeyUpdate,
  ApiKeyRead,
} from "@/types/api";
import { AiProviders } from "@/types/api";
import { useTheme } from "@emotion/react";
import { pxToRem } from "@/utils";
import { Container } from "@/components/Container";
import ApiKeys from "@/features/options/ApiKeys";

export default function Options() {
  const theme = useTheme();

  return (
    <Container variant="wide" css={{ display: "flex", flexDirection: "row" }}>
      <div
        css={{
          padding: `${theme.spacing.sm}rem`,
          borderRight: `1px solid #ccc`,
          maxWidth: `${pxToRem(200)}`,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: `${theme.spacing.sm}rem`,
        }}
      >
        <NavLink
          to="/options"
          end
          style={({ isActive }) => ({
            color: isActive ? theme.colors.link.active : theme.colors.link.default,
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Providers
        </NavLink>

        <NavLink
          to="/options/api-keys"
          style={({ isActive }) => ({
            color: isActive ? theme.colors.link.active : theme.colors.link.default,
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          API Keys
        </NavLink>
      </div>
      <div
        css={{
          height: "100vh",
          overflowY: "auto",
          flex: 1,
          padding: `${theme.spacing.sm}rem`,
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </div>
    </Container>
  );
}
