"use client";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite/config";

export default function ExpenseManagementClient() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account
      .get()
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Expense Management
        </h1>
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Expense Management
            </h3>
            <p className="text-gray-600 mb-4">
              Comprehensive expense tracking and budget management tools will be
              available here.
            </p>
            <p className="text-sm text-gray-500">
              Categorize expenses, set budgets, and analyze spending patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
