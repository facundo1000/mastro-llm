import { Injectable } from '@angular/core';
import { SettingsStoragePort } from '@/domain/ports/settings-storage.port';
import { AppSettings, DEFAULT_SETTINGS } from '@/domain/entities';

const STORAGE_KEY = 'mastro-llm:settings:v1';

@Injectable()
export class LocalSettingsStorage extends SettingsStoragePort {
  load(): AppSettings {
    if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  save(settings: AppSettings): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* quota exceeded */
    }
  }
}