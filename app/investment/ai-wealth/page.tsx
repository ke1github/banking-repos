"use client";

import React, { useState } from "react";
import TabList from "@/components/ui/TabList";
import {
  BarChart3,
  Brain,
  Target,
  MessageSquare,
  TrendingUp,
  PieChart,
} from "lucide-react";
import AIWealthDashboard from "@/components/wealth/AIWealthDashboard";
import AIFinancialAssistant from "@/components/wealth/AIFinancialAssistant";
import AIMarketPredictions from "@/components/wealth/AIMarketPredictions";
import PortfolioOptimization from "@/components/wealth/PortfolioOptimization";

export default function WealthManagementPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Wealth Management</h1>
        <p className="text-muted-foreground">
          Your intelligent financial companion for building and managing wealth
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
            value: "dashboard",
            label: "Dashboard",
            icon: <BarChart3 className="h-4 w-4 mr-2" />,
            content: <AIWealthDashboard />,
          },
          {
            value: "predictions",
            label: "Predictions",
            icon: <Brain className="h-4 w-4 mr-2" />,
            content: <AIMarketPredictions />,
          },
          {
            value: "optimization",
            label: "Portfolio Optimization",
            icon: <PieChart className="h-4 w-4 mr-2" />,
            content: <PortfolioOptimization />,
          },
          {
            value: "goals",
            label: "Smart Goals",
            icon: <Target className="h-4 w-4 mr-2" />,
            content: (
              <div className="container px-4 py-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">
                      Smart Financial Goals
                    </h1>
                    <p className="text-muted-foreground">
                      AI-powered goal planning and tracking
                    </p>
                  </div>
                </div>

                <div className="p-8 rounded-lg border border-gray-200 text-center">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 text-blue-500 opacity-50" />
                  <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
                  <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
                    Our smart financial goals feature is currently under
                    development. Soon you'll be able to create, track, and
                    achieve your financial goals with AI-powered recommendations
                    and insights.
                  </p>
                </div>
              </div>
            ),
          },
          {
            value: "assistant",
            label: "AI Assistant",
            icon: <MessageSquare className="h-4 w-4 mr-2" />,
            content: <AIFinancialAssistant />,
          },
        ]}
        tabsListClassName="grid grid-cols-5 mb-6"
      />
    </div>
  );
}
