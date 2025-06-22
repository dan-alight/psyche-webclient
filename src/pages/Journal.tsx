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

const ITEMS_PER_PAGE = 30;

export default function Journal() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    journalEntries,
    journalStats,
    isLoading,
    initialized,
    fetchStats,
    fetchEntries,
    currentPage,
    createEntry,
  } = useJournalStore();
  const [newJournalEntry, setNewJournalEntry] = useState<JournalEntryCreate>({
    content: "",
  });
  const [navigateToEntry, setNavigateToEntry] = useState<number | null>(
    currentPage
  );

  useEffect(() => {
    if (currentPage) {
      setNavigateToEntry(currentPage);
    }
  }, [currentPage]);

  const handleCreate = async () => {
    if (!newJournalEntry.content.trim()) return;

    const initialMaxPage = Math.ceil(journalStats.count / ITEMS_PER_PAGE) || 1;
    const subsequentMaxPage =
      Math.ceil((journalStats.count + 1) / ITEMS_PER_PAGE) || 1;
    await createEntry(newJournalEntry);

    let activePage = currentPage ? currentPage : 0;
    if (initialMaxPage < subsequentMaxPage || activePage < subsequentMaxPage) {
      setSearchParams({ page: String(subsequentMaxPage) });
    } else {
      fetchEntries(subsequentMaxPage, ITEMS_PER_PAGE);
    }
    setNewJournalEntry({ content: "" });
  };

  useEffect(() => {
    if (!initialized) {
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
  }, [initialized, searchParams]);

  if (!currentPage) return null;

  const totalPages = Math.ceil(journalStats.count / ITEMS_PER_PAGE) || 1;

  return (
    <Container>
      <h1>Journal your life and manage previous entries</h1>

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

      <h2>Previous journal entries</h2>

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
          onClick={() => setSearchParams({ page: "1" })}
          disabled={currentPage <= 1 || isLoading}
        >
          {"<<"}
        </button>
        <button
          onClick={() => setSearchParams({ page: String(currentPage - 1) })}
          disabled={currentPage <= 1 || isLoading}
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
            } else {
              setNavigateToEntry(null);
            }
          }}
          min={1}
          max={totalPages}
          disabled={isLoading}
          css={{ textAlign: "center" }}
        />
        {"/"}
        <span>{totalPages}</span>
        <button
          css={{}}
          onClick={(e) => {
            setSearchParams({ page: String(navigateToEntry) });
          }}
        >
          Go
        </button>
        <button
          onClick={() => setSearchParams({ page: String(currentPage + 1) })}
          disabled={currentPage >= totalPages || isLoading}
        >
          {">"}
        </button>
        <button
          onClick={() => setSearchParams({ page: String(totalPages) })}
          disabled={currentPage >= totalPages || isLoading}
        >
          {">>"}
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
