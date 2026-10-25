export interface RatePoint {
  /** YYYY-MM-DD */
  date: string;
  value: number;
}

export interface LatestRate {
  /** Publication date of the rate, YYYY-MM-DD */
  date: string;
  rate: number;
}

export interface DateRange {
  start: string;
  end: string;
}
