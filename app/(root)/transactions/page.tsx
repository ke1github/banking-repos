"use client";

import Filters from "@/components/transactions/TransactionsFilters";

export default function TransactionsPage() {
  return (
    <section className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <p className="text-gray-600">View and filter your recent transactions.</p>
      <Filters />
    </section>
  );
}
