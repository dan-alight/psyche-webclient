import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import "./index.css";
import App from "@/app/App";
import Chat from "@/features/chat/Chat";
import Conversation from "./features/chat/Conversation";
import ChatLanding from "./features/chat/ChatLanding";
import Options from "@/features/options/Options";
import Journal from "@/features/journal/Journal";
import JournalEntryDetail from "@/features/journal/JournalEntryDetail";
import Providers from "@/features/options/Providers";

let router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        element: <Navigate to="/chat" replace />,
      },
      {
        path: "chat",

        Component: Chat,
        children: [
          {
            index: true,
            Component: ChatLanding,
          },
          {
            path: ":conversationId",
            Component: Conversation,
          },
        ],
      },
      {
        path: "options",
        Component: Options,
        children: [
          {
            index: true,
            Component: Providers,
          },
        ],
      },
      {
        path: "journal",
        Component: Journal,
      },
      {
        path: "journal/:entryId",
        Component: JournalEntryDetail,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
