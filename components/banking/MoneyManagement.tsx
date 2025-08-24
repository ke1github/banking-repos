"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  DollarSign,
  CreditCard,
  ShoppingBag,
  Coffee,
  Home,
  Car,
  Utensils,
  Wifi,
  Globe,
  BookOpen,
  Heart,
  Film,
  Plus,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  Download,
  Settings,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Mock data for monthly spending
const monthlySpendingData = [
  { month: "Jan", amount: 2340 },
  { month: "Feb", amount: 2100 },
  { month: "Mar", amount: 2800 },
  { month: "Apr", amount: 2500 },
  { month: "May", amount: 2700 },
  { month: "Jun", amount: 2200 },
  { month: "Jul", amount: 2400 },
  { month: "Aug", amount: 2600 },
  { month: "Sep", amount: 2350 },
  { month: "Oct", amount: 2900 },
  { month: "Nov", amount: 3100 },
  { month: "Dec", amount: 3500 },
];

// Mock data for spending by category
const spendingByCategoryData = [
  { name: "Housing", value: 35, color: "#4f46e5" },
  { name: "Food", value: 20, color: "#16a34a" },
  { name: "Transportation", value: 15, color: "#ea580c" },
  { name: "Entertainment", value: 10, color: "#9333ea" },
  { name: "Utilities", value: 10, color: "#2563eb" },
  { name: "Shopping", value: 5, color: "#db2777" },
  { name: "Other", value: 5, color: "#78716c" },
];

// Mock data for income vs expenses
const incomeVsExpensesData = [
  { month: "Jul", income: 4800, expenses: 2400 },
  { month: "Aug", income: 5200, expenses: 2600 },
  { month: "Sep", income: 4900, expenses: 2350 },
  { month: "Oct", income: 5100, expenses: 2900 },
  { month: "Nov", income: 5500, expenses: 3100 },
  { month: "Dec", income: 6000, expenses: 3500 },
];

// Mock recent transactions
const recentTransactions = [
  {
    id: 1,
    description: "Grocery Store",
    category: "Food",
    amount: -128.42,
    date: "Today",
    icon: <ShoppingBag className="h-4 w-4" />,
    color: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    description: "Monthly Salary",
    category: "Income",
    amount: 4750.0,
    date: "Yesterday",
    icon: <DollarSign className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    description: "Electric Bill",
    category: "Utilities",
    amount: -94.32,
    date: "May 12, 2023",
    icon: <Wifi className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 4,
    description: "Car Payment",
    category: "Transportation",
    amount: -412.25,
    date: "May 10, 2023",
    icon: <Car className="h-4 w-4" />,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: 5,
    description: "Coffee Shop",
    category: "Food",
    amount: -4.5,
    date: "May 9, 2023",
    icon: <Coffee className="h-4 w-4" />,
    color: "bg-green-100 text-green-700",
  },
  {
    id: 6,
    description: "Movie Tickets",
    category: "Entertainment",
    amount: -32.0,
    date: "May 8, 2023",
    icon: <Film className="h-4 w-4" />,
    color: "bg-pink-100 text-pink-700",
  },
];

// Mock budget data
const budgetData = [
  {
    category: "Housing",
    icon: <Home className="h-4 w-4" />,
    allocated: 1500,
    spent: 1450,
    color: "bg-indigo-100 text-indigo-700",
    progress: 97,
  },
  {
    category: "Food",
    icon: <Utensils className="h-4 w-4" />,
    allocated: 800,
    spent: 620,
    color: "bg-green-100 text-green-700",
    progress: 78,
  },
  {
    category: "Transportation",
    icon: <Car className="h-4 w-4" />,
    allocated: 600,
    spent: 580,
    color: "bg-orange-100 text-orange-700",
    progress: 97,
  },
  {
    category: "Entertainment",
    icon: <Film className="h-4 w-4" />,
    allocated: 400,
    spent: 250,
    color: "bg-pink-100 text-pink-700",
    progress: 63,
  },
  {
    category: "Utilities",
    icon: <Wifi className="h-4 w-4" />,
    allocated: 400,
    spent: 320,
    color: "bg-blue-100 text-blue-700",
    progress: 80,
  },
];

export default function MoneyManagement() {
  const [timeRange, setTimeRange] = useState("6M");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Money Management
          </h1>
          <p className="text-muted-foreground">
            Track your spending habits and manage your budgets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Spending</CardTitle>
            <CardDescription>Last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlySpendingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(value) => `$${value}`}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value}`, "Spending"]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    border: "none",
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-2 flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground">Average</p>
                <p className="font-medium">$2,607</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total YTD</p>
                <p className="font-medium">$31,290</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Trend</p>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <p className="text-green-600 font-medium">+8.2%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Spending by Category</CardTitle>
            <CardDescription>Current month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[200px]">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={spendingByCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {spendingByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Percentage"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              {spendingByCategoryData.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center text-xs">
                  <div
                    className="h-3 w-3 rounded-full mr-1"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Income vs Expenses</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={incomeVsExpensesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(value) => `$${value}`}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    const formattedName =
                      name === "income" ? "Income" : "Expenses";
                    return [`$${value}`, formattedName];
                  }}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    border: "none",
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="income" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-2 flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full mr-1 bg-indigo-600"></div>
                <p className="text-xs">Income</p>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full mr-1 bg-red-600"></div>
                <p className="text-xs">Expenses</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Savings Rate</p>
                <p className="font-medium">42%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <CardDescription>Your latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${transaction.color}`}>
                      {transaction.icon}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Badge variant="outline" className="mr-2 text-xs">
                          {transaction.category}
                        </Badge>
                        {transaction.date}
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      transaction.amount > 0
                        ? "text-green-600 font-medium"
                        : "font-medium"
                    }
                  >
                    {transaction.amount > 0 ? "+" : ""}$
                    {Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline">
                View All Transactions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Budget Tracker */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Budget Tracker</CardTitle>
            <CardDescription>May 2023 spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetData.map((budget, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`p-1.5 rounded-full mr-2 ${budget.color}`}
                      >
                        {budget.icon}
                      </div>
                      <span className="font-medium text-sm">
                        {budget.category}
                      </span>
                    </div>
                    <span className="text-sm">
                      ${budget.spent} / ${budget.allocated}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        budget.progress > 95
                          ? "bg-red-500"
                          : budget.progress > 75
                          ? "bg-amber-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${budget.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Budget
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Smart Insights</CardTitle>
          <CardDescription>
            Financial analysis based on your spending patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-medium">Spending Trend</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your spending has decreased by 12% compared to last month. Keep
                up the good work!
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <Wallet className="h-5 w-5 text-amber-600 mr-2" />
                <h3 className="font-medium">Saving Opportunity</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                You could save $85 monthly by reducing your subscription
                services spending.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                <h3 className="font-medium">Upcoming Bills</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                You have 3 upcoming bills totaling $520 due in the next 7 days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
