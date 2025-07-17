// src/features/chat/conversation-store.ts
import { create } from "zustand";
import type { ConversationRead } from "@/types/api";
import config from "@/config";

// Define the shape of the store's state
interface ConversationState {
  conversations: ConversationRead[];
  isLoading: boolean;
  initialized: boolean;
  fetchConversations: () => Promise<void>;
  getConversationById: (id: number) => ConversationRead | undefined;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  // --- STATE ---
  conversations: [],
  isLoading: false,
  initialized: false,

  // --- ACTIONS ---
  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${config.HTTP_URL}/conversations`);
      const data = await res.json();
      set({
        conversations: data,
        isLoading: false,
        initialized: true,
      });
      console.log("conv:", data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      set({ isLoading: false });
    }
  },

  getConversationById: (id: number) => {
    return get().conversations.find((convo) => convo.id === id);
  },
}));
