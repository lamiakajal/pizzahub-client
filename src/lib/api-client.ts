"use client";

import {
  ApiRequestError,
  buildUrl,
  parseResponse,
  safeFetch,
  type QueryParams,
} from "@/lib/api";
import { authClient } from "@/lib/auth-client";

// Calls the Express API as the signed-in user. A short-lived JWT from
// Better Auth goes in the Authorization header; the server verifies it
// and reloads the user from the database.
export async function apiRequest<T>(
  path: string,
  options: { method?: string; body?: unknown; params?: QueryParams } = {}
) {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new ApiRequestError(401, "Please sign in again to continue");
  }

  const response = await safeFetch(buildUrl(path, options.params), {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${data.token}`,
      ...(options.body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  return parseResponse<T>(response);
}

export function errorMessage(error: unknown, fallback = "Something went wrong") {
  return error instanceof Error ? error.message : fallback;
}
