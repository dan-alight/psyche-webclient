// src/routes/chat.tsx
import { useState, useRef } from "react";
import {
  Outlet,
  Link,
  useNavigate,
  createFileRoute,
  useParams,
} from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SecondaryNavbar from "@/components/SecondaryNavbar";
import type {
  ConversationMessageCreate,
  ConversationRead,
  ConversationUpdate,
  ConversationCreate,
} from "@/types/api";
import config from "@/config";
import styles from "./chat.module.scss";
import linkStyles from "@/styles/links.module.css";

export const Route = createFileRoute("/chat")({
  component: Chat,
});

async function fetchConversations(): Promise<ConversationRead[]> {
  const url = new URL(`${config.HTTP_URL}/conversations`);
  url.searchParams.append("limit", "100");
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

async function createConversation(
  conversation_create: ConversationCreate
): Promise<ConversationRead> {
  const res = await fetch(`${config.HTTP_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(conversation_create),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  return res.json();
}

async function deleteConversation(id: number): Promise<void> {
  const res = await fetch(`${config.HTTP_URL}/conversations/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete conversation");
}

async function updateConversation({
  id,
  conversation_update,
}: {
  id: number;
  conversation_update: ConversationUpdate;
}): Promise<ConversationRead> {
  const res = await fetch(`${config.HTTP_URL}/conversations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(conversation_update),
  });
  if (!res.ok) throw new Error("Failed to update conversation");
  return res.json();
}

function Chat() {
  const navigate = useNavigate({ from: "/chat" });
  const queryClient = useQueryClient();
  const params = useParams({ strict: false });

  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const conversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });

  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (newConv) => {
      queryClient.setQueryData<ConversationRead[]>(
        ["conversations"],
        (old = []) => [newConv, ...old]
      );
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ConversationRead[]>(
        ["conversations"],
        (old = []) => old.filter((c) => c.id !== deletedId)
      );
      if (
        "conversationId" in params &&
        params.conversationId === String(deletedId)
      ) {
        navigate({ to: "/chat" });
      }
    },
  });

  const updateConversationMutation = useMutation({
    mutationFn: updateConversation,
    onSuccess: (updatedConv) => {
      queryClient.setQueryData<ConversationRead[]>(
        ["conversations"],
        (old = []) =>
          old.map((c) => (c.id === updatedConv.id ? updatedConv : c))
      );
      setRenamingId(null);
    },
  });

  if (conversationsQuery.isLoading) return <div>Loading conversations...</div>;
  if (conversationsQuery.isError) return <div>Error loading conversations</div>;

  const conversations = conversationsQuery.data ?? [];

  const handleRename = (conversation: ConversationRead) => {
    setRenamingId(conversation.id);
    setNewTitle(conversation.title);
    setActiveMenu(null);
  };

  const handleDelete = (id: number) => {
    deleteConversationMutation.mutate(id);
    setActiveMenu(null);
  };

  const handleRenameSubmit = (id: number, oldTitle: string) => {
    const trimmedTitle = newTitle.trim();
    if (trimmedTitle && trimmedTitle !== oldTitle) {
      updateConversationMutation.mutate({
        id,
        conversation_update: { title: trimmedTitle },
      });
    }
    setRenamingId(null);
  };

  return (
    <>
      <SecondaryNavbar>
        <button
          onClick={async () => {
            const conv = await createConversationMutation.mutateAsync({
              title: "New Conversation",
            });
            navigate({
              to: "/chat/$conversationId",
              params: { conversationId: String(conv.id) },
            });
          }}
        >
          Start New Conversation
        </button>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={styles.conversationLinkContainer}
          >
            {renamingId === conversation.id ? (
              <input
                className={styles.renameInput}
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={() =>
                  handleRenameSubmit(conversation.id, conversation.title)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    handleRenameSubmit(conversation.id, conversation.title);
                  else if (e.key === "Escape") setRenamingId(null);
                }}
                autoFocus
              />
            ) : (
              <>
                <Link
                  to="/chat/$conversationId"
                  params={{ conversationId: String(conversation.id) }}
                  className={`${linkStyles.link} ${styles.conversationLink}`}
                  activeProps={{ "data-status": "active" }}
                >
                  <span className={styles.title}>{conversation.title}</span>
                </Link>
                <div
                  className={styles.menuContainer}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setActiveMenu(null);
                    }
                  }}
                >
                  <button
                    ref={(el) => {
                      buttonRefs.current[conversation.id] = el;
                    }}
                    className={styles.ellipsisButton}
                    onClick={() =>
                      setActiveMenu(
                        activeMenu === conversation.id ? null : conversation.id
                      )
                    }
                  >
                    &#x2026;
                  </button>
                  {activeMenu === conversation.id && (
                    <div className={styles.menu}>
                      <button onClick={() => handleRename(conversation)}>
                        Rename
                      </button>
                      <button onClick={() => handleDelete(conversation.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </SecondaryNavbar>
      <Outlet />
    </>
  );
}
