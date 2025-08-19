"use client";

import React, { useEffect, useMemo } from "react";
import { useTransactionFiltersState } from "@/lib/hooks/useUrlState";
import { useStore } from "@/lib/stores";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * This component demonstrates the best practices for using both
 * Zustand and URL state management together in an enterprise application
 */
export default function StateManagementDemo() {
  // 1. Get application state from Zustand stores
  const { auth, accounts, transactions } = useStore();

  // 2. Get navigation/filter state from URL
  const [filters, setFilters] = useTransactionFiltersState();

  // 3. Initialize data on component mount (Zustand pattern)
  useEffect(() => {
    if (
      auth.isAuthenticated &&
      !transactions.isLoading &&
      transactions.transactions.length === 0
    ) {
      transactions.fetchTransactions();
    }
  }, [auth.isAuthenticated, transactions]);

  // 4. Apply URL filters to Zustand data (combining both state types)
  const filteredTransactions = useMemo(() => {
    if (!transactions.transactions.length) return [];

    return transactions.transactions.filter((tx) => {
      // Apply type filter
      if (filters.type !== "all" && tx.type !== filters.type) return false;

      // Apply date range filter
      if (filters.dateFrom && new Date(tx.date) < new Date(filters.dateFrom))
        return false;
      if (filters.dateTo && new Date(tx.date) > new Date(filters.dateTo))
        return false;

      // Apply amount filters
      const amount = Math.abs(tx.amount);
      if (filters.minAmount && amount < Number(filters.minAmount)) return false;
      if (filters.maxAmount && amount > Number(filters.maxAmount)) return false;

      // Apply search term
      if (
        filters.searchTerm &&
        !tx.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [transactions.transactions, filters]);

  // Helper function to reset filters (URL state)
  const resetFilters = () => {
    setFilters({
      type: "all",
      status: "all",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      searchTerm: "",
    });
  };

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          State Management Best Practices
        </h1>
        <p className="text-gray-600">
          This demo shows how to combine Zustand for application state with URL
          state for navigation/filters.
        </p>
      </div>

      {/* Example of Zustand state (user auth) */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Zustand State: User Authentication
        </h2>
        <Card className="p-4">
          {auth.isLoading ? (
            <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
          ) : auth.isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {auth.user?.name.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="font-medium">{auth.user?.name}</h3>
                <p className="text-sm text-gray-500">{auth.user?.email}</p>
              </div>
              <div className="ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => auth.logout()}
                >
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center p-4">
              <p className="mb-4">You are not logged in</p>
              <Button size="sm">Login</Button>
            </div>
          )}
        </Card>
        <div className="mt-2 text-xs text-gray-500">
          <p>
            * Auth state uses Zustand with persist middleware for session
            persistence
          </p>
        </div>
      </section>

      {/* Example of URL state (filters) */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          URL State: Transaction Filters
        </h2>
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type
              </label>
              <select
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.type}
                onChange={(e) => setFilters({ type: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="transfer">Transfers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date From
              </label>
              <input
                type="date"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ dateFrom: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date To
              </label>
              <input
                type="date"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.dateTo}
                onChange={(e) => setFilters({ dateTo: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Amount
              </label>
              <input
                type="number"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.minAmount}
                onChange={(e) => setFilters({ minAmount: e.target.value })}
                placeholder="Min amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Amount
              </label>
              <input
                type="number"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.maxAmount}
                onChange={(e) => setFilters({ maxAmount: e.target.value })}
                placeholder="Max amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filters.searchTerm}
                onChange={(e) => setFilters({ searchTerm: e.target.value })}
                placeholder="Search descriptions..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </Card>
        <div className="mt-2 text-xs text-gray-500">
          <p>
            * Filter state is stored in URL for shareability and persistence
          </p>
          <p>
            * Try bookmarking the page or sharing the URL - filters will be
            preserved
          </p>
        </div>
      </section>

      {/* Example of combining both state types */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Combined State: Filtered Transactions
        </h2>
        <Card className="p-4">
          {transactions.isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="divide-y">
              {filteredTransactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="py-3 flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.amount > 0
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : "-"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{tx.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`font-medium ${
                      tx.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(Math.abs(tx.amount))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">
                No transactions match your filters
              </p>
              <Button
                className="mt-4"
                variant="outline"
                size="sm"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </Card>
        <div className="mt-2 text-xs text-gray-500">
          <p>* Transaction data comes from Zustand store (application state)</p>
          <p>* Filtering is applied using URL state parameters</p>
          <p>
            * This demonstrates proper coordination between both state types
          </p>
        </div>
      </section>

      {/* State management explanation */}
      <section className="mt-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          Enterprise State Management Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-blue-700 mb-2">Use Zustand For:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Authentication state (user profiles, permissions)</li>
              <li>Business data (accounts, transactions, balances)</li>
              <li>Application preferences (settings, themes)</li>
              <li>State that requires persistence between sessions</li>
              <li>Complex state with related transformations</li>
              <li>Server-synchronized data with optimistic updates</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-green-700 mb-2">
              Use URL State For:
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Filter criteria (dates, types, search terms)</li>
              <li>Sorting preferences (column, direction)</li>
              <li>Pagination (page number, items per page)</li>
              <li>Tab selection and view modes</li>
              <li>Any state that should be shareable via URL</li>
              <li>State that should survive page refreshes</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
