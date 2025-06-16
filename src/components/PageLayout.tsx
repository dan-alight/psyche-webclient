import { useContext } from "react";
import { Outlet } from "react-router";
import { ScrollContext } from "@/contexts/ScrollContext";

export function PageLayout() {
  const { scrollableContainerRef } = useContext(ScrollContext);

  return (
    <div
      ref={scrollableContainerRef}
      css={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
      }}
    >
      <Outlet />
    </div>
  );
}
