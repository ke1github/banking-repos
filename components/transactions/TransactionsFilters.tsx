"use client";

import { useTransition } from "react";
import { useUrlState } from "@/lib/url-state";
import { DateField } from "@/components/ui/DateField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
  const [isPending, startTransition] = useTransition();
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

  // Optimized update function that uses useTransition for better user experience
  const updateFilters = (newFilters: Partial<Filters>) => {
    startTransition(() => {
      setFilters({ ...newFilters, page: 1 });
    });
  };

  // Count active filters (excluding defaults)
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "page") return false; // Don't count page as a filter
    return value !== defaults[key as keyof Filters];
  }).length;

  return (
    <div className="flex flex-wrap gap-3 items-center p-4 bg-slate-50 rounded-lg">
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <Input
          className="h-9"
          placeholder="Search description"
          value={filters.q}
          onChange={(e) => updateFilters({ q: e.target.value })}
          disabled={isPending}
        />
      </div>

      <Select
        value={filters.type}
        onValueChange={(value: string) =>
          updateFilters({ type: value as Filters["type"] })
        }
        disabled={isPending}
      >
        <SelectTrigger className="w-[110px] h-9">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sort}
        onValueChange={(value: string) =>
          updateFilters({ sort: value as Filters["sort"] })
        }
        disabled={isPending}
      >
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date-desc">Newest</SelectItem>
          <SelectItem value="date-asc">Oldest</SelectItem>
          <SelectItem value="amount-desc">Amount: High to Low</SelectItem>
          <SelectItem value="amount-asc">Amount: Low to High</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2 items-end">
        <DateField
          label="From"
          value={filters.from || ""}
          onChange={(date: string | undefined) =>
            updateFilters({ from: date || undefined })
          }
          className="w-[140px]"
          aria-label="From date"
        />
        <DateField
          label="To"
          value={filters.to || ""}
          onChange={(date: string | undefined) =>
            updateFilters({ to: date || undefined })
          }
          className="w-[140px]"
          aria-label="To date"
        />
      </div>

      <Select
        value={String(filters.pageSize)}
        onValueChange={(value: string) =>
          updateFilters({ pageSize: Number(value) })
        }
        disabled={isPending}
      >
        <SelectTrigger className="w-[90px] h-9">
          <SelectValue placeholder="Page size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 rows</SelectItem>
          <SelectItem value="25">25 rows</SelectItem>
          <SelectItem value="50">50 rows</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => setFilters({ ...defaults })}
        disabled={isPending || activeFilterCount === 0}
        className="h-9"
      >
        Reset{" "}
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-1">
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      <Badge variant="outline" className="ml-auto text-xs text-slate-500">
        Page: {filters.page}
      </Badge>
    </div>
  );
}
