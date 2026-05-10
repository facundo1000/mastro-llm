import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotebookStoragePort } from '@/domain/ports/notebook-storage.port';
import { ChatMessage, Source, UiChatMessage, UiSource } from '@/domain/entities';
import { ApiError } from '@/infrastructure/api/api-error';
import { SendMessageUseCase } from '../use-cases/send-message.use-case';
import { AddPdfSourceUseCase } from '../use-cases/add-pdf-source.use-case';

let _id = 0;
const nextId = (): string => `${Date.now().toString(36)}-${(_id++).toString(36)}`;

@Injectable({ providedIn: 'root' })
export class NotebookStore {
  private readonly storage = inject(NotebookStoragePort);
  private readonly sendMessageUC = inject(SendMessageUseCase);
  private readonly addPdfUC = inject(AddPdfSourceUseCase);

  private readonly _sources = signal<UiSource[]>([]);
  private readonly _messages = signal<UiChatMessage[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _lastError = signal<string | null>(null);

  readonly sources = this._sources.asReadonly();
  readonly messages = this._messages.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly lastError = this._lastError.asReadonly();
  readonly hasMessages = computed(() => this._messages().length > 0);

  constructor() {
    const { sources, messages } = this.storage.load();
    this._sources.set(sources);
    this._messages.set(messages);
  }

  addTextSource(name: string, content: string): void {
    const source: UiSource = {
      id: nextId(),
      name: name || 'Untitled',
      type: 'text',
      content,
      charCount: content.length,
    };
    this._sources.update((list) => [...list, source]);
    this.persist();
  }

  async addPdfSource(file: File): Promise<void> {
    const base64 = await fileToBase64(file);
    try {
      this._loading.set(true);
      const res = await firstValueFrom(this.addPdfUC.execute(file.name, base64));
      const source: UiSource = {
        id: nextId(),
        name: res.filename,
        type: 'pdf',
        content: res.text,
        charCount: res.char_count,
        pages: res.pages,
      };
      this._sources.update((list) => [...list, source]);
      this.persist();
    } catch (e) {
      this._lastError.set(this.errMessage(e));
      throw e;
    } finally {
      this._loading.set(false);
    }
  }

  removeSource(id: string): void {
    this._sources.update((list) => list.filter((s) => s.id !== id));
    this.persist();
  }

  clearSources(): void {
    this._sources.set([]);
    this.persist();
  }

  async sendMessage(content: string): Promise<void> {
    const trimmed = content.trim();
    if (!trimmed || this._loading()) return;

    const userMsg: UiChatMessage = {
      id: nextId(),
      role: 'user',
      content: trimmed,
      createdAt: Date.now(),
    };
    this._messages.update((m) => [...m, userMsg]);
    this._loading.set(true);
    this._lastError.set(null);

    const sources: Source[] = this._sources().map((s) => ({
      name: s.name,
      type: s.type,
      content: s.content ?? null,
      base64: s.base64 ?? null,
    }));

    const cleanMessages: ChatMessage[] = this._messages()
      .filter((m) => !m.error)
      .map(({ role, content }) => ({ role, content }));

    try {
      const res = await firstValueFrom(this.sendMessageUC.execute(cleanMessages, sources));
      const assistantMsg: UiChatMessage = {
        id: nextId(),
        role: 'assistant',
        content: res.content,
        createdAt: Date.now(),
      };
      this._messages.update((m) => [...m, assistantMsg]);
      this.persist();
    } catch (e) {
      const msg = this.errMessage(e);
      this._lastError.set(msg);
      this._messages.update((m) => [
        ...m,
        { id: nextId(), role: 'assistant', content: msg, createdAt: Date.now(), error: msg },
      ]);
    } finally {
      this._loading.set(false);
    }
  }

  clearMessages(): void {
    this._messages.set([]);
    this._lastError.set(null);
    this.persist();
  }

  resetAll(): void {
    this._messages.set([]);
    this._sources.set([]);
    this._lastError.set(null);
    this.persist();
  }

  private persist(): void {
    this.storage.save({ sources: this._sources(), messages: this._messages() });
  }

  private errMessage(e: unknown): string {
    if (e instanceof ApiError) {
      return e.retryAfterSec ? `${e.message} (retry in ${e.retryAfterSec}s)` : e.message;
    }
    return e instanceof Error ? e.message : String(e);
  }
}

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}