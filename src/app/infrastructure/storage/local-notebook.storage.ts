import { Injectable } from '@angular/core';
import { NotebookStoragePort, PersistedNotebook } from '@/domain/ports/notebook-storage.port';

const STORAGE_KEY = 'mastro-llm:notebook:v1';
const EMPTY: PersistedNotebook = { sources: [], messages: [] };

@Injectable()
export class LocalNotebookStorage extends NotebookStoragePort {
  load(): PersistedNotebook {
    if (typeof localStorage === 'undefined') return EMPTY;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return EMPTY;
      const parsed = JSON.parse(raw) as Partial<PersistedNotebook>;
      return {
        sources: Array.isArray(parsed.sources) ? parsed.sources : [],
        messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      };
    } catch {
      return EMPTY;
    }
  }

  save(state: PersistedNotebook): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota exceeded */
    }
  }
}