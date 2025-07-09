import { useRef, useLayoutEffect, useMemo, use } from "react";
import { useLocation, Outlet } from "react-router";
import { ThemeProvider } from "@emotion/react";
import { ScrollContext } from "@/app/ScrollContext";
import Navbar from "@/app/Navbar";
import { lightTheme, darkTheme } from "@/app/themes";
import { ControlPanelProvider } from "@/contexts/ControlPanelContext";
import { ControlPanel } from "@/app/ControlPanel";
import { pxToRem } from "@/utils";

// This map still stores the scroll positions.
const scrollPositions = new Map<string, number>();

function App() {
  const location = useLocation();
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = scrollableContainerRef.current;
    if (!container) return;

    // This function will be called every time the user scrolls.
    const handleScroll = () => {
      // We save the scroll position for the current location's key.
      scrollPositions.set(location.key, container.scrollTop);
    };

    // Restore the scroll position when the component mounts or location changes.
    // We get the saved position, defaulting to 0 if it's a new page.
    const scrollY = scrollPositions.get(location.key) ?? 0;
    container.scrollTo(0, scrollY);

    // Add the event listener.
    container.addEventListener("scroll", handleScroll, { passive: true });

    // This is the cleanup function. It runs when the page is changed.
    return () => {
      // We remove the listener to prevent memory leaks and errors.
      container.removeEventListener("scroll", handleScroll);
    };
    // The effect re-runs ONLY when the location.key changes (i.e., new page).
  }, [location.key]);

  const sidebarWidth = useMemo(() => pxToRem(100), []);

  return (
    <ControlPanelProvider>
      <ScrollContext.Provider value={{ scrollableContainerRef }}>
        <ThemeProvider theme={lightTheme}>
          {/* 
            THIS is now the main scrolling container.
            - It gets the ref.
            - It gets the overflowY.
          */}
          <div
            ref={scrollableContainerRef}
            css={{
              display: "flex",
              height: "100vh",
              overflowY: "auto", // The scrollbar for this div will be on the far right.
              scrollbarGutter: "stable", // Prevents layout shifts when scrollbar appears/disappears.
            }}
          >
            <div
              css={(theme) => ({
                background: theme.colors.background,
                borderRight: `1px solid ${theme.colors.separator}`,
                padding: `${theme.spacing.sm}rem`,
                display: "flex",
                flexDirection: "column",
                gap: `${theme.spacing.sm}rem`,
                boxSizing: "border-box",
                minWidth: sidebarWidth, // Fixed width for the sidebar
                position: "fixed",
                height: "100%",
              })}
            >
              <Navbar /> {/* Assuming Navbar is just the content now */}
            </div>

            <div
              css={(theme) => ({
                flex: 1, // Takes up remaining space
                background: theme.colors.background,
                marginLeft: sidebarWidth, // Adjust to match sidebar width
              })}
            >
              <Outlet />
            </div>
            {/* ControlPanel also becomes sticky */}
            <div
              css={(theme) => ({
                // Sticky positioning
                position: "fixed",
              })}
            >
              <ControlPanel />
            </div>
          </div>
        </ThemeProvider>
      </ScrollContext.Provider>
    </ControlPanelProvider>
  );
}

export default App;
