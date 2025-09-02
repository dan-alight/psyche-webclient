// src/routes/journal.tsx
import { useState, useEffect, useContext, use } from "react";
import { useTheme } from "@emotion/react";
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container } from "@/components/Container";
import type {
  JournalEntryRead,
  JournalEntryCreate,
  JournalEntryUpdate,
  JournalEntryStats,
} from "@/types/api";
import config from "@/config";

export const Route = createFileRoute("/journal/")({
  component: Journal,
  validateSearch: (search: Record<string, unknown>): { page?: number } => {
    return {
      page: search.page ? Number(search.page) : undefined,
    };
  },
});

const ITEMS_PER_PAGE = 10;

async function fetchStats(): Promise<JournalEntryStats> {
  const res = await fetch(`${config.HTTP_URL}/journal-entries/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

async function fetchEntries(
  page: number,
  itemsPerPage: number
): Promise<{ data: JournalEntryRead[]; total_count: number }> {
  const params = new URLSearchParams({
    page: String(page),
    itemsPerPage: String(itemsPerPage),
  });
  const res = await fetch(`${config.HTTP_URL}/journal-entries?${params}`);
  if (!res.ok) throw new Error("Failed to fetch entries");
  const json = await res.json();
  return {
    data: json.data.reverse() || [],
    total_count: json.total_count,
  };
}

async function createEntry(newEntryData: JournalEntryCreate) {
  const res = await fetch(`${config.HTTP_URL}/journal-entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEntryData),
  });
  if (!res.ok) throw new Error("Failed to create entry");
  return res.json();
}

async function updateEntry(id: number, updatedEntryData: JournalEntryUpdate) {
  const res = await fetch(`${config.HTTP_URL}/journal-entries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedEntryData),
  });
  if (!res.ok) throw new Error("Failed to update entry");
  return res.json();
}

async function deleteEntry(id: number) {
  const res = await fetch(`${config.HTTP_URL}/journal-entries/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete entry");
  return true;
}

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  isFetching: boolean;
}

function PaginationControls({
  currentPage,
  totalPages,
  isFetching,
}: PaginationControlsProps) {
  const theme = useTheme();
  const navigate = useNavigate({ from: Route.fullPath });

  const [navigateToEntry, setNavigateToEntry] = useState<number | undefined>(
    currentPage
  );

  return (
    <div
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: `${theme.spacing.sm}rem`,
        gap: `${theme.spacing.sm}rem`,
      }}
    >
      <button
        onClick={() => navigate({ search: { page: 1 } })}
        disabled={currentPage <= 1 || isFetching}
      >
        {"<<"}
      </button>
      <button
        onClick={() => navigate({ search: { page: currentPage - 1 } })}
        disabled={currentPage <= 1 || isFetching}
      >
        {"<"}
      </button>
      <input
        type="number"
        value={navigateToEntry ?? ""}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          if (!isNaN(value) && value >= 1 && value <= totalPages) {
            setNavigateToEntry(value);
          } else if (e.target.value === "") {
            setNavigateToEntry(undefined);
          }
        }}
        onBlur={() => {
          // Optional: Reset to current page if input is cleared
          if (navigateToEntry === undefined) {
            setNavigateToEntry(currentPage);
          }
        }}
        min={1}
        max={totalPages}
        disabled={isFetching}
        css={{ textAlign: "center" }}
        name="navigateToEntry"
      />
      {"/"}
      <span>{totalPages}</span>
      <button
        onClick={() => {
          if (navigateToEntry) {
            navigate({ search: { page: navigateToEntry } });
          }
        }}
        disabled={!navigateToEntry}
      >
        Go
      </button>
      <button
        onClick={() => navigate({ search: { page: currentPage + 1 } })}
        disabled={currentPage >= totalPages || isFetching}
      >
        {">"}
      </button>
      <button
        onClick={() => navigate({ search: { page: totalPages } })}
        disabled={currentPage >= totalPages || isFetching}
      >
        {" >>"}
      </button>
    </div>
  );
}

