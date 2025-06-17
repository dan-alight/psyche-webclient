import React, {
  createContext,
  useState,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

// Define the shape of the context data
interface ControlPanelContextType {
  panelContent: ReactNode | null;
  setPanelContent: (content: ReactNode | null) => void;
}

// Create the context, initially null
const ControlPanelContext = createContext<ControlPanelContextType | null>(null);

// Create the Provider component
interface ControlPanelProviderProps {
  children: ReactNode;
}

export const ControlPanelProvider: React.FC<ControlPanelProviderProps> = ({
  children,
}) => {
  const [panelContent, setPanelContent] = useState<ReactNode | null>(null);

  // useMemo ensures the context value object is stable, preventing unnecessary re-renders
  // for consumers when the state hasn't actually changed.
  const value = useMemo(
    () => ({ panelContent, setPanelContent }),
    [panelContent]
  );

  return (
    <ControlPanelContext.Provider value={value}>
      {children}
    </ControlPanelContext.Provider>
  );
};

// Create a custom hook for consuming the context
export const useControlPanel = (): ControlPanelContextType => {
  const context = useContext(ControlPanelContext);

  // This error ensures the hook is used within a ControlPanelProvider
  if (!context) {
    throw new Error(
      "useControlPanel must be used within a ControlPanelProvider"
    );
  }

  return context;
};
