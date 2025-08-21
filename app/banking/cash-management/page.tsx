"use client";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite/config";

export default function CashManagementClient() {
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
          Cash Management
        </h1>
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Cash Management
            </h3>
            <p className="text-gray-600 mb-4">
              Advanced cash flow management tools and analytics will be
              available here.
            </p>
            <p className="text-sm text-gray-500">
              Track income, expenses, and optimize your cash flow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
