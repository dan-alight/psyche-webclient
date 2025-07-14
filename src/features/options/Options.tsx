import { useState, useEffect, useMemo } from "react";
import { Outlet, Link, NavLink } from "react-router";
import config from "@/config";
import type {
  AiProviderRead,
  ApiKeyCreate,
  ApiKeyUpdate,
  ApiKeyRead,
} from "@/types/api";
import SecondaryNavbar from "@/components/SecondaryNavbar";
import { useTheme } from "@emotion/react";
import { pxToRem } from "@/utils";
import { Container } from "@/components/Container";

export default function Options() {
  const theme = useTheme();
  //const sidebarWidth = useMemo(() => pxToRem(200), []);
  return (
    <div
      css={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        height: "100%",
      }}
    >
      {" "}
      <SecondaryNavbar>
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
      </SecondaryNavbar>
      <div
        css={{
          paddingLeft: `${theme.spacing.sm}rem`,
          paddingRight: `${theme.spacing.sm}rem`,
          flex: 1,
          overflowY: "auto",
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
