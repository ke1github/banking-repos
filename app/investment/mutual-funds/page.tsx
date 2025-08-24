"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TabList from "@/components/ui/TabList";
import { Badge } from "@/components/ui/badge";
import { ChartPie, TrendingUp, BarChart, Search, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MutualFundsPage() {
  const [activeTab, setActiveTab] = useState("my-funds");

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
            <Button>Start Investing</Button>
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
              Fund explorer would appear here
            </p>
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Mutual Funds</h1>
        <p className="text-muted-foreground">
          Explore and manage your mutual fund investments
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Mutual Fund Explorer</CardTitle>
            <Badge variant="outline" className="text-xs font-normal py-0 h-5">
              Updated Daily
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <TabList
            items={fundTabs}
            defaultValue="my-funds"
            value={activeTab}
            onValueChange={setActiveTab}
            variant="boxed"
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}
