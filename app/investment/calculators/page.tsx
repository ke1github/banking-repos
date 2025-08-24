"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TabList from "@/components/ui/TabList";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  Briefcase,
  ChartBar,
  TrendingUp,
  BarChart,
  PieChart,
  BarChart2,
  DollarSign,
  Home,
  ArrowLeft,
  Search,
} from "lucide-react";
import {
  CompoundInterestCalculator,
  RetirementCalculator,
  AssetAllocationCalculator,
  RebalancingCalculator,
  ROICalculator,
  MonteCarloCalculator,
  DividendCalculator,
  RealEstateCalculator,
} from "@/components/investment-calculators";

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState("compound");

  const calculators = [
    {
      value: "compound",
      label: "Compound Interest",
      icon: <ChartBar className="h-4 w-4 mr-1" />,
      content: <CompoundInterestCalculator />,
    },
    {
      value: "retirement",
      label: "Retirement",
      icon: <Briefcase className="h-4 w-4 mr-1" />,
      content: <RetirementCalculator />,
    },
    {
      value: "roi",
      label: "ROI Calculator",
      icon: <TrendingUp className="h-4 w-4 mr-1" />,
      content: <ROICalculator />,
    },
    {
      value: "asset-allocation",
      label: "Asset Allocation",
      icon: <PieChart className="h-4 w-4 mr-1" />,
      content: <AssetAllocationCalculator />,
    },
    {
      value: "rebalancing",
      label: "Rebalancing",
      icon: <BarChart className="h-4 w-4 mr-1" />,
      content: <RebalancingCalculator />,
    },
    {
      value: "monte-carlo",
      label: "Monte Carlo",
      icon: <BarChart2 className="h-4 w-4 mr-1" />,
      content: <MonteCarloCalculator />,
    },
    {
      value: "dividend",
      label: "Dividend",
      icon: <DollarSign className="h-4 w-4 mr-1" />,
      content: <DividendCalculator />,
    },
    {
      value: "real-estate",
      label: "Real Estate ROI",
      icon: <Home className="h-4 w-4 mr-1" />,
      content: <RealEstateCalculator />,
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Investment Calculators
          </h1>
          <p className="text-muted-foreground">
            Tools to help you plan and grow your investments
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
            Screener
          </ButtonLink>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Financial Calculators</CardTitle>
            <Badge variant="outline" className="text-xs font-normal py-0 h-5">
              Accurate
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <TabList
            items={calculators}
            value={activeTab}
            onValueChange={setActiveTab}
            variant="boxed"
            pageStyle="calculators"
          />
        </CardContent>
      </Card>
    </div>
  );
}
