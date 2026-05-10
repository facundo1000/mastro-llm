import { Observable } from 'rxjs';
import { PdfExtractRequest, PdfExtractResponse } from '../entities/api-dtos';

export abstract class PdfRepository {
  abstract extract(req: PdfExtractRequest): Observable<PdfExtractResponse>;
}