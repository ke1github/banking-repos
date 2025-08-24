"use client";

import React from "react";
import TabList from "@/components/ui/TabList";
import { DollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import components
import { SummaryCard } from "./SummaryCard";
import { OverviewSection } from "./OverviewSection";
import { HoldingsSection } from "./HoldingsSection";
import { ActivitySection } from "./ActivitySection";
import { AnalysisSection } from "./AnalysisSection";

// Import data
import { portfolioSummary } from "./data/mockData";

export default function PortfolioPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Portfolio</h1>
          <p className="text-muted-foreground">
            View and manage all your investments in one place
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <DollarSign className="h-4 w-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Portfolio Value"
          value={portfolioSummary.totalValue}
          changePercent={portfolioSummary.allTimeGainPercent}
          subtitle="all time"
          change={portfolioSummary.allTimeGain}
        />

        <SummaryCard
          title="Today's Change"
          value={portfolioSummary.todayChange}
          changePercent={portfolioSummary.todayChangePercent}
          subtitle="Updated just now"
        />

        <SummaryCard
          title="Buying Power"
          value={portfolioSummary.buyingPower}
          subtitle="Available to invest"
        />
      </div>

      <TabList
        defaultValue="overview"
        variant="underline"
        pageStyle="default"
        className="w-full"
        tabsListClassName="grid w-full grid-cols-4 mb-6"
        items={[
          {
            value: "overview",
            label: "Overview",
            content: <OverviewSection />,
          },
          {
            value: "holdings",
            label: "Holdings",
            content: <HoldingsSection />,
          },
          {
            value: "activity",
            label: "Activity",
            content: <ActivitySection />,
          },
          {
            value: "analysis",
            label: "Analysis",
            content: <AnalysisSection />,
          },
        ]}
      />
    </div>
  );
}
