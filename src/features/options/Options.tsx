import { useState, useEffect, useMemo } from "react";
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
  const sidebarWidth = useMemo(() => pxToRem(200), []);
  return (
    <Container
      variant="wide"
      /*       css={{
        display: "grid",
        gridTemplateColumns: "1fr 5fr",
        // The container itself should align to the start of the grid/flex context
        // to prevent weird sticky behavior.
        alignItems: "start",
      }} */
    >
      {/* This sidebar becomes sticky within the main scrolling container */}
      <div
        css={{
          // Sticky positioning
          position: "fixed",
          //top: 0,
          // Give it full height to look correct
          height: "100%",
          minWidth: sidebarWidth, // Fixed width for the sidebar
          // Original styles
          padding: `${theme.spacing.sm}rem`,
          borderRight: `1px solid ${theme.colors.separator}`,
          display: "flex",
          flexDirection: "column",
          gap: `${theme.spacing.sm}rem`,
          boxSizing: "border-box",
        }}
      >
        <NavLink to="/options" end /* ... */>
          Providers
        </NavLink>
        {/* ... other sidebar content ... */}
      </div>

      {/* 
        This content area is now simple.
        - NO height
        - NO overflowY
        It will grow as tall as its content, which will cause the PARENT (in App.tsx) to scroll.
      */}
      <div
        css={{
          padding: `${theme.spacing.sm}rem`,
          boxSizing: "border-box",
          marginLeft: sidebarWidth
        }}
      >
        <Outlet />
      </div>
    </Container>
  );
}
