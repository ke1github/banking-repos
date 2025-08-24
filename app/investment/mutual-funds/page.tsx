"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TabList from "@/components/ui/TabList";
import { Badge } from "@/components/ui/badge";
import {
  ChartPie,
  TrendingUp,
  BarChart,
  Search,
  PieChart,
  ArrowLeft,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function MutualFundsPage() {
  const [activeTab, setActiveTab] = useState("my-funds");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mutual Funds</h1>
          <p className="text-muted-foreground">
            Explore and manage your mutual fund investments
          </p>
        </div>
        <div className="flex gap-3">
          <ButtonLink
            href="/investment"
            variant="ghost"
            icon={<ArrowLeft className="h-4 w-4" />}
            shape="rounded"
            size="sm"
          >
            Back
          </ButtonLink>
          <ButtonLink
            href="/investment/screener"
            section="investment"
            variant="outline"
            icon={<Search className="h-4 w-4" />}
            shape="rounded"
            size="sm"
          >
            Fund Screener
          </ButtonLink>
        </div>
      </div>

      <TabList
        items={fundTabs}
        value={activeTab}
        onValueChange={setActiveTab}
        pageStyle="default"
      />
    </div>
  );
}

const fundTabs = [
  {
    value: "my-funds",
    label: "My Funds",
    icon: <PieChart className="h-4 w-4 mr-2" />,
    content: (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">
          Your Mutual Fund Portfolio
        </h3>
        <div className="h-80 flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-4">
            You don't have any mutual funds yet
          </p>
          <ButtonLink
            href="/investment/screener"
            section="investment"
            shape="rounded"
          >
            Start Investing
          </ButtonLink>
        </div>
      </div>
    ),
  },
  {
    value: "explore",
    label: "Explore Funds",
    icon: <Search className="h-4 w-4 mr-2" />,
    content: (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Explore Mutual Funds</h3>
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">
            Mutual fund search results would appear here
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <ButtonLink
            href="/investment/screener"
            section="investment"
            variant="outline"
            size="sm"
            icon={<Search className="h-4 w-4" />}
          >
            Go to Advanced Screener
          </ButtonLink>
        </div>
      </div>
    ),
  },
  {
    value: "performance",
    label: "Performance",
    icon: <TrendingUp className="h-4 w-4 mr-2" />,
    content: (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Fund Performance</h3>
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">
            Performance comparison would appear here
          </p>
        </div>
      </div>
    ),
  },
  {
    value: "categories",
    label: "Categories",
    icon: <ChartPie className="h-4 w-4 mr-2" />,
    content: (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Fund Categories</h3>
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">
            Fund categories would appear here
          </p>
        </div>
      </div>
    ),
  },
  {
    value: "comparison",
    label: "Comparison",
    icon: <BarChart className="h-4 w-4 mr-2" />,
    content: (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Fund Comparison</h3>
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">
            Fund comparison tool would appear here
          </p>
        </div>
      </div>
    ),
  },
];
