"use client";

import React, { useState } from "react";
import TabList from "@/components/ui/TabList";
import {
  BarChart3,
  FileText,
  TrendingUp,
  Users,
  PieChart,
  FileBarChart,
  BarChart,
  Globe,
} from "lucide-react";
import CompanyResearch from "@/components/fundamental/CompanyResearch";
import FinancialStatements from "@/components/fundamental/FinancialStatements";
import RatioAnalysis from "@/components/fundamental/RatioAnalysis";
import PeerComparison from "@/components/fundamental/PeerComparison";
import ValuationModels from "@/components/fundamental/ValuationModels";
import IndustryAnalysis from "@/components/fundamental/IndustryAnalysis";

export default function FundamentalAnalysisPage() {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Advanced Fundamental Analysis
        </h1>
        <p className="text-muted-foreground">
          In-depth financial analysis and company research tools for informed
          investment decisions
        </p>
      </div>

      <TabList
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
        pageStyle="default"
        variant="pills"
        items={[
          {
            value: "company",
            label: "Company Research",
            icon: <Users className="h-4 w-4 mr-2" />,
            content: <CompanyResearch />,
          },
          {
            value: "financials",
            label: "Financial Statements",
            icon: <FileText className="h-4 w-4 mr-2" />,
            content: <FinancialStatements />,
          },
          {
            value: "ratios",
            label: "Ratio Analysis",
            icon: <BarChart3 className="h-4 w-4 mr-2" />,
            content: <RatioAnalysis />,
          },
          {
            value: "peers",
            label: "Peer Comparison",
            icon: <PieChart className="h-4 w-4 mr-2" />,
            content: <PeerComparison />,
          },
          {
            value: "valuation",
            label: "Valuation Models",
            icon: <FileBarChart className="h-4 w-4 mr-2" />,
            content: <ValuationModels />,
          },
          {
            value: "industry",
            label: "Industry Analysis",
            icon: <Globe className="h-4 w-4 mr-2" />,
            content: <IndustryAnalysis />,
          },
        ]}
        tabsListClassName="grid grid-cols-6 mb-6"
      />
    </div>
  );
}
