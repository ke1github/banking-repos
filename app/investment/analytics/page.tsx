"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TabList from "@/components/ui/TabList";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  ListFilter,
  Globe,
  BookOpen,
  Copy,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// This is a placeholder component - in a real implementation, you'd have proper components
const PlaceholderContent = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <Separator />
    <div className="h-[400px] flex items-center justify-center border border-dashed rounded-lg">
      <p className="text-muted-foreground">
        {title} visualization would appear here
      </p>
    </div>
  </div>
);

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("portfolio-analysis");

  const analyticsTabs = [
    {
      value: "portfolio-analysis",
      label: "Portfolio Analysis",
      icon: <PieChart className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Portfolio Analysis"
          description="Comprehensive analysis of your investment portfolio performance, diversification, and risk metrics."
        />
      ),
    },
    {
      value: "performance",
      label: "Performance",
      icon: <TrendingUp className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Performance Metrics"
          description="Detailed performance metrics of your investments over time, including returns, benchmarks, and growth."
        />
      ),
    },
    {
      value: "risk-analysis",
      label: "Risk Analysis",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Risk Analysis"
          description="Assessment of your portfolio risk metrics, including volatility, drawdowns, and risk-adjusted returns."
        />
      ),
    },
    {
      value: "correlations",
      label: "Correlations",
      icon: <Copy className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Asset Correlations"
          description="Analysis of correlations between different assets in your portfolio to optimize diversification."
        />
      ),
    },
    {
      value: "attribution",
      label: "Attribution",
      icon: <ListFilter className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Performance Attribution"
          description="Breakdown of portfolio performance by sector, asset class, and individual positions."
        />
      ),
    },
    {
      value: "market-analysis",
      label: "Market Analysis",
      icon: <Globe className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Market Analysis"
          description="Analysis of market trends, sector performance, and economic indicators relevant to your investments."
        />
      ),
    },
    {
      value: "forecasting",
      label: "Forecasting",
      icon: <LineChart className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Portfolio Forecasting"
          description="Projections and scenario analysis for your portfolio based on different market conditions."
        />
      ),
    },
    {
      value: "reports",
      label: "Reports",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Investment Reports"
          description="Generate comprehensive reports on your investment performance for tax and planning purposes."
        />
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">
          Investment Analytics
        </h1>
        <p className="text-muted-foreground">
          Advanced analysis and insights for your investment portfolio
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Analytics Dashboard</CardTitle>
            <Badge variant="outline" className="text-xs font-normal py-0 h-5">
              Real-time
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <TabList
            items={analyticsTabs}
            defaultValue="portfolio-analysis"
            value={activeTab}
            onValueChange={setActiveTab}
            variant="boxed"
            pageStyle="default"
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}
