"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useRouter } from "next/navigation";

export type HistoryMode = "push" | "replace";

export type UrlStateOptions<T extends Record<string, unknown>> = {
  history?: HistoryMode;
  arrayFormat?: "none" | "comma" | "bracket" | "index";
  parse?: Partial<{
    [K in keyof T]: (value: string | string[] | null) => T[K];
  }>;
  serialize?: Partial<{
    [K in keyof T]: (value: T[K]) => string | string[] | null | undefined;
  }>;
};

/**
 * useUrlState
 * - Reads current URL query into state with defaults
 * - setState merges and writes back to the URL (shallow navigation)
 */
export function useUrlState<T extends Record<string, unknown>>(
  defaults: T,
  options: UrlStateOptions<T> = {}
) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const history: HistoryMode = options.history ?? "replace";
  const arrayFormat = options.arrayFormat ?? "comma";

  const current = useMemo(() => {
    const parsed = qs.parse(searchParams.toString(), {
      arrayFormat,
      parseBooleans: true,
      parseNumbers: true,
    });

    const result = { ...defaults } as T;
    for (const key of Object.keys(defaults) as Array<keyof T>) {
      const raw = (parsed as Record<string, unknown>)[key as string] ?? null;
      const parser = options.parse?.[key];
      (result as Record<string, unknown>)[key as string] = parser
        ? parser(raw as string | string[] | null)
        : raw ?? (defaults as Record<string, unknown>)[key as string];
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const stateRef = useRef(current);
  const [state, setState] = useState<T>(current);

  useEffect(() => {
    stateRef.current = current;
    setState(current);
  }, [current]);

  const update = useCallback(
    (patch: Partial<T> | ((prev: T) => Partial<T>)) => {
      const prev = stateRef.current;
      const delta = typeof patch === "function" ? patch(prev) : patch;
      const next = { ...prev, ...delta } as T;

      // Build query object from defaults + next, omit undefined/null/empty string
      const query: Partial<Record<keyof T, unknown>> = {};
      for (const key of Object.keys(defaults) as Array<keyof T>) {
        const value = (next as Record<string, unknown>)[
          key as string
        ] as T[keyof T];
        const serializer = options.serialize?.[key];
        const serialized = serializer
          ? serializer(value as T[keyof T])
          : (value as unknown);
        if (
          serialized !== undefined &&
          serialized !== null &&
          !(typeof serialized === "string" && serialized.trim() === "")
        ) {
          query[key] = serialized;
        }
      }

      const search = qs.stringify(query, {
        arrayFormat,
        skipNull: true,
        skipEmptyString: true,
      });

      const url = search ? `${pathname}?${search}` : pathname;
      if (history === "push") router.push(url);
      else router.replace(url);
    },
    [arrayFormat, defaults, history, options.serialize, pathname, router]
  );

  return [state, update] as const;
}

/** Helper to build a link with merged params (useful for Link components). */
export function buildUrl(
  pathname: string,
  currentSearch: string,
  patch: Record<string, unknown>,
  arrayFormat: UrlStateOptions<Record<string, unknown>>["arrayFormat"] = "comma"
) {
  const parsed = qs.parse(currentSearch, { arrayFormat });
  const merged = { ...parsed, ...patch };
  const search = qs.stringify(merged, {
    arrayFormat,
    skipNull: true,
    skipEmptyString: true,
  });
  return search ? `${pathname}?${search}` : pathname;
}
