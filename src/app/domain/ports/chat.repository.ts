import { Observable } from 'rxjs';
import { ChatRequest, ChatResponse, HealthResponse } from '../entities/api-dtos';

export abstract class ChatRepository {
  abstract chat(req: ChatRequest): Observable<ChatResponse>;
  abstract health(): Observable<HealthResponse>;
}