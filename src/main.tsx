import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import App from "@/App";
import Chat from "@/pages/Chat";
import Options from "@/pages/Options";
import Journal from "./pages/Journal";
import JournalEntryDetail from "./pages/JournalEntryDetail";

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
