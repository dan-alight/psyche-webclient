import { useRef, useLayoutEffect } from "react";
import { useLocation, Outlet } from "react-router";
import { ThemeProvider } from "@emotion/react";
import { ScrollContext } from "@/app/ScrollContext";
import Navbar from "@/app/Navbar";
import { lightTheme, darkTheme } from "@/app/themes";
import { ControlPanelProvider } from "@/contexts/ControlPanelContext";
import { ControlPanel } from "@/app/ControlPanel";

// This map still stores the scroll positions.
const scrollPositions = new Map<string, number>();

function App() {
  const location = useLocation();
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  // We use useLayoutEffect to ensure the container is in the DOM.
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

  return (
    <ControlPanelProvider>
      <ScrollContext.Provider value={{ scrollableContainerRef }}>
        <ThemeProvider theme={lightTheme}>
          <div css={{ display: "flex", height: "100vh" }}>
            <Navbar />
            <div
              ref={scrollableContainerRef}
              css={(theme) => ({
                flex: 1,
                overflowY: "auto",
                background: theme.colors.background,
                minHeight: 0,
              })}
            >
              <Outlet />
            </div>
            <ControlPanel />
          </div>
        </ThemeProvider>
      </ScrollContext.Provider>
    </ControlPanelProvider>
  );
}

export default App;
