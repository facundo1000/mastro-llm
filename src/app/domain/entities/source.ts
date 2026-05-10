export type SourceType = 'text' | 'pdf';

export interface Source {
  name: string;
  type: SourceType;
  content?: string | null;
  base64?: string | null;
}

export interface UiSource extends Source {
  id: string;
  charCount?: number;
  pages?: number;
}