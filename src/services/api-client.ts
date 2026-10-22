export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://dummyjson.com';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  signal?: AbortSignal;
}

export async function request<T>(
  path: string,
  { method = 'GET', body, signal }: RequestOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      headers:
        body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    throw new ApiError(
      'Unable to reach the server. Please check your connection and try again.',
      0,
    );
  }

  if (!response.ok) {
    throw new ApiError(await extractErrorMessage(response), response.status);
  }

  const data: unknown = await response.json();
  return data as T;
}

async function extractErrorMessage(response: Response): Promise<string> {
  const fallback = `Request failed with status ${response.status}`;
  try {
    const data: unknown = await response.json();
    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
    ) {
      return data.message;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}
