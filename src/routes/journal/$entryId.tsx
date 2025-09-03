import { useMemo, useEffect } from "react";
import {
  createFileRoute,
  useParams,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { JournalEntryRead } from "@/types/api";
import config from "@/config";
import { Container } from "@/components/Container";
import styles from "./$entryId.module.css";

export const Route = createFileRoute("/journal/$entryId")({
  component: JournalEntryDetail,
  validateSearch: (search: Record<string, unknown>): { fromList: boolean } => {
    return { fromList: search.fromList === true };
  },
});

async function fetchEntry(id: string): Promise<JournalEntryRead> {
  const res = await fetch(`${config.HTTP_URL}/journal-entries/${id}`);
  if (!res.ok) throw new Error("Failed to fetch entry");
  return res.json();
}

function JournalEntryDetail() {
  const { entryId } = useParams({ from: "/journal/$entryId" });
  const navigate = useNavigate({ from: "/journal/$entryId" });
  const { fromList } = useSearch({ from: "/journal/$entryId" });

  const {
    data: entry,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["journalEntry", entryId],
    queryFn: () => fetchEntry(entryId),
  });

  const close = () => {
    if (fromList) {
      navigate({ to: "..", search: true });
    } else {
      navigate({ to: "/journal", replace: true });
    }
  };

  if (isLoading) return null;
  if (isError || !entry) return <div>Entry not found.</div>;

  return (
    <Container>
      <div className={styles.content}>
        <p>{entry.content}</p>
      </div>
      <span>{entry.created_at}</span>
      <button onClick={close}>Close</button>
    </Container>
  );
}
