import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PdfRepository } from '@/domain/ports/pdf.repository';
import { PdfExtractResponse } from '@/domain/entities';

@Injectable({ providedIn: 'root' })
export class AddPdfSourceUseCase {
  private readonly pdfRepo = inject(PdfRepository);

  execute(filename: string, base64: string): Observable<PdfExtractResponse> {
    return this.pdfRepo.extract({ filename, base64 });
  }
}