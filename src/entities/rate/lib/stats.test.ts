import { describe, expect, it } from 'vitest';
import { summarizeRates } from './stats';

describe('summarizeRates', () => {
  it('returns null for an empty series', () => {
    expect(summarizeRates([])).toBeNull();
  });

  it('finds high, low, average and change', () => {
    const summary = summarizeRates([
      { date: '2026-01-01', value: 1.0 },
      { date: '2026-01-02', value: 1.2 },
      { date: '2026-01-03', value: 0.8 },
      { date: '2026-01-04', value: 1.1 },
    ]);

    expect(summary?.high).toEqual({ date: '2026-01-02', value: 1.2 });
    expect(summary?.low).toEqual({ date: '2026-01-03', value: 0.8 });
    expect(summary?.average).toBeCloseTo(1.025, 10);
    expect(summary?.change).toBeCloseTo(0.1, 10);
    expect(summary?.changePercent).toBeCloseTo(10, 10);
  });

  it('handles a single point', () => {
    const summary = summarizeRates([{ date: '2026-01-01', value: 2 }]);
    expect(summary?.change).toBe(0);
    expect(summary?.changePercent).toBe(0);
  });
});