function Journal() {
  const theme = useTheme();
  const navigate = useNavigate({ from: Route.fullPath });
  const { page: pageSearchParam } = useSearch({ from: Route.fullPath });
  const queryClient = useQueryClient();

  const [newJournalEntry, setNewJournalEntry] = useState<JournalEntryCreate>({
    content: "",
  });
  const [editingEntryId, setEditingEntryId] = useState<number | undefined>();
  const [editingContent, setEditingContent] = useState("");

  const statsQuery = useQuery({
    queryKey: ["journalStats"],
    queryFn: fetchStats,
  });

  const totalPages = Math.max(
    1,
    Math.ceil((statsQuery.data?.count ?? 0) / ITEMS_PER_PAGE)
  );

  const currentPage = pageSearchParam ?? totalPages;

  const {
    data: journalEntries,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["journalEntries", currentPage],
    queryFn: () => fetchEntries(currentPage, ITEMS_PER_PAGE),
    enabled: !!statsQuery.data,
  });

  const createMutation = useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalStats"] });
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: JournalEntryUpdate }) =>
      updateEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalStats"] });
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
    },
  });

  const cancelEditing = () => {
    setEditingEntryId(undefined);
    setEditingContent("");
  };

  const handleCreate = async () => {
    if (!newJournalEntry.content.trim()) return;

    const initialMaxPage = Math.ceil(
      (statsQuery.data?.count ?? 0) / ITEMS_PER_PAGE
    );
    await createMutation.mutateAsync(newJournalEntry);

    const newMaxPage = Math.ceil(
      ((statsQuery.data?.count ?? 0) + 1) / ITEMS_PER_PAGE
    );

    if (initialMaxPage < newMaxPage || currentPage < newMaxPage) {
      navigate({ search: { page: newMaxPage } });
    } else {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
    }

    setNewJournalEntry({ content: "" });
  };

  const handleUpdate = async (id: number) => {
    if (!editingContent.trim()) return;
    await updateMutation.mutateAsync({ id, data: { content: editingContent } });
    cancelEditing();
  };

  const handleDelete = async (entry: JournalEntryRead) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    await deleteMutation.mutateAsync(entry.id);

    if (journalEntries?.data.length === 1 && currentPage > 1) {
      navigate({ search: { page: currentPage - 1 } });
    }
  };

  // --- RENDER ---
  if (statsQuery.isLoading) return <div>Loading stats...</div>;
  if (statsQuery.isError) return <div>Error loading stats</div>;

  if (isLoading && !journalEntries) return <div>Loading entries...</div>;
  if (isError) return <div>Error loading entries</div>;

  return (
    <div
      css={{
        overflowY: "auto",
        height: "100%",
        flex: 1,
        scrollbarGutter: "stable",
      }}
    >
      <Container>
        <h1>Journal</h1>

        <textarea
          name="logtextarea"
          css={{ width: "100%" }}
          rows={15}
          placeholder="What do you want to say?"
          onChange={(e) => setNewJournalEntry({ content: e.target.value })}
          value={newJournalEntry.content}
        />
        <button css={{ alignSelf: "self-start" }} onClick={handleCreate}>
          Save
        </button>

        <h2>Previous entries</h2>

        <PaginationControls
          key={currentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          isFetching={isFetching}
        />

        <div
          css={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {journalEntries?.data.map((journalEntry) => (
            <div
              key={journalEntry.id}
              css={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {editingEntryId === journalEntry.id ? (
                <textarea
                  css={{ width: "100%" }}
                  rows={10}
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
              ) : (
                <div
                  css={{
                    background: theme.colors.surface,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {journalEntry.content}
                </div>
              )}
              {editingEntryId === journalEntry.id ? (
                <div>
                  <button onClick={() => handleUpdate(journalEntry.id)}>
                    Save
                  </button>
                  <button onClick={cancelEditing}>Cancel</button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => {
                      setEditingEntryId(journalEntry.id);
                      setEditingContent(journalEntry.content);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(journalEntry)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
