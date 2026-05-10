import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { PdfRepository } from '@/domain/ports/pdf.repository';
import { ApiErrorBody, PdfExtractRequest, PdfExtractResponse } from '@/domain/entities';
import { SettingsService } from '@/application/state/settings.service';
import { ApiError } from './api-error';

@Injectable()
export class HttpPdfRepository extends PdfRepository {
  private readonly http = inject(HttpClient);
  private readonly settings = inject(SettingsService);

  extract(req: PdfExtractRequest): Observable<PdfExtractResponse> {
    return this.http
      .post<PdfExtractResponse>(this.url('/api/pdf/extract'), req)
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