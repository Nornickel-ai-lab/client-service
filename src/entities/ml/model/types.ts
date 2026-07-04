export type MlProviderId = 'gigachat' | 'ollama';

export interface MlProviderOption {
  id: MlProviderId;
  label: string;
  available: boolean;
  gigachat_configured?: boolean;
  llm_model?: string;
  embed_model?: string;
}

export interface MlProvidersResponse {
  default: MlProviderId;
  providers: MlProviderOption[];
}

export interface MlBulkJobResponse {
  status: string;
  job: string;
  provider: MlProviderId;
}
