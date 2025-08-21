"use client";

import Filters from "@/components/transactions/TransactionsFilters";
import TransactionsList, {
  type Transaction,
} from "@/components/transactions/TransactionsList";
import { useUrlState } from "@/lib/url-state";
import React, { useEffect, useState, useTransition } from "react";
import { useActionState } from "react";
import { fetchTransactionsAction } from "@/lib/actions/banking.actions";
import {
  LoadingState,
  ErrorState,
  NoPermissionState,
} from "@/components/ui/data-states";

export default function TransactionsPage() {
  type Filters = {
    q: string;
    type: "all" | "income" | "expense";
    page: number;
    sort: "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
    from?: string;
    to?: string;
    pageSize: number;
  };
  const defaults: Filters = {
    q: "",
    type: "all",
    page: 1,
    sort: "date-desc",
    pageSize: 10,
  };

  const [filters, setFilters] = useUrlState<Filters>(defaults, {
    parse: {
      page: (v) => (typeof v === "string" ? Number(v) || 1 : 1),
      pageSize: (v) => (typeof v === "string" ? Number(v) || 10 : 10),
    },
    serialize: {
      page: (v) => (v && v !== 1 ? String(v) : undefined),
      pageSize: (v) => (v && v !== 10 ? String(v) : undefined),
      q: (v) => (v?.trim() ? v : undefined),
      type: (v) => (v && v !== "all" ? v : undefined),
      sort: (v) => (v && v !== "date-desc" ? v : undefined),
      from: (v) =>
        v && typeof v === "string" && v.length === 10 ? v : undefined,
      to: (v) =>
        v && typeof v === "string" && v.length === 10 ? v : undefined,
    },
    history: "replace",
  });

  // Fetch via Server Action with server-side filtering/sorting/pagination
  const [state, formAction, pending] = useActionState(
    fetchTransactionsAction as unknown as (
      prev: unknown,
      formData: FormData
    ) => Promise<
      { ok: true; items: Transaction[]; total: number } | { error: string }
    >,
    null as unknown
  );

  const [items, setItems] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  const [isTransPending, startTransition] = useTransition();

  // Submit whenever filters change
  useEffect(() => {
    const fd = new FormData();
    if (filters.q.trim()) fd.set("q", filters.q.trim());
    if (filters.type !== "all") fd.set("type", filters.type);
    if (filters.from) fd.set("from", filters.from);
    if (filters.to) fd.set("to", filters.to);
    if (filters.sort !== "date-desc") fd.set("sort", filters.sort);
    if (filters.page && filters.page !== 1)
      fd.set("page", String(filters.page));
    if (filters.pageSize && filters.pageSize !== 10)
      fd.set("pageSize", String(filters.pageSize));
    // Always include defaults to simplify server logic
    if (!fd.has("type")) fd.set("type", filters.type);
    if (!fd.has("sort")) fd.set("sort", filters.sort);
    if (!fd.has("page")) fd.set("page", String(filters.page));
    if (!fd.has("pageSize")) fd.set("pageSize", String(filters.pageSize));
    if (!authError) {
      startTransition(() => {
        formAction(fd);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.q,
    filters.type,
    filters.from,
    filters.to,
    filters.sort,
    filters.page,
    filters.pageSize,
  ]);

  // Reflect action results
  useEffect(() => {
    if (!state) return;
    if (typeof state === "object" && state && "error" in state) {
      const msg = state.error as string;
      if (msg === "Please sign in") {
        setAuthError(true);
        setError(null);
        setItems([]);
        setTotal(0);
        return;
      }
      setError(msg);
    } else if (typeof state === "object" && state && "ok" in state) {
      const s = state as { ok: true; items: Transaction[]; total: number };
      setItems(s.items);
      setTotal(s.total);
      setError(null);
      setAuthError(false);
    }
  }, [state]);

  const pageSize = filters.pageSize;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(filters.page, 1), totalPages);
  const start = (page - 1) * pageSize;

  return (
    <section className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <p className="text-gray-600">View and filter your recent transactions.</p>
      <Filters />
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {total ? start + 1 : 0}–{Math.min(start + pageSize, total)} of{" "}
          {total}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="border rounded px-3 py-1 disabled:opacity-50"
            disabled={page <= 1 || pending || isTransPending}
            onClick={() => setFilters({ page: page - 1 })}
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            className="border rounded px-3 py-1 disabled:opacity-50"
            disabled={page >= totalPages || pending || isTransPending}
            onClick={() => setFilters({ page: page + 1 })}
          >
            Next
          </button>
        </div>
      </div>
      {authError ? (
        <NoPermissionState
          message="Please sign in to view your transactions."
          className="mt-4"
        />
      ) : error ? (
        <ErrorState
          error={error}
          title="Could not load transactions"
          className="mt-4"
          onRetry={() => {
            const fd = new FormData();
            Object.entries(filters).forEach(([key, value]) => {
              if (value !== undefined) fd.set(key, String(value));
            });
            startTransition(() => {
              formAction(fd);
            });
          }}
        />
      ) : pending || isTransPending ? (
        <LoadingState className="mt-4" height="h-72" />
      ) : (
        <TransactionsList items={items} />
      )}
    </section>
  );
}
