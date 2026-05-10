export type Provider = 'claude' | 'openai' | 'gemini' | 'groq';

export interface ProviderInfo {
  id: Provider;
  label: string;
  defaultModel: string;
  models: string[];
  apiKeyUrl: string;
}
