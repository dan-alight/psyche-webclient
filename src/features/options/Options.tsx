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
  //const sidebarWidth = useMemo(() => pxToRem(200), []);
  return (
    <div
      css={{
        display: "flex",
        flexDirection: "row",
        height:"100%"
        //width: "100%",
      }}
    >
      <div
        css={{
          position: "sticky",
          top: 0,
          height: "100vh",
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
      </div>

      <div
        css={{
          paddingLeft: `${theme.spacing.sm}rem`,
          paddingRight: `${theme.spacing.sm}rem`,
          flex: 1,
          overflowY:"auto"
          //paddingBottom: `${theme.spacing.sm}rem`,
          //boxSizing: "border-box",
          //marginLeft: sidebarWidth,
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
