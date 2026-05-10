export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UiChatMessage extends ChatMessage {
  id: string;
  createdAt: number;
  pending?: boolean;
  error?: string;
}