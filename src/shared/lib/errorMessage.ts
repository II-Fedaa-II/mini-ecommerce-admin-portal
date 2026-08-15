import { ApiError } from '@/shared/api/httpClient';

/**
 * The API returns a useful message for domain failures (out of stock, invalid variant),
 * so surface it verbatim. Anything else is unexpected and gets a neutral fallback rather
 * than leaking a stack trace or a raw network error at the shopper.
 */
export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}
