export type MlProviderId = 'cloud' | 'ollama';

export interface MlProviderOption {
  id: MlProviderId;
  label: string;
  available: boolean;
  yandex_configured?: boolean;
  mock_fallback?: boolean;
  llm_model?: string;
  embed_model?: string;
  embed_doc_model?: string;
  embed_query_model?: string;
}

export interface MlProvidersResponse {
  default: MlProviderId;
  providers: MlProviderOption[];
}
