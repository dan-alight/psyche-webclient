import { useState, useEffect, useContext } from "react";
import { useTheme } from "@emotion/react";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router";
import { Container } from "@/components/Container";
import type {
  JournalEntryRead,
  JournalEntryCreate,
  JournalEntryUpdate,
} from "@/types/api";
import { useJournalStore } from "@/features/journal/journal-store";
import { ScrollContext } from "@/app/ScrollContext";

const ITEMS_PER_PAGE = 10;

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
    updateEntry,
    deleteEntry,
  } = useJournalStore();
  const [newJournalEntry, setNewJournalEntry] = useState<JournalEntryCreate>({
    content: "",
  });
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [navigateToEntry, setNavigateToEntry] = useState<number | null>(
    currentPage
  );
  const { scrollableContainerRef } = useContext(ScrollContext);

  useEffect(() => {
    if (currentPage) {
      setNavigateToEntry(currentPage);
      cancelEditing();
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

  const handleUpdate = async (id: number) => {
    if (!editingContent.trim()) return;
    await updateEntry(id, { content: editingContent });
    setEditingEntryId(null);
    setEditingContent("");
  };
  const handleDelete = async (entry: JournalEntryRead) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    await deleteEntry(entry.id);
    if (currentPage && journalEntries.length === 1) {
      // If we just deleted the last entry on the current page, go to the previous page
      const newPage = currentPage > 1 ? currentPage - 1 : 1;
      setSearchParams({ page: String(newPage) });
    }
  };
  const startEditing = (entry: JournalEntryRead) => {
    setEditingEntryId(entry.id);
    setEditingContent(entry.content);
  };

  const cancelEditing = () => {
    setEditingEntryId(null);
    setEditingContent("");
  };
  const maxPage = Math.ceil(journalStats.count / ITEMS_PER_PAGE) || 1;
  useEffect(() => {
    if (!initialized) {
      fetchStats();
      return;
    }

    // Determine the target page from the URL, defaulting to the last page if not present

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

  if (
    !currentPage ||
    (searchParams.get("page") === null && currentPage !== maxPage)
  )
    return null;

  const totalPages = Math.ceil(journalStats.count / ITEMS_PER_PAGE) || 1;

  return (
    <div
      ref={scrollableContainerRef}
      css={{ overflowY: "auto", height: "100%", flex: 1 }}
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
            name="navigateToEntry"
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
            //gap: `${theme.spacing.sm}rem`,
          }}
        >
          {journalEntries.map((journalEntry) => (
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
                  <button onClick={() => startEditing(journalEntry)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(journalEntry)}>
                    Delete
                  </button>
                  {/* <button
                    onClick={() =>
                      navigate(`/journal/${journalEntry.id}`, {
                        state: { fromList: true, fromPage: currentPage },
                      })
                    }
                  >
                    Manage
                  </button> */}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
