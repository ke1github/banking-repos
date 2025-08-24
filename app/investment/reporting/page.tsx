"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TabList from "@/components/ui/TabList";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  FileCheck,
  BarChart,
  Target,
  LineChart,
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
      <p className="text-muted-foreground">{title} would appear here</p>
    </div>
  </div>
);

export default function ReportingPage() {
  const [activeTab, setActiveTab] = useState("portfolio-reports");

  const reportingTabs = [
    {
      value: "portfolio-reports",
      label: "Portfolio Reports",
      icon: <PieChart className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Portfolio Reports"
          description="Comprehensive reports on your investment portfolio, including asset allocation, performance, and summary statistics."
        />
      ),
    },
    {
      value: "performance-reports",
      label: "Performance",
      icon: <TrendingUp className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Performance Reports"
          description="Detailed reports on your investment performance, including returns, benchmarks, and historical data."
        />
      ),
    },
    {
      value: "tax-reports",
      label: "Tax Reports",
      icon: <FileCheck className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Tax Reports"
          description="Tax-related reports for your investments, including realized gains/losses and tax-lot information."
        />
      ),
    },
    {
      value: "historical-reports",
      label: "Historical Data",
      icon: <Clock className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Historical Reports"
          description="Historical data and trends for your investments over custom time periods."
        />
      ),
    },
    {
      value: "goal-tracking",
      label: "Goal Tracking",
      icon: <Target className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Goal Tracking Reports"
          description="Reports tracking progress toward your financial goals and investment targets."
        />
      ),
    },
    {
      value: "projections",
      label: "Projections",
      icon: <LineChart className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Future Projections"
          description="Forward-looking projections based on your current portfolio and investment strategy."
        />
      ),
    },
    {
      value: "risk-reports",
      label: "Risk Reports",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Risk Reports"
          description="Analysis of portfolio risk metrics, drawdowns, and stress test scenarios."
        />
      ),
    },
    {
      value: "custom-reports",
      label: "Custom Reports",
      icon: <BarChart className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Custom Reports"
          description="Create and save custom reports tailored to your specific requirements and preferences."
        />
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">
          Investment Reporting
        </h1>
        <p className="text-muted-foreground">
          Generate detailed reports on your investment portfolio and performance
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Reports Dashboard</CardTitle>
            <Badge variant="outline" className="text-xs font-normal py-0 h-5">
              Exportable
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <TabList
            items={reportingTabs}
            defaultValue="portfolio-reports"
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
