// Plain API helpers that work in server and client code.
// Signed-in calls live in api-client.ts.

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  activeCount?: number;
  // null means unlimited (Premium).
  activeLimit?: number | null;
};

export type ApiResult<T> = { data: T; meta?: PageMeta };

export type QueryParams = Record<string, string | number | undefined | null>;

export function buildUrl(path: string, params?: QueryParams) {
  const url = new URL(path, API_URL);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function parseResponse<T>(response: Response): Promise<ApiResult<T>> {
  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success) {
    throw new ApiRequestError(response.status, body?.message ?? "Something went wrong");
  }

  return { data: body.data as T, meta: body.meta as PageMeta | undefined };
}

export async function safeFetch(url: string, init?: RequestInit) {
  try {
    return await fetch(url, init);
  } catch {
    throw new ApiRequestError(0, "Could not reach the server. Please try again.");
  }
}

// Public GET request. Never cached, so lists are always fresh.
export async function apiGet<T>(path: string, params?: QueryParams) {
  const response = await safeFetch(buildUrl(path, params), { cache: "no-store" });
  return parseResponse<T>(response);
}
