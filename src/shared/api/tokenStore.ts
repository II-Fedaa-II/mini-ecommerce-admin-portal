/**
 * The access token lives only in module memory — never localStorage/sessionStorage —
 * so an XSS payload cannot read it out of persistent storage. The refresh token is an
 * httpOnly cookie the browser attaches automatically and JS can never see at all.
 */
let accessToken: string | null = null;
const subscribers = new Set<(token: string | null) => void>();

export const tokenStore = {
  get: (): string | null => accessToken,
  set(token: string | null): void {
    accessToken = token;
    subscribers.forEach((notify) => notify(token));
  },
  subscribe(listener: (token: string | null) => void): () => void {
    subscribers.add(listener);
    return () => subscribers.delete(listener);
  },
};
