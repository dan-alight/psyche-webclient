// src/stores/journalStore.ts
import { create } from "zustand";
import type {
  JournalEntryRead,
  JournalEntryCreate,
  JournalEntryStats,
  JournalEntryUpdate,
} from "@/types/api";
import config from "@/config";

interface PaginatedResponse {
  data: JournalEntryRead[];
  has_more: boolean;
  items_per_page: number;
  page: number;
  total_count: number;
}

// Define the new shape of the store's state
interface JournalState {
  journalEntries: JournalEntryRead[]; // Holds ONLY the current page's entries
  journalStats: JournalEntryStats;
  isLoading: boolean;
  initialized: boolean;
  currentPage: number | null;
  fetchStats: () => Promise<void>;
  fetchEntries: (page: number, itemsPerPage: number) => Promise<void>;
  createEntry: (newEntryData: JournalEntryCreate) => Promise<void>;
  updateEntry: (
    id: number,
    updatedEntryData: JournalEntryUpdate
  ) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
  getEntryById: (id: number) => JournalEntryRead | undefined;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  // --- STATE ---
  journalEntries: [],
  isLoading: false,
  initialized: false,
  journalStats: { count: 0 },
  currentPage: null,

  // --- ACTIONS ---
  fetchStats: async () => {
    const res = await fetch(`${config.HTTP_URL}/journal-entries/stats`);
    const json: JournalEntryStats = await res.json();
    set({ journalStats: json, initialized: true });
  },
  /**
   * Fetches a specific page of journal entries from the API.
   * This action REPLACES the existing entries with the new page's data.
   */
  fetchEntries: async (page: number, itemsPerPage: number) => {
    set({ isLoading: true });
    try {
      // Use URLSearchParams for robust query string creation
      const params = new URLSearchParams({
        page: String(page),
        itemsPerPage: String(itemsPerPage),
      });
      const res = await fetch(`${config.HTTP_URL}/journal-entries?${params}`);
      const json: PaginatedResponse = await res.json();
      set({
        journalEntries: json.data.reverse() || [], // Replace with the new page's data
        isLoading: false,
        currentPage: page,
      });
    } catch (error) {
      console.error("Failed to fetch journal entries:", error);
      set({ isLoading: false });
    }
  },

  /**
   * Creates a new entry.
   */
  createEntry: async (newEntryData: JournalEntryCreate) => {
    await fetch(`${config.HTTP_URL}/journal-entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntryData),
    });
    set({
      journalStats: {
        ...get().journalStats,
        count: get().journalStats.count + 1,
      },
    });
  },

  updateEntry: async (id: number, updatedEntryData: JournalEntryUpdate) => {
    const res = await fetch(`${config.HTTP_URL}/journal-entries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEntryData),
    });
    const updatedEntry: JournalEntryRead = await res.json();
    console.log("Updated entry:", updatedEntry);
    set((state) => ({
      journalEntries: state.journalEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      ),
    }));
  },
  deleteEntry: async (id: number) => {
    await fetch(`${config.HTTP_URL}/journal-entries/${id}`, {
      method: "DELETE",
    });
    set((state) => ({
      journalEntries: state.journalEntries.filter((entry) => entry.id !== id),
      journalStats: {
        ...state.journalStats,
        count: state.journalStats.count - 1,
      },
    }));
  },
  getEntryById: (id: number) => {
    return get().journalEntries.find((entry) => entry.id === id);
  },
}));
