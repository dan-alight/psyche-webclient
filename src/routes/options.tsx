import { Outlet, Link, createFileRoute } from "@tanstack/react-router";
import SecondaryNavbar from "@/components/SecondaryNavbar";
import { useTheme } from "@emotion/react";

export const Route = createFileRoute("/options")({
  component: Options,
});

function Options() {
  const theme = useTheme();
  return (
    <div
      css={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        height: "100%",
      }}
    >
      <SecondaryNavbar>
        <Link
          to="/options"
          activeProps={{
            style: {
              fontWeight: "bold",
              color: theme.colors.link.active,
            },
          }}
          inactiveProps={{
            style: {
              fontWeight: "normal",
              color: theme.colors.link.default,
            },
          }}
        >
          Providers
        </Link>
      </SecondaryNavbar>
      <div
        css={{
          paddingLeft: `${theme.spacing.sm}rem`,
          paddingRight: `${theme.spacing.sm}rem`,
          flex: 1,
          overflowY: "auto",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
