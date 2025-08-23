"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 h-auto p-1 mb-6">
          <TabsTrigger
            value="company"
            className="flex items-center py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <Users className="h-4 w-4 mr-2" />
            <span>Company Research</span>
          </TabsTrigger>
          <TabsTrigger
            value="financials"
            className="flex items-center py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span>Financial Statements</span>
          </TabsTrigger>
          <TabsTrigger
            value="ratios"
            className="flex items-center py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            <span>Ratio Analysis</span>
          </TabsTrigger>
          <TabsTrigger
            value="peers"
            className="flex items-center py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <PieChart className="h-4 w-4 mr-2" />
            <span>Peer Comparison</span>
          </TabsTrigger>
          <TabsTrigger
            value="valuation"
            className="flex items-center py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <FileBarChart className="h-4 w-4 mr-2" />
            <span>Valuation Models</span>
          </TabsTrigger>
          <TabsTrigger
            value="industry"
            className="flex items-center py-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <Globe className="h-4 w-4 mr-2" />
            <span>Industry Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <CompanyResearch />
        </TabsContent>

        <TabsContent value="financials">
          <FinancialStatements />
        </TabsContent>

        <TabsContent value="ratios">
          <RatioAnalysis />
        </TabsContent>

        <TabsContent value="peers">
          <PeerComparison />
        </TabsContent>

        <TabsContent value="valuation">
          <ValuationModels />
        </TabsContent>

        <TabsContent value="industry">
          <IndustryAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
}
