import { Outlet, createRootRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/theme.css";
import styles from "./__root.module.css";

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
      <div className={styles.root}>
        <Navbar />
        <Outlet />
      </div>
    </QueryClientProvider>
  );
}