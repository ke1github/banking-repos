"use client";

import { useUrlState } from "@/lib/url-state";

type Filters = {
  q: string;
  type: "all" | "income" | "expense";
  page: number;
  sort: "date-desc" | "date-asc" | "amount-desc" | "amount-asc";
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  pageSize: number;
};

const defaults: Filters = {
  q: "",
  type: "all",
  page: 1,
  sort: "date-desc",
  pageSize: 10,
};

export default function TransactionsFilters() {
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

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        className="border rounded px-3 py-2 text-sm"
        placeholder="Search description"
        value={filters.q}
        onChange={(e) => setFilters({ q: e.target.value, page: 1 })}
      />
      <select
        className="border rounded px-3 py-2 text-sm"
        value={filters.type}
        onChange={(e) =>
          setFilters({ type: e.target.value as Filters["type"], page: 1 })
        }
      >
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <select
        className="border rounded px-3 py-2 text-sm"
        value={filters.sort}
        onChange={(e) =>
          setFilters({ sort: e.target.value as Filters["sort"], page: 1 })
        }
        aria-label="Sort by"
      >
        <option value="date-desc">Newest</option>
        <option value="date-asc">Oldest</option>
        <option value="amount-desc">Amount: High to Low</option>
        <option value="amount-asc">Amount: Low to High</option>
      </select>
      <input
        type="date"
        className="border rounded px-3 py-2 text-sm"
        value={filters.from || ""}
        onChange={(e) =>
          setFilters({ from: e.target.value || undefined, page: 1 })
        }
        aria-label="From date"
      />
      <input
        type="date"
        className="border rounded px-3 py-2 text-sm"
        value={filters.to || ""}
        onChange={(e) =>
          setFilters({ to: e.target.value || undefined, page: 1 })
        }
        aria-label="To date"
      />
      <select
        className="border rounded px-3 py-2 text-sm"
        value={String(filters.pageSize)}
        onChange={(e) =>
          setFilters({ pageSize: Number(e.target.value), page: 1 })
        }
        aria-label="Page size"
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
      <button
        className="border rounded px-3 py-2 text-sm"
        onClick={() => setFilters({ ...defaults })}
      >
        Reset
      </button>
      <span className="text-xs text-gray-500 ml-2">Page: {filters.page}</span>
    </div>
  );
}
