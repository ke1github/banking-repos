"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TabList, { TabItem } from "@/components/ui/TabList";
import { ButtonLink } from "@/components/ui/ButtonLink";
import {
  BarChart4,
  TrendingUp,
  Layers,
  Briefcase,
  CreditCard,
  Bitcoin,
  Calculator,
  ArrowLeft,
} from "lucide-react";
import StockScreener from "@/components/investment/screeners/StockScreener";
import ETFScreener from "@/components/investment/screeners/ETFScreener";
import MutualFundScreener from "@/components/investment/screeners/MutualFundScreener";
import BondScreener from "@/components/investment/screeners/BondScreener";
import IndianStockScreener from "@/components/investment/screeners/IndianStockScreener";
import CryptoScreener from "@/components/investment/screeners/CryptoScreener";

export default function ScreenerPage() {
  const [activeTab, setActiveTab] = useState("stocks");

  const tabs: TabItem[] = [
    {
      value: "stocks",
      label: "Stocks",
      icon: <BarChart4 className="h-4 w-4" />,
      content: <StockScreener searchQuery="" />,
    },
    {
      value: "indian-stocks",
      label: "Indian Stocks",
      icon: <TrendingUp className="h-4 w-4" />,
      content: <IndianStockScreener />,
    },
    {
      value: "etfs",
      label: "ETFs",
      icon: <Layers className="h-4 w-4" />,
      content: <ETFScreener searchQuery="" />,
    },
    {
      value: "mutual-funds",
      label: "Mutual Funds",
      icon: <Briefcase className="h-4 w-4" />,
      content: <MutualFundScreener searchQuery="" />,
    },
    {
      value: "bonds",
      label: "Bonds",
      icon: <CreditCard className="h-4 w-4" />,
      content: <BondScreener searchQuery="" />,
    },
    {
      value: "crypto",
      label: "Cryptocurrencies",
      icon: <Bitcoin className="h-4 w-4" />,
      content: <CryptoScreener searchQuery="" />,
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Investment Screener</h1>
          <p className="text-muted-foreground">
            Find and filter investment opportunities across different asset
            classes
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
            href="/investment/calculators"
            section="investment"
            variant="outline"
            icon={<Calculator className="h-4 w-4" />}
            shape="rounded"
            size="sm"
          >
            Calculators
          </ButtonLink>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Screeners</CardTitle>
        </CardHeader>
        <CardContent>
          <TabList
            items={tabs}
            value={activeTab}
            onValueChange={setActiveTab}
            variant="boxed"
            pageStyle="screener"
            showContent
          />
        </CardContent>
      </Card>
    </div>
  );
}
