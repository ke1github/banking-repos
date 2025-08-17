"use client";

import { useUrlState } from "@/lib/url-state";

type Filters = {
  q: string;
  type: "all" | "income" | "expense";
  page: number;
};

const defaults: Filters = { q: "", type: "all", page: 1 };

export default function TransactionsFilters() {
  const [filters, setFilters] = useUrlState<Filters>(defaults, {
    parse: {
      page: (v) => (typeof v === "string" ? Number(v) || 1 : 1),
    },
    serialize: {
      page: (v) => (v && v !== 1 ? String(v) : undefined),
      q: (v) => (v?.trim() ? v : undefined),
      type: (v) => (v && v !== "all" ? v : undefined),
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
      <button
        className="border rounded px-3 py-2 text-sm"
        onClick={() => setFilters({ q: "", type: "all", page: 1 })}
      >
        Reset
      </button>
      <span className="text-xs text-gray-500 ml-2">Page: {filters.page}</span>
    </div>
  );
}
