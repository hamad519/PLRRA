/**
 * Parse a route param (string) into a positive integer ID.
 * Returns null if invalid — caller should return a 400 response.
 */
export function parseId(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}
