import { useEffect } from "react";
import { Outlet, NavLink } from "react-router";
import SecondaryNavbar from "@/components/SecondaryNavbar";
import ControlPanel from "@/app/ControlPanel";
import { useConversationStore } from "./conversation-store";

export default function Chat() {
  const { fetchConversations, initialized, conversations } =
    useConversationStore();

  useEffect(() => {
    if (!initialized) fetchConversations();
  }, [initialized]);

  return (
    <>
      <SecondaryNavbar>
        {conversations.map((conversation) => (
          <NavLink key={conversation.id} to={`${conversation.id}`}>
            {conversation.title}
          </NavLink>
        ))}
      </SecondaryNavbar>
      <Outlet />
      <ControlPanel>
        <div>hello world</div>
      </ControlPanel>
    </>
  );
}
