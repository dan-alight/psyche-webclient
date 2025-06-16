import { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router";
import { Container } from "@/components/Container";
import type { JournalEntryRead, JournalEntryCreate } from "@/types/api";
import { useJournalStore } from "@/stores/journal-store";

function JournalEntryCreator() {
  const { createEntry } = useJournalStore();

  const [newJournalEntry, setNewJournalEntry] = useState<JournalEntryCreate>({
    content: "",
  });

  const handleCreate = async () => {
    if (!newJournalEntry.content.trim()) return;
    await createEntry(newJournalEntry);
    setNewJournalEntry({ content: "" });
  };

  return (
    <>
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
    </>
  );
}

const ITEMS_PER_PAGE = 10;

export default function Journal() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    journalEntries,
    journalStats,
    isLoading,
    fetchStats,
    fetchEntries,
    currentPage,
  } = useJournalStore();

  useEffect(() => {
    if (!journalStats) {
      fetchStats();
      return;
    }

    // Determine the target page from the URL, defaulting to the last page if not present
    const maxPage = Math.ceil(journalStats.count / ITEMS_PER_PAGE) || 1;
    let targetPage = parseInt(searchParams.get("page") || "0", 10);
    if (targetPage < 1 || targetPage > maxPage) {
      // If no valid page in URL, calculate the most recent page
      targetPage = maxPage;
    }

    // Only fetch if we are not already on the correct page
    if (currentPage !== targetPage) {
      fetchEntries(targetPage, ITEMS_PER_PAGE);
    }
  }, [journalStats, searchParams]);

  if (!journalStats || !currentPage) return null;

  const totalPages = Math.ceil(journalStats.count / ITEMS_PER_PAGE) || 1;

  return (
    <Container>
      <h1>Log your life and manage previous logs</h1>

      <JournalEntryCreator />
      <h2>Previous journal entries</h2>

      <div
        css={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={() => setSearchParams({ page: String(currentPage - 1) })}
          disabled={currentPage <= 1 || isLoading}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}{" "}
        </span>
        <button
          onClick={() => setSearchParams({ page: String(currentPage + 1) })}
          disabled={currentPage >= totalPages || isLoading}
        >
          Next
        </button>
      </div>

      {isLoading && journalEntries.length === 0 && (
        <div>Loading entries...</div>
      )}

      <div
        css={{
          display: "flex",
          flexDirection: "column",
          gap: `${theme.spacing.sm}rem`,
        }}
      >
        {journalEntries.map((journalEntry) => (
          <div key={journalEntry.id}>
            <div css={{ background: theme.colors.surface }}>
              {journalEntry.content}
            </div>
            <button
              onClick={() =>
                navigate(`/journal/${journalEntry.id}`, {
                  state: { fromList: true, fromPage: currentPage },
                })
              }
            >
              Manage
            </button>
          </div>
        ))}
      </div>
    </Container>
  );
}
