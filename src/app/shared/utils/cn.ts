import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Helper estándar shadcn/spartan para combinar clases Tailwind sin duplicados. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
