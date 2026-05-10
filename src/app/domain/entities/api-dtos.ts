import { Provider } from './provider';
import { Source } from './source';
import { ChatMessage } from './chat';

export interface ChatRequest {
  provider: Provider;
  model: string;
  system_prompt?: string | null;
  messages: ChatMessage[];
  sources?: Source[];
  api_key?: string | null;
  max_tokens?: number | null;
}

export interface TokenUsage {
  input_tokens?: number | null;
  output_tokens?: number | null;
}

export interface ChatResponse {
  content: string;
  provider: string;
  model: string;
  usage?: TokenUsage | null;
}

export interface PdfExtractRequest {
  filename?: string | null;
  base64: string;
}

export interface PdfExtractResponse {
  filename: string;
  text: string;
  pages: number;
  char_count: number;
}

export type ApiErrorCode =
  | 'unauthorized'
  | 'rate_limited'
  | 'bad_request'
  | 'upstream_error'
  | 'pdf_error'
  | 'payload_too_large'
  | 'unknown_provider'
  | 'missing_api_key'
  | 'internal_error';

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}

export interface HealthResponse {
  status: 'ok';
  version: string;
  providers_configured: Provider[];
}