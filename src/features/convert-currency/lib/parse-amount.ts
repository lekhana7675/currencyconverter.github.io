/**
 * Parses what a person typed into the amount field.
 * Accepts digits with an optional decimal part and thousands commas ("1,250.50").
 * Returns null when the input is empty or not a plain non-negative number.
 */
export function parseAmount(input: string): number | null {
  const normalized = input.trim().replace(/,/g, '');
  if (normalized === '' || normalized === '.' || !/^\d*\.?\d*$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}
