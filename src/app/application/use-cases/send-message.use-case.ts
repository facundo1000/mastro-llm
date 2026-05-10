import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatRepository } from '@/domain/ports/chat.repository';
import { ChatMessage, ChatRequest, ChatResponse, Source } from '@/domain/entities';
import { SettingsService } from '../state/settings.service';

@Injectable({ providedIn: 'root' })
export class SendMessageUseCase {
  private readonly chatRepo = inject(ChatRepository);
  private readonly settings = inject(SettingsService);

  execute(messages: ChatMessage[], sources: Source[]): Observable<ChatResponse> {
    const provider = this.settings.selectedProvider();
    const model = this.settings.selectedModel();
    const apiKey = this.settings.getProviderKey(provider);
    const sysPrompt = this.settings.settings().systemPrompt.trim();
    const maxTokens = this.settings.settings().maxTokens;

    const req: ChatRequest = {
      provider,
      model,
      messages,
      sources,
      api_key: apiKey || null,
      system_prompt: sysPrompt || null,
      max_tokens: maxTokens || null,
    };

    return this.chatRepo.chat(req);
  }
}