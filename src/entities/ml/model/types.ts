export type MlProviderId = 'cloud' | 'ollama';

export interface MlProviderOption {
  id: MlProviderId;
  label: string;
  available: boolean;
  mock?: boolean;
  llm_model?: string;
  embed_model?: string;
}

export interface MlProvidersResponse {
  default: MlProviderId;
  providers: MlProviderOption[];
}
