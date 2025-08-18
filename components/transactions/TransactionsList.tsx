"use client";

import React from "react";
import { cn } from "@/lib/utils";

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
      <div className="flex flex-col items-center justify-center mt-8 mb-12 p-8 bg-white rounded-lg border border-gray-100 shadow-sm">
        <img
          src="/icons/transaction.svg"
          alt="No transactions"
          className="w-20 h-20 mb-4 opacity-60"
          draggable={false}
        />
        <div className="text-gray-500 text-base font-medium mb-1">
          No transactions found
        </div>
        <div className="text-gray-400 text-sm">
          Your recent transactions will appear here.
        </div>
      </div>
    );
  }

  // Helper: icon and color by category/type
  const getIcon = (tx: Transaction) => {
    if (tx.amount > 0)
      return (
        <span className="inline-flex items-center justify-center bg-green-100 text-green-600 rounded-full w-8 h-8 mr-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 4v12m0 0-5-5m5 5 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );
    if (tx.amount < 0)
      return (
        <span className="inline-flex items-center justify-center bg-red-100 text-red-600 rounded-full w-8 h-8 mr-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 20V8m0 0-5 5m5-5 5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );
    return (
      <span className="inline-flex items-center justify-center bg-gray-100 text-gray-500 rounded-full w-8 h-8 mr-2">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </span>
    );
  };

  const getBadgeColor = (category: string) => {
    const map: Record<string, string> = {
      Salary: "bg-green-100 text-green-700",
      Food: "bg-yellow-100 text-yellow-700",
      Shopping: "bg-blue-100 text-blue-700",
      Transfer: "bg-purple-100 text-purple-700",
      Bills: "bg-pink-100 text-pink-700",
      Other: "bg-gray-100 text-gray-700",
    };
    return map[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {items.map((tx) => (
          <div
            key={tx.id}
            className={cn(
              "flex items-center gap-4 p-4 sm:p-5 group transition hover:bg-gray-50 focus-within:bg-gray-50 cursor-pointer"
            )}
            tabIndex={0}
          >
            {getIcon(tx)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                  {tx.description}
                </p>
                <span
                  className={cn(
                    "ml-2 px-2 py-0.5 rounded text-xs font-medium",
                    getBadgeColor(tx.category)
                  )}
                >
                  {tx.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {new Date(tx.date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right min-w-[90px]">
              <p
                className={cn(
                  "tabular-nums font-semibold text-lg",
                  tx.amount > 0
                    ? "text-green-600"
                    : tx.amount < 0
                    ? "text-red-600"
                    : "text-gray-600"
                )}
              >
                {tx.amount > 0 ? "+" : tx.amount < 0 ? "-" : ""}₹
                {Math.abs(tx.amount).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
