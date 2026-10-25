import { API_BASE_URL } from '../config';

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

type Query = Record<string, string | number | undefined>;

export async function getJson<T>(
  path: string,
  query: Query = {},
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  let response: Response;
  try {
    response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error('Network error. Check your connection and try again.');
  }

  if (!response.ok) {
    throw new HttpError(
      response.status,
      response.status === 404
        ? 'No rates are available for this request.'
        : `The rate service returned an error (${response.status}).`,
    );
  }

  return (await response.json()) as T;
}
