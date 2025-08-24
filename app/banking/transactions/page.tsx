"use client";

import Filters from "@/components/transactions/TransactionsFilters";
import TransactionsList, {
  type Transaction,
} from "@/components/transactions/TransactionsList";
import { useUrlState } from "@/lib/url-state";
import React, { useEffect, useState, useTransition, Suspense } from "react";
import { useActionState } from "react";
import { fetchTransactionsAction } from "@/lib/actions/banking.actions";
import {
  LoadingState,
  ErrorState,
  NoPermissionState,
} from "@/components/ui/data-states";
import TabList from "@/components/ui/TabList";
import {
  ListFilter,
  BarChart2,
  Calendar,
  CreditCard,
  DollarSign,
} from "lucide-react";

function TransactionsPageContent() {
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

  // Sample data for visualizations (normally would come from an API)
  const recentTransactionsContent = (
    <div className="space-y-4">
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
    </div>
  );

  const analyticsContent = (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-medium mb-4">Spending Analytics</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">Monthly Spending Trend</h4>
          <div className="h-64 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">
              Monthly spending chart would appear here
            </p>
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">Spending by Category</h4>
          <div className="h-64 flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">
              Category distribution chart would appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const scheduledContent = (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <h3 className="text-lg font-medium mb-4">Scheduled Transactions</h3>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Monthly Subscription</h4>
            <span className="text-blue-600 font-medium">$9.99</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Next payment: Aug 28, 2025</span>
            <span className="text-gray-500">Netflix</span>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Rent Payment</h4>
            <span className="text-blue-600 font-medium">$1,200.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Next payment: Sep 1, 2025</span>
            <span className="text-gray-500">Recurring Transfer</span>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Gym Membership</h4>
            <span className="text-blue-600 font-medium">$49.99</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Next payment: Sep 5, 2025</span>
            <span className="text-gray-500">Fitness World</span>
          </div>
        </div>

        <button className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium mt-4">
          Add Scheduled Transaction
        </button>
      </div>
    </div>
  );

  const categoriesContent = (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Transaction Categories</h3>
        <button className="text-blue-600 text-sm">Add Category</button>
      </div>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Shopping</h4>
                <p className="text-sm text-gray-500">15 transactions</p>
              </div>
            </div>
            <span className="text-blue-600 font-medium">$1,245.33</span>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Dining</h4>
                <p className="text-sm text-gray-500">28 transactions</p>
              </div>
            </div>
            <span className="text-blue-600 font-medium">$875.25</span>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Entertainment</h4>
                <p className="text-sm text-gray-500">9 transactions</p>
              </div>
            </div>
            <span className="text-blue-600 font-medium">$354.99</span>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium">Transportation</h4>
                <p className="text-sm text-gray-500">12 transactions</p>
              </div>
            </div>
            <span className="text-blue-600 font-medium">$223.50</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="text-gray-600">
          View and manage your transaction history.
        </p>
      </div>

      <TabList
        items={[
          {
            value: "recent",
            label: "Recent Transactions",
            icon: <ListFilter className="h-4 w-4 mr-2" />,
            content: recentTransactionsContent,
          },
          {
            value: "analytics",
            label: "Analytics",
            icon: <BarChart2 className="h-4 w-4 mr-2" />,
            content: analyticsContent,
          },
          {
            value: "scheduled",
            label: "Scheduled",
            icon: <Calendar className="h-4 w-4 mr-2" />,
            content: scheduledContent,
          },
          {
            value: "categories",
            label: "Categories",
            icon: <CreditCard className="h-4 w-4 mr-2" />,
            content: categoriesContent,
          },
        ]}
        defaultValue="recent"
        variant="underline"
        className="w-full"
      />
    </section>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<LoadingState className="mt-4" height="h-96" />}>
      <TransactionsPageContent />
    </Suspense>
  );
}
