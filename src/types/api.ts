export const AiProviders = ["openai", "anthropic", "google"] as const;

export type AiProvider = (typeof AiProviders)[number];

export interface ApiKeyRead {
  id: number;
  key_value: string;
  provider: AiProvider;
  name: string;
  active: boolean;
}

export interface ApiKeyCreate {
  key_value: string;
  provider: AiProvider;
  name: string;
}

export interface ApiKeyUpdate {
  key_value: string;
  new_name?: string;
  new_active?: boolean;
}

export interface JournalEntryRead {
  id: number;
  content: string;
  created_at: string;
}

export interface JournalEntryCreate {
  content: string;
}

export interface JournalEntryStats {
  count: number;
}
