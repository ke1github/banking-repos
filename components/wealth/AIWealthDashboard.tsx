"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/custom-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  LucideInfo,
  Target,
  Activity,
  PieChart,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { aiWealthService } from "@/lib/api/aiWealthService";
import {
  WealthInsight,
  FinancialGoal,
  FinancialHealthScore,
  PersonalizedStrategy,
} from "@/lib/types/ai-wealth-types";
import { formatIndianCurrency } from "@/lib/types/indianStocks";

export default function AIWealthDashboard() {
  const [insights, setInsights] = useState<WealthInsight[]>([]);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [healthScore, setHealthScore] = useState<FinancialHealthScore | null>(
    null
  );
  const [strategies, setStrategies] = useState<PersonalizedStrategy[]>([]);
  const [loading, setLoading] = useState({
    insights: true,
    goals: true,
    healthScore: true,
    strategies: true,
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load insights
        const insightsData = await aiWealthService.getWealthInsights(
          "mock-user-id"
        );
        setInsights(insightsData);
        setLoading((prev) => ({ ...prev, insights: false }));

        // Load goals
        const goalsData = await aiWealthService.getFinancialGoals(
          "mock-user-id"
        );
        setGoals(goalsData);
        setLoading((prev) => ({ ...prev, goals: false }));

        // Load health score
        const healthScoreData = await aiWealthService.getFinancialHealthScore(
          "mock-user-id"
        );
        setHealthScore(healthScoreData);
        setLoading((prev) => ({ ...prev, healthScore: false }));

        // Load personalized strategies
        const strategiesData = await aiWealthService.getPersonalizedStrategies(
          "mock-user-id"
        );
        setStrategies(strategiesData);
        setLoading((prev) => ({ ...prev, strategies: false }));
      } catch (error) {
        console.error("Error loading AI wealth data:", error);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    setLoading({
      insights: true,
      goals: true,
      healthScore: true,
      strategies: true,
    });

    try {
      // Refresh insights
      const insightsData = await aiWealthService.getWealthInsights(
        "mock-user-id"
      );
      setInsights(insightsData);
      setLoading((prev) => ({ ...prev, insights: false }));

      // Refresh goals
      const goalsData = await aiWealthService.getFinancialGoals("mock-user-id");
      setGoals(goalsData);
      setLoading((prev) => ({ ...prev, goals: false }));

      // Refresh health score
      const healthScoreData = await aiWealthService.getFinancialHealthScore(
        "mock-user-id"
      );
      setHealthScore(healthScoreData);
      setLoading((prev) => ({ ...prev, healthScore: false }));

      // Refresh personalized strategies
      const strategiesData = await aiWealthService.getPersonalizedStrategies(
        "mock-user-id"
      );
      setStrategies(strategiesData);
      setLoading((prev) => ({ ...prev, strategies: false }));
    } catch (error) {
      console.error("Error refreshing AI wealth data:", error);
    }
  };

  return (
    <div className="container px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI Wealth Builder</h1>
          <p className="text-muted-foreground">
            Personalized insights and recommendations for your financial journey
          </p>
        </div>
        <Button
          onClick={refreshData}
          className="mt-2 md:mt-0"
          variant="outline"
          disabled={Object.values(loading).some((v) => v)}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Insights
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="insights">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Target className="h-4 w-4 mr-2" />
            Financial Goals
          </TabsTrigger>
          <TabsTrigger value="health">
            <Activity className="h-4 w-4 mr-2" />
            Financial Health
          </TabsTrigger>
          <TabsTrigger value="strategies">
            <PieChart className="h-4 w-4 mr-2" />
            Strategies
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Financial Health Score Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Financial Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading.healthScore ? (
                  <div className="flex justify-center items-center h-32">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : healthScore ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-3xl font-bold">
                        {healthScore.overall}/100
                      </div>
                      <Badge
                        variant={
                          healthScore.overall >= 80
                            ? "success"
                            : healthScore.overall >= 60
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {healthScore.overall >= 80
                          ? "Excellent"
                          : healthScore.overall >= 60
                          ? "Good"
                          : "Needs Attention"}
                      </Badge>
                    </div>
                    <div className="space-y-1 mt-4">
                      {Object.entries(healthScore.components).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between"
                          >
                            <div className="text-sm capitalize">{key}</div>
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                                <div
                                  className={`h-full rounded-full ${
                                    value >= 80
                                      ? "bg-green-500"
                                      : value >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                              <span className="text-xs">{value}</span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No health score data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Insights Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Top Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading.insights ? (
                  <div className="flex justify-center items-center h-32">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : insights.length > 0 ? (
                  <div className="space-y-3">
                    {insights.slice(0, 2).map((insight) => (
                      <div
                        key={insight.id}
                        className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <Badge
                                variant={
                                  insight.type === "opportunity"
                                    ? "success"
                                    : insight.type === "risk"
                                    ? "destructive"
                                    : insight.type === "alert"
                                    ? "warning"
                                    : "default"
                                }
                                className="capitalize mr-2"
                              >
                                {insight.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {insight.category}
                              </span>
                            </div>
                            <h4 className="font-medium mt-1">
                              {insight.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("insights")}
                      >
                        View All Insights
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No insights available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Goals Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Financial Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading.goals ? (
                  <div className="flex justify-center items-center h-32">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : goals.length > 0 ? (
                  <div className="space-y-3">
                    {goals.slice(0, 3).map((goal) => {
                      const progressPercent = Math.round(
                        (goal.currentAmount / goal.targetAmount) * 100
                      );
                      const remainingAmount =
                        goal.targetAmount - goal.currentAmount;

                      return (
                        <div
                          key={goal.id}
                          className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{goal.name}</h4>
                              <div className="text-xs text-muted-foreground capitalize">
                                {goal.category} • {goal.priority} priority
                              </div>
                            </div>
                            <Badge
                              variant={
                                progressPercent >= 75
                                  ? "success"
                                  : progressPercent >= 40
                                  ? "warning"
                                  : "outline"
                              }
                            >
                              {progressPercent}%
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div
                                className={`h-full rounded-full ${
                                  progressPercent >= 75
                                    ? "bg-green-500"
                                    : progressPercent >= 40
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                                }`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span>
                              {formatIndianCurrency(goal.currentAmount)} of{" "}
                              {formatIndianCurrency(goal.targetAmount)}
                            </span>
                            <span>
                              Need {formatIndianCurrency(remainingAmount)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("goals")}
                      >
                        View All Goals
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    No goals available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Strategies Section */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Recommended Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.strategies ? (
                <div className="flex justify-center items-center h-32">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : strategies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {strategies.map((strategy) => (
                    <div
                      key={strategy.id}
                      className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{strategy.name}</h4>
                        <Badge
                          variant={
                            strategy.riskLevel === "conservative"
                              ? "outline"
                              : strategy.riskLevel === "moderate"
                              ? "warning"
                              : "destructive"
                          }
                          className="capitalize"
                        >
                          {strategy.riskLevel}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {strategy.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span>Expected Return:</span>
                        <span className="font-medium">
                          {strategy.expectedReturn}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Suitability:</span>
                        <span className="font-medium">
                          {strategy.suitabilityScore}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Time Horizon:</span>
                        <span className="font-medium capitalize">
                          {strategy.timeHorizon}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={() => setActiveTab("strategies")}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No strategies available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              {loading.insights ? (
                <div className="flex justify-center items-center h-32">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <div
                      key={insight.id}
                      className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-2 rounded-full mr-4 ${
                            insight.type === "opportunity"
                              ? "bg-green-100 text-green-600"
                              : insight.type === "risk"
                              ? "bg-red-100 text-red-600"
                              : insight.type === "alert"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {insight.type === "opportunity" ? (
                            <TrendingUp className="h-5 w-5" />
                          ) : insight.type === "risk" ? (
                            <TrendingDown className="h-5 w-5" />
                          ) : insight.type === "alert" ? (
                            <LucideInfo className="h-5 w-5" />
                          ) : (
                            <BarChart3 className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <Badge
                              variant={
                                insight.type === "opportunity"
                                  ? "success"
                                  : insight.type === "risk"
                                  ? "destructive"
                                  : insight.type === "alert"
                                  ? "warning"
                                  : "default"
                              }
                              className="capitalize mr-2"
                            >
                              {insight.type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="capitalize mr-2"
                            >
                              {insight.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`capitalize ${
                                insight.impact === "high"
                                  ? "text-red-500"
                                  : insight.impact === "medium"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                              }`}
                            >
                              {insight.impact} impact
                            </Badge>
                          </div>
                          <h4 className="text-lg font-medium">
                            {insight.title}
                          </h4>
                          <p className="text-muted-foreground mt-1">
                            {insight.description}
                          </p>
                          {insight.relatedAssets &&
                            insight.relatedAssets.length > 0 && (
                              <div className="mt-2">
                                <span className="text-sm text-muted-foreground">
                                  Related assets:{" "}
                                </span>
                                {insight.relatedAssets.map((asset, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="mr-1"
                                  >
                                    {asset}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          <div className="flex mt-3">
                            {insight.actionable && (
                              <Button
                                size="sm"
                                variant="default"
                                className="mr-2"
                              >
                                Take Action
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No insights available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Financial Goals</CardTitle>
              <Button size="sm">Add New Goal</Button>
            </CardHeader>
            <CardContent>
              {loading.goals ? (
                <div className="flex justify-center items-center h-32">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : goals.length > 0 ? (
                <div className="space-y-4">
                  {goals.map((goal) => {
                    const progressPercent = Math.round(
                      (goal.currentAmount / goal.targetAmount) * 100
                    );
                    const remainingAmount =
                      goal.targetAmount - goal.currentAmount;
                    const targetDate = new Date(goal.targetDate);
                    const today = new Date();
                    const timeRemaining = Math.ceil(
                      (targetDate.getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24 * 30)
                    );

                    return (
                      <div
                        key={goal.id}
                        className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              <h4 className="text-lg font-medium">
                                {goal.name}
                              </h4>
                              <Badge
                                variant={
                                  goal.priority === "high"
                                    ? "destructive"
                                    : goal.priority === "medium"
                                    ? "warning"
                                    : "outline"
                                }
                                className="ml-2 capitalize"
                              >
                                {goal.priority} priority
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 capitalize">
                              {goal.category} • {timeRemaining} months remaining
                            </div>
                          </div>
                          <div className="mt-2 md:mt-0 flex items-center">
                            <Badge
                              variant={
                                progressPercent >= 75
                                  ? "success"
                                  : progressPercent >= 40
                                  ? "warning"
                                  : "outline"
                              }
                              className="text-base px-3 py-1"
                            >
                              {progressPercent}% funded
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="w-full h-3 bg-gray-200 rounded-full">
                            <div
                              className={`h-full rounded-full ${
                                progressPercent >= 75
                                  ? "bg-green-500"
                                  : progressPercent >= 40
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Current Amount
                            </div>
                            <div className="text-lg font-medium">
                              {formatIndianCurrency(goal.currentAmount)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Target Amount
                            </div>
                            <div className="text-lg font-medium">
                              {formatIndianCurrency(goal.targetAmount)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Shortfall
                            </div>
                            <div className="text-lg font-medium">
                              {formatIndianCurrency(remainingAmount)}
                            </div>
                          </div>
                        </div>

                        {goal.notes && (
                          <div className="mt-4 text-sm text-muted-foreground">
                            <strong>Notes:</strong> {goal.notes}
                          </div>
                        )}

                        <div className="flex mt-4">
                          <Button size="sm" variant="default" className="mr-2">
                            Contribute
                          </Button>
                          <Button size="sm" variant="outline" className="mr-2">
                            Edit Goal
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No goals available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Health Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              {loading.healthScore ? (
                <div className="flex justify-center items-center h-32">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : healthScore ? (
                <div>
                  <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold">
                        Your Financial Health Score: {healthScore.overall}/100
                      </h3>
                      <p className="text-muted-foreground">
                        {healthScore.overall >= 80
                          ? "Excellent! You're on a solid financial path."
                          : healthScore.overall >= 60
                          ? "Good. There's still room for improvement."
                          : "Needs attention. Let's work on improving your financial health."}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Badge
                        variant={
                          healthScore.overall >= 80
                            ? "success"
                            : healthScore.overall >= 60
                            ? "warning"
                            : "destructive"
                        }
                        className="text-lg px-4 py-2"
                      >
                        {healthScore.overall >= 80
                          ? "Excellent"
                          : healthScore.overall >= 60
                          ? "Good"
                          : "Needs Attention"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    {Object.entries(healthScore.components).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="bg-gray-50 rounded-lg p-4 text-center"
                        >
                          <div className="text-sm text-muted-foreground capitalize mb-1">
                            {key}
                          </div>
                          <div className="text-2xl font-bold mb-2">{value}</div>
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div
                              className={`h-full rounded-full ${
                                value >= 80
                                  ? "bg-green-500"
                                  : value >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {value >= 80
                              ? "Excellent"
                              : value >= 60
                              ? "Good"
                              : "Needs Attention"}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <h4 className="text-xl font-medium mb-4">
                    Recommendations to Improve Your Score
                  </h4>
                  <div className="space-y-4">
                    {healthScore.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start">
                          <div
                            className={`p-2 rounded-full mr-4 ${
                              rec.priority === "high"
                                ? "bg-red-100 text-red-600"
                                : rec.priority === "medium"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            <Target className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-1">
                              <Badge
                                variant={
                                  rec.priority === "high"
                                    ? "destructive"
                                    : rec.priority === "medium"
                                    ? "warning"
                                    : "success"
                                }
                                className="capitalize mr-2"
                              >
                                {rec.priority} priority
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {rec.category}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">
                              {rec.description}
                            </p>
                            <div className="flex items-center mt-2">
                              <span className="text-sm mr-2">
                                Potential impact:
                              </span>
                              <Badge variant="outline" className="bg-blue-50">
                                +{rec.potentialImpact} points
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No health score data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Recommended Investment Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              {loading.strategies ? (
                <div className="flex justify-center items-center h-32">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : strategies.length > 0 ? (
                <div className="space-y-6">
                  {strategies.map((strategy) => (
                    <div
                      key={strategy.id}
                      className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center">
                            <h4 className="text-xl font-medium">
                              {strategy.name}
                            </h4>
                            <Badge
                              variant={
                                strategy.riskLevel === "conservative"
                                  ? "outline"
                                  : strategy.riskLevel === "moderate"
                                  ? "warning"
                                  : "destructive"
                              }
                              className="ml-2 capitalize"
                            >
                              {strategy.riskLevel} risk
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mt-1">
                            {strategy.description}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <Badge
                            variant="success"
                            className="text-base px-3 py-1"
                          >
                            {strategy.suitabilityScore}% match
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Expected Return
                          </div>
                          <div className="text-lg font-medium">
                            {strategy.expectedReturn}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Time Horizon
                          </div>
                          <div className="text-lg font-medium capitalize">
                            {strategy.timeHorizon}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Last Updated
                          </div>
                          <div className="text-lg font-medium">
                            {new Date(strategy.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <h5 className="text-lg font-medium mb-3">
                        Asset Allocation
                      </h5>
                      <div className="space-y-3 mb-4">
                        {strategy.assetAllocation.map((allocation, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-1">
                              <span>{allocation.category}</span>
                              <span className="font-medium">
                                {allocation.percentage}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-full rounded-full bg-blue-500"
                                style={{ width: `${allocation.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <h5 className="text-lg font-medium mb-3">
                          Recommended Assets
                        </h5>
                        <div className="space-y-4">
                          {strategy.assetAllocation.map(
                            (allocation, categoryIndex) =>
                              allocation.recommendedAssets &&
                              allocation.recommendedAssets.length > 0 && (
                                <div key={categoryIndex} className="space-y-2">
                                  <h6 className="font-medium">
                                    {allocation.category}
                                  </h6>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {allocation.recommendedAssets.map(
                                      (asset, assetIndex) => (
                                        <div
                                          key={assetIndex}
                                          className="p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                        >
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <div className="font-medium">
                                                {asset.symbol}
                                              </div>
                                              <div className="text-sm text-muted-foreground">
                                                {asset.name}
                                              </div>
                                            </div>
                                            <Badge variant="outline">
                                              {asset.allocation}%
                                            </Badge>
                                          </div>
                                          <div className="text-xs text-muted-foreground mt-2">
                                            {asset.rationale}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </div>

                      <div className="flex mt-4">
                        <Button size="sm" variant="default" className="mr-2">
                          Implement Strategy
                        </Button>
                        <Button size="sm" variant="outline" className="mr-2">
                          Customize
                        </Button>
                        <Button size="sm" variant="outline">
                          Compare
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No strategies available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Financial Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg border border-gray-200 text-center">
                <h3 className="text-lg font-medium mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground">
                  Our AI Financial Assistant is currently under development.
                  Soon you'll be able to chat with an AI that understands your
                  financial situation and can provide personalized advice,
                  answer questions, and help you make better financial
                  decisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
