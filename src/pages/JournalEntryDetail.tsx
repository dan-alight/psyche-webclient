import { useState, useEffect } from "react";
import { useTheme } from "@emotion/react";
import { useParams, useNavigate, useLocation } from "react-router";
import type { JournalEntryRead, JournalEntryCreate } from "@/types/api";
import config from "@/config";
import { useJournalStore } from "@/stores/journal-store";

export default function JournalEntryDetail() {
  const { entryId } = useParams();
  if (!entryId) return null;
  const navigate = useNavigate();
  const location = useLocation();
  const { getEntryById } = useJournalStore();

  const cachedEntry = getEntryById(parseInt(entryId, 10));
  const [entry, setEntry] = useState<JournalEntryRead | null>(
    cachedEntry || null
  );
  const [isLoading, setIsLoading] = useState(!cachedEntry);

  const cameFromList = location.state?.fromList === true;

  const close = () => {
    if (cameFromList) {
      navigate(-1);
    } else {
      navigate("/journal", { replace: true });
    }
  };

  useEffect(() => {
    const getSingleEntry = async (id: string) => {
      try {
        console.log("Zustand: getting single entry because not in store");
        const res = await fetch(`${config.HTTP_URL}/journal-entries/${id}`);
        const json = await res.json();
        setEntry(json);
      } finally {
        setIsLoading(false);
      }
    };
    if (!entry) {
      getSingleEntry(entryId);
    }
  }, [entryId]);

  if (isLoading) return null;
  if (!entry) return <div>Entry not found.</div>;

  return (
    <div>
      <button onClick={close}>hello {entry.id}</button>
    </div>
  );
}
