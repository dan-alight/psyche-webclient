import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@emotion/react";
import Navbar from "@/components/Navbar";
import { lightTheme } from "@/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Route = createRootRoute({
  component: RootLayout,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <div
          css={{
            display: "flex",
            height: "100vh",
          }}
        >
          <Navbar />
          <Outlet />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
