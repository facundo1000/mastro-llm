import { UiSource } from '../entities/source';
import { UiChatMessage } from '../entities/chat';

export interface PersistedNotebook {
  sources: UiSource[];
  messages: UiChatMessage[];
}

export abstract class NotebookStoragePort {
  abstract load(): PersistedNotebook;
  abstract save(state: PersistedNotebook): void;
}