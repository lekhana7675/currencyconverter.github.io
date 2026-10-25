import { describe, expect, it } from 'vitest';
import { parseAmount } from './parse-amount';

describe('parseAmount', () => {
  it('parses plain and decimal numbers', () => {
    expect(parseAmount('100')).toBe(100);
    expect(parseAmount('99.50')).toBe(99.5);
    expect(parseAmount('.5')).toBe(0.5);
    expect(parseAmount('7.')).toBe(7);
  });

  it('accepts thousands separators and surrounding spaces', () => {
    expect(parseAmount(' 1,250.50 ')).toBe(1250.5);
  });

  it('rejects empty and non-numeric input', () => {
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('   ')).toBeNull();
    expect(parseAmount('.')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
    expect(parseAmount('12abc')).toBeNull();
    expect(parseAmount('-5')).toBeNull();
    expect(parseAmount('1e5')).toBeNull();
    expect(parseAmount('0x10')).toBeNull();
  });
});
