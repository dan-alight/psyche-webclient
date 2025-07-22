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
  name?: string;
  active?: boolean;
}

export interface AiModelRead {
  id: number;
  name: string;
  provider_id: number;
  active: boolean;
}

export interface AiModelUpdate {
  active?: boolean;
}

export interface JournalEntryRead {
  id: number;
  content: string;
  created_at: string;
}

export interface JournalEntryCreate {
  content: string;
}

export interface JournalEntryUpdate {
  content?: string;
}

export interface JournalEntryStats {
  count: number;
}

export interface ConversationRead {
  id: number;
  title: string;
  last_updated: string;
}

export interface ConversationMessageRead {
  id: number;
  conversation_id: number;
  parent_message_id?: number;
  content: string;
  role: string;
  created_at: string;
}

export interface ConversationUpdate {
  title?: string | null;
}