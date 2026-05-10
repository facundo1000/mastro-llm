import { Provider } from './provider';

export interface AppSettings {
  baseUrl: string;
  authToken: string;
  selectedProvider: Provider;
  selectedModel: string;
  providerKeys: Partial<Record<Provider, string>>;
  systemPrompt: string;
  maxTokens: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  baseUrl: 'http://localhost:8080',
  authToken: '',
  selectedProvider: 'claude',
  selectedModel: 'claude-opus-4-7',
  providerKeys: {},
  systemPrompt: '',
  maxTokens: 1500,
};