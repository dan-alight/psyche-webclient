import { createContext, createRef } from "react";
import type { RefObject } from "react";

export interface ScrollContextType {
  scrollableContainerRef: RefObject<HTMLDivElement | null>;
}

export const ScrollContext = createContext<ScrollContextType>({
  scrollableContainerRef: createRef<HTMLDivElement>(),
});
