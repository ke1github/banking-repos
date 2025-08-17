"use client";

import React from "react";

export type Transaction = {
  id: string;
  date: string; // e.g., 2025-08-15
  description: string;
  category: string;
  amount: number; // positive for credit, negative for debit
};

interface TransactionsListProps {
  items: Transaction[];
}

export default function TransactionsList({ items }: TransactionsListProps) {
  if (!items?.length) {
    return (
      <div className="mt-4 text-gray-500 bg-white p-4 sm:p-6 rounded-lg border border-gray-100 text-sm sm:text-base">
        No transactions found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {items.map((tx) => (
          <div key={tx.id} className="flex items-center gap-4 p-4 sm:p-5">
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                {tx.description}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {new Date(tx.date).toLocaleDateString()} • {tx.category}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`tabular-nums font-semibold ${
                  tx.amount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.amount >= 0 ? "+" : "-"}₹
                {Math.abs(tx.amount).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
