"use client";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite/config";
import TabList from "@/components/ui/TabList";
import {
  PieChart,
  BarChart2,
  Calendar,
  DollarSign,
  Target,
} from "lucide-react";

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

  const overviewContent = (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Monthly Spending
          </h3>
          <div className="text-2xl font-bold text-gray-900">$3,450.85</div>
          <div className="text-xs text-red-500 mt-1">+12% from last month</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Budget Remaining
          </h3>
          <div className="text-2xl font-bold text-gray-900">$1,549.15</div>
          <div className="text-xs text-gray-500 mt-1">31% remaining</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Top Category
          </h3>
          <div className="text-2xl font-bold text-gray-900">Shopping</div>
          <div className="text-xs text-gray-500 mt-1">$1,245.33 (36%)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Recent Expenses</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <div>Amazon.com</div>
                <div className="text-xs text-gray-500">Aug 22, 2025</div>
              </div>
              <span className="font-medium">$79.99</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <div>Grocery Store</div>
                <div className="text-xs text-gray-500">Aug 20, 2025</div>
              </div>
              <span className="font-medium">$124.35</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <div>Gas Station</div>
                <div className="text-xs text-gray-500">Aug 19, 2025</div>
              </div>
              <span className="font-medium">$45.50</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div>Coffee Shop</div>
                <div className="text-xs text-gray-500">Aug 18, 2025</div>
              </div>
              <span className="font-medium">$5.75</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Spending by Category</h3>
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded mb-3">
            <p className="text-gray-500">Pie chart would appear here</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Shopping (36%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Dining (25%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span>Transport (18%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span>Entertainment (21%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const budgetsContent = (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Monthly Budgets</h3>
        <button className="bg-blue-600 text-white rounded-lg px-3 py-1.5 text-sm">
          Add Budget
        </button>
      </div>

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Shopping</h4>
            <span>$1,245.33 / $1,000.00</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-red-500 h-2.5 rounded-full"
              style={{ width: "124.5%" }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-red-500">Over budget by $245.33</span>
            <span>124.5%</span>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Dining</h4>
            <span>$875.25 / $1,200.00</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: "73%" }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-green-500">$324.75 left</span>
            <span>73%</span>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Entertainment</h4>
            <span>$354.99 / $500.00</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: "71%" }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-green-500">$145.01 left</span>
            <span>71%</span>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Transportation</h4>
            <span>$223.50 / $300.00</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: "74.5%" }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-green-500">$76.50 left</span>
            <span>74.5%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const analyticsContent = (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h3 className="text-lg font-medium mb-6">Expense Analytics</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Monthly Trend</h4>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Bar chart would appear here</p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Year-to-Date</h4>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-500">Line chart would appear here</p>
          </div>
        </div>
      </div>

      <div className="mt-6 border rounded-lg p-4">
        <h4 className="font-medium mb-3">Expense Insights</h4>
        <div className="space-y-2">
          <div className="flex items-start">
            <div className="bg-yellow-100 p-1 rounded mr-2 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-yellow-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 110-12 6 6 0 010 12z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm">
                Your shopping expenses have increased by 24% compared to last
                month.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-green-100 p-1 rounded mr-2 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm">
                You've managed to reduce your dining expenses by 10% this month.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-red-100 p-1 rounded mr-2 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 9a1 1 0 011-1h2a1 1 0 010 2H9a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm">
                You've exceeded your shopping budget for 3 consecutive months.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const planningContent = (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h3 className="text-lg font-medium mb-6">Financial Planning</h3>

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Savings Goals</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <div>
                  <span className="font-medium">Vacation Fund</span>
                  <span className="text-xs text-gray-500 ml-2">
                    Target: December 2025
                  </span>
                </div>
                <span>$2,500 / $5,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div>
                  <span className="font-medium">Emergency Fund</span>
                  <span className="text-xs text-gray-500 ml-2">
                    Target: March 2026
                  </span>
                </div>
                <span>$7,250 / $15,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: "48.3%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div>
                  <span className="font-medium">New Laptop</span>
                  <span className="text-xs text-gray-500 ml-2">
                    Target: October 2025
                  </span>
                </div>
                <span>$950 / $1,800</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: "52.8%" }}
                ></div>
              </div>
            </div>
          </div>
          <button className="text-blue-600 text-sm mt-4">Add New Goal</button>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-3">Budget Planning</h4>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
            <h5 className="font-medium mb-2">
              Recommended Budget Distribution
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Essential Expenses (Housing, Utilities)</span>
                <span className="font-medium">50%</span>
              </div>
              <div className="flex justify-between">
                <span>Savings & Debt Repayment</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="flex justify-between">
                <span>Discretionary Spending</span>
                <span className="font-medium">30%</span>
              </div>
            </div>
          </div>
          <button className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm">
            Create Budget Plan
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight">
          Expense Management
        </h1>
        <p className="text-muted-foreground">
          Track, analyze and optimize your spending
        </p>
      </div>

      <TabList
        items={[
          {
            value: "overview",
            label: "Overview",
            icon: <PieChart className="h-4 w-4 mr-2" />,
            content: overviewContent,
          },
          {
            value: "budgets",
            label: "Budgets",
            icon: <DollarSign className="h-4 w-4 mr-2" />,
            content: budgetsContent,
          },
          {
            value: "analytics",
            label: "Analytics",
            icon: <BarChart2 className="h-4 w-4 mr-2" />,
            content: analyticsContent,
          },
          {
            value: "planning",
            label: "Planning",
            icon: <Target className="h-4 w-4 mr-2" />,
            content: planningContent,
          },
        ]}
        defaultValue="overview"
        variant="pills"
        className="w-full"
      />
    </div>
  );
}
