export interface AiProviderRead {
  id: number;
  name: string;
  base_url: string;
}

export interface AiProviderCreate {
  name: string;
  base_url: string;
}

export interface ApiKeyRead {
  id: number;
  key_value: string;
  provider_id: number;
  name: string;
  active: boolean;
}

export interface ApiKeyCreate {
  provider_id: number;
  key_value: string;
  name: string;
}

export interface ApiKeyUpdate {
  provider_id: number;
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
