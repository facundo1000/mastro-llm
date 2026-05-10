import { Provider } from './provider';

export interface AppSettings {
  selectedProvider: Provider;
  selectedModel: string;
  providerKeys: Partial<Record<Provider, string>>;
  systemPrompt: string;
  maxTokens: number;
}

export const DEFAULT_SETTINGS: AppSettings = {
  selectedProvider: 'claude',
  selectedModel: 'claude-opus-4-7',
  providerKeys: {},
  systemPrompt: '',
  maxTokens: 1500,
};