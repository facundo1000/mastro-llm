import { Injectable, computed, inject, signal } from '@angular/core';
import { AppSettings, DEFAULT_SETTINGS } from '@/domain/entities';
import { Provider } from '@/domain/entities';
import { SettingsStoragePort } from '@/domain/ports/settings-storage.port';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly storage = inject(SettingsStoragePort);
  private readonly _settings = signal<AppSettings>(this.storage.load());

  readonly settings = this._settings.asReadonly();
  readonly baseUrl = computed(() => this._settings().baseUrl);
  readonly authToken = computed(() => this._settings().authToken);
  readonly selectedProvider = computed(() => this._settings().selectedProvider);
  readonly selectedModel = computed(() => this._settings().selectedModel);

  update(patch: Partial<AppSettings>): void {
    const next = { ...this._settings(), ...patch };
    this._settings.set(next);
    this.storage.save(next);
  }

  setProviderKey(provider: Provider, key: string): void {
    const current = this._settings();
    const providerKeys = { ...current.providerKeys, [provider]: key || undefined };
    if (!key) delete providerKeys[provider];
    this.update({ providerKeys });
  }

  getProviderKey(provider: Provider): string | null {
    return this._settings().providerKeys[provider] ?? null;
  }

  reset(): void {
    this._settings.set(DEFAULT_SETTINGS);
    this.storage.save(DEFAULT_SETTINGS);
  }
}