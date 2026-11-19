"use client";

import { useCallback, useEffect, useState } from "react";
import type { PageMeta, QueryParams } from "@/lib/api";
import { apiRequest, errorMessage } from "@/lib/api-client";

// Both hooks keep the last loaded data on screen while a new request runs,
// and only report "loading" until the result for the current inputs arrives.

type ListState<T> = { key: string; items: T[]; meta?: PageMeta; error?: string };

export function useApiList<T>(path: string, params: QueryParams) {
  const [reloadCount, setReloadCount] = useState(0);
  const [state, setState] = useState<ListState<T> | null>(null);

  const paramsKey = JSON.stringify(params);
  const key = `${path}|${paramsKey}|${reloadCount}`;

  useEffect(() => {
    let cancelled = false;

    apiRequest<T[]>(path, { params: JSON.parse(paramsKey) as QueryParams })
      .then(({ data, meta }) => {
        if (!cancelled) setState({ key, items: data, meta });
      })
      .catch((error) => {
        if (!cancelled) setState({ key, items: [], error: errorMessage(error) });
      });

    return () => {
      cancelled = true;
    };
  }, [key, path, paramsKey]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  return {
    items: state?.items ?? [],
    meta: state?.meta,
    error: state?.error,
    ready: state !== null,
    loading: state?.key !== key,
    reload,
  };
}

type DataState<T> = { key: string; data?: T; error?: string };

export function useApiData<T>(path: string) {
  const [reloadCount, setReloadCount] = useState(0);
  const [state, setState] = useState<DataState<T> | null>(null);

  const key = `${path}|${reloadCount}`;

  useEffect(() => {
    let cancelled = false;

    apiRequest<T>(path)
      .then(({ data }) => {
        if (!cancelled) setState({ key, data });
      })
      .catch((error) => {
        if (!cancelled) setState({ key, error: errorMessage(error) });
      });

    return () => {
      cancelled = true;
    };
  }, [key, path]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  return {
    data: state?.data,
    error: state?.error,
    loading: state?.key !== key,
    reload,
  };
}
