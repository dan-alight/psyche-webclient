// src/routes/chat.tsx
import { useTheme } from "@emotion/react";
import {
  Outlet,
  Link,
  useNavigate,
  createFileRoute,
} from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SecondaryNavbar from "@/components/SecondaryNavbar";
import ControlPanel from "@/components/ControlPanel";
import type { AiModelRead, ConversationRead } from "@/types/api";
import config from "@/config";

export const Route = createFileRoute("/chat")({
  component: Chat,
});

async function fetchConversations(): Promise<ConversationRead[]> {
  const res = await fetch(`${config.HTTP_URL}/conversations`);
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

async function createConversation(title: string): Promise<ConversationRead> {
  const res = await fetch(`${config.HTTP_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  return res.json();
}

async function fetchActiveModels(): Promise<AiModelRead[]> {
  const res = await fetch(`${config.HTTP_URL}/ai-models/active`);
  if (!res.ok) throw new Error("Failed to fetch active models");
  return res.json();
}

function Chat() {
  const theme = useTheme();
  const navigate = useNavigate({ from: "/chat" });
  const queryClient = useQueryClient();

  const conversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });

  const modelsQuery = useQuery({
    queryKey: ["activeModels"],
    queryFn: fetchActiveModels,
  });

  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (newConv) => {
      queryClient.setQueryData<ConversationRead[]>(["conversations"], (old) =>
        old ? [...old, newConv] : [newConv]
      );
    },
  });

  if (conversationsQuery.isLoading) return <div>Loading conversations...</div>;
  if (conversationsQuery.isError) return <div>Error loading conversations</div>;

  const conversations = conversationsQuery.data ?? [];
  const activeModels = modelsQuery.data ?? [];

  return (
    <>
      <SecondaryNavbar>
        <button
          onClick={async () => {
            const conv =
              await createConversationMutation.mutateAsync("New Conversation");
            navigate({
              to: "/chat/$conversationId",
              params: { conversationId: String(conv.id) },
            });
          }}
        >
          Start New Conversation
        </button>
        {conversations.map((conversation) => (
          <Link
            key={conversation.id}
            to="/chat/$conversationId"
            params={{ conversationId: String(conversation.id) }}
            activeProps={{
              style: {
                fontWeight: "bold",
                color: theme.colors.link.active,
              },
            }}
            inactiveProps={{
              style: {
                fontWeight: "normal",
                color: theme.colors.link.default,
              },
            }}
          >
            {conversation.title}
          </Link>
        ))}
      </SecondaryNavbar>
      <Outlet />
      <ControlPanel>
        {activeModels.map((model) => (
          <div key={model.id} css={{ marginBottom: `${theme.spacing.sm}rem` }}>
            <strong>{model.name}</strong>
          </div>
        ))}
      </ControlPanel>
    </>
  );
}
