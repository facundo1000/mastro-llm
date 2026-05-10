import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ChatRepository } from '@/domain/ports/chat.repository';
import { ApiErrorBody, ChatRequest, ChatResponse, HealthResponse } from '@/domain/entities';
import { SettingsService } from '@/application/state/settings.service';
import { ApiError } from './api-error';

@Injectable()
export class HttpChatRepository extends ChatRepository {
  private readonly http = inject(HttpClient);
  private readonly settings = inject(SettingsService);

  health(): Observable<HealthResponse> {
    return this.http
      .get<HealthResponse>(this.url('/api/health'))
      .pipe(catchError((err) => this.toApiError(err)));
  }

  chat(req: ChatRequest): Observable<ChatResponse> {
    return this.http
      .post<ChatResponse>(this.url('/api/chat'), req)
      .pipe(catchError((err) => this.toApiError(err)));
  }

  private url(path: string): string {
    const base = (this.settings.baseUrl() || '').replace(/\/+$/, '');
    return `${base}${path}`;
  }

  private toApiError(err: unknown): Observable<never> {
    if (err instanceof HttpErrorResponse) {
      const body = err.error as ApiErrorBody | string | null;
      const code =
        typeof body === 'object' && body && 'error' in body
          ? body.error.code
          : 'internal_error';
      const message =
        typeof body === 'object' && body && 'error' in body
          ? body.error.message
          : err.message || 'Network error';
      const retryAfterRaw = err.headers?.get('Retry-After');
      const retryAfterSec = retryAfterRaw ? Number(retryAfterRaw) : undefined;
      return throwError(() => new ApiError(code, message, err.status, retryAfterSec));
    }
    return throwError(() => new ApiError('internal_error', String(err), 0));
  }
}