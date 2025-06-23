import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "@/app/App";
import Chat from "@/features/chat/Chat";
import Options from "@/features/options/Options";
import Journal from "@/features/journal/Journal";
import JournalEntryDetail from "@/features/journal/JournalEntryDetail";
import ApiKeys from "@/features/options/ApiKeys";
import Provider from "@/features/options/Provider";

let router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Chat,
      },
      {
        path: "options",
        Component: Options,
        children: [
          {
            index: true,
            Component: Provider,
          },
          {
            path: "api-keys",
            Component: ApiKeys,
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
