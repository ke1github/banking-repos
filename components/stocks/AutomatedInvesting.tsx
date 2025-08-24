"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Settings,
  ChevronRight,
  CreditCard,
  Calendar,
  CircleDollarSign,
  TrendingUp,
  Clock,
  AlertCircle,
  Sliders,
  BarChart4,
  Users,
  Shield,
  CheckCircle2,
  ArrowUpDown,
  Briefcase,
  RefreshCw,
  Sparkles,
  Brain,
  Coins,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

// Mock data for automated investment plans
const investmentPlans = [
  {
    id: "plan-1",
    name: "Conservative Growth",
    description:
      "Low-risk portfolio focused on capital preservation with modest growth",
    riskLevel: "Low",
    targetReturn: "4-6%",
    managementFee: "0.25%",
    minInvestment: "$500",
    allocation: {
      bonds: 60,
      largeCap: 20,
      midCap: 10,
      international: 5,
      alternatives: 5,
    },
    performance: {
      "1M": 0.8,
      "3M": 2.1,
      YTD: 3.5,
      "1Y": 5.2,
      "3Y": 15.8,
      "5Y": 27.4,
    },
  },
  {
    id: "plan-2",
    name: "Balanced Growth",
    description: "Balanced approach with moderate risk for long-term growth",
    riskLevel: "Medium",
    targetReturn: "6-8%",
    managementFee: "0.30%",
    minInvestment: "$1,000",
    allocation: {
      bonds: 40,
      largeCap: 30,
      midCap: 15,
      international: 10,
      alternatives: 5,
    },
    performance: {
      "1M": 1.2,
      "3M": 3.5,
      YTD: 5.2,
      "1Y": 7.8,
      "3Y": 24.5,
      "5Y": 42.3,
    },
  },
  {
    id: "plan-3",
    name: "Aggressive Growth",
    description: "Higher risk strategy focused on maximum long-term growth",
    riskLevel: "High",
    targetReturn: "8-12%",
    managementFee: "0.35%",
    minInvestment: "$1,500",
    allocation: {
      bonds: 15,
      largeCap: 35,
      midCap: 25,
      international: 15,
      alternatives: 10,
    },
    performance: {
      "1M": 1.8,
      "3M": 4.7,
      YTD: 7.9,
      "1Y": 11.5,
      "3Y": 36.8,
      "5Y": 64.5,
    },
  },
  {
    id: "plan-4",
    name: "Tech Innovation",
    description: "Focus on technology sector growth and innovation",
    riskLevel: "High",
    targetReturn: "10-15%",
    managementFee: "0.40%",
    minInvestment: "$2,000",
    allocation: {
      bonds: 5,
      largeCap: 35,
      midCap: 20,
      international: 15,
      tech: 20,
      alternatives: 5,
    },
    performance: {
      "1M": 2.3,
      "3M": 6.8,
      YTD: 10.5,
      "1Y": 16.7,
      "3Y": 45.6,
      "5Y": 89.3,
    },
  },
];

// Mock user portfolio data
const userPortfolio = {
  planId: "plan-2",
  planName: "Balanced Growth",
  startDate: "Feb 12, 2025",
  invested: 5000,
  currentValue: 5384.25,
  returns: 384.25,
  returnsPercentage: 7.68,
  nextContribution: {
    date: "Sep 5, 2025",
    amount: 250,
  },
  contributions: [
    { date: "Aug 1, 2025", amount: 250 },
    { date: "Jul 1, 2025", amount: 250 },
    { date: "Jun 1, 2025", amount: 250 },
    { date: "May 1, 2025", amount: 250 },
    { date: "Apr 1, 2025", amount: 250 },
    { date: "Mar 1, 2025", amount: 250 },
    { date: "Feb 12, 2025", amount: 3500 },
  ],
};

// Investment suggestions
const investmentSuggestions = [
  {
    title: "Increase Monthly Contribution",
    description:
      "Increasing your monthly contribution from $250 to $350 could yield an additional 12% returns over 5 years.",
    impact: "High",
    effort: "Medium",
  },
  {
    title: "Diversify into International Markets",
    description:
      "Adding 5% allocation to emerging markets could improve your portfolio's risk-adjusted returns.",
    impact: "Medium",
    effort: "Low",
  },
  {
    title: "Optimize Tax Strategy",
    description:
      "Consider moving high-yield assets to tax-advantaged accounts to minimize tax impact.",
    impact: "Medium",
    effort: "Medium",
  },
];

export default function AutomatedInvesting() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [initialInvestment, setInitialInvestment] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(100);
  const [investmentTimeline, setInvestmentTimeline] = useState(10);
  const [riskTolerance, setRiskTolerance] = useState("medium");

  // Get plan details by ID
  const getPlanById = (id: string) => {
    return investmentPlans.find((plan) => plan.id === id);
  };

  // Calculate estimated returns (simplified)
  const calculateEstimatedReturns = () => {
    const plan = selectedPlan ? getPlanById(selectedPlan) : investmentPlans[1]; // Default to balanced plan
    const annualReturnRate =
      parseFloat(plan?.targetReturn.split("-")[0].replace("%", "") || "6") /
      100;

    const totalMonthlyContributions =
      monthlyContribution * 12 * investmentTimeline;
    const initialWithGrowth =
      initialInvestment * Math.pow(1 + annualReturnRate, investmentTimeline);

    // Simplified future value of monthly contributions
    let futureValueOfContributions = 0;
    for (let i = 0; i < investmentTimeline * 12; i++) {
      futureValueOfContributions +=
        monthlyContribution * Math.pow(1 + annualReturnRate / 12, i);
    }

    const totalInvested = initialInvestment + totalMonthlyContributions;
    const totalValue = initialWithGrowth + futureValueOfContributions;
    const totalReturns = totalValue - totalInvested;

    return {
      totalInvested: totalInvested.toFixed(2),
      totalValue: totalValue.toFixed(2),
      totalReturns: totalReturns.toFixed(2),
      returnPercentage: ((totalReturns / totalInvested) * 100).toFixed(2),
    };
  };

  // For risk assessment questionnaire
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Simple questionnaire
  const riskQuestions = [
    {
      question: "What is your primary investment goal?",
      options: [
        { text: "Preserving my capital with minimal risk", value: "low" },
        { text: "Growing my wealth with moderate risk", value: "medium" },
        { text: "Maximizing returns with higher risk", value: "high" },
      ],
    },
    {
      question: "How would you react if your investment lost 20% in one month?",
      options: [
        { text: "Sell immediately to prevent further losses", value: "low" },
        { text: "Wait to see if it recovers before deciding", value: "medium" },
        { text: "Buy more at the lower price", value: "high" },
      ],
    },
    {
      question: "How long do you plan to keep your money invested?",
      options: [
        { text: "1-3 years", value: "low" },
        { text: "4-7 years", value: "medium" },
        { text: "8+ years", value: "high" },
      ],
    },
    {
      question: "What percentage of your total savings are you investing?",
      options: [
        { text: "Less than 25%", value: "high" },
        { text: "25% to 50%", value: "medium" },
        { text: "More than 50%", value: "low" },
      ],
    },
    {
      question: "Which statement best describes your investment knowledge?",
      options: [
        { text: "I'm new to investing", value: "low" },
        {
          text: "I understand the basics of stocks and bonds",
          value: "medium",
        },
        {
          text: "I'm experienced with various investment products",
          value: "high",
        },
      ],
    },
  ];

  const [answers, setAnswers] = useState<string[]>(
    Array(riskQuestions.length).fill("")
  );

  const handleQuestionAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);

    if (currentQuestionIndex < riskQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate risk profile based on answers
      const riskProfile = calculateRiskProfile(newAnswers);
      setRiskTolerance(riskProfile);

      // Select a plan based on risk profile
      if (riskProfile === "low") {
        setSelectedPlan("plan-1"); // Conservative
      } else if (riskProfile === "medium") {
        setSelectedPlan("plan-2"); // Balanced
      } else {
        setSelectedPlan("plan-3"); // Aggressive
      }

      setShowQuestionnaire(false);
      setCurrentQuestionIndex(0);
    }
  };

  const calculateRiskProfile = (userAnswers: string[]) => {
    // Count the frequency of each risk level
    const counts = {
      low: 0,
      medium: 0,
      high: 0,
    };

    userAnswers.forEach((answer) => {
      if (answer in counts) {
        counts[answer as keyof typeof counts]++;
      }
    });

    // Determine the most frequent answer
    if (counts.low >= counts.medium && counts.low >= counts.high) {
      return "low";
    } else if (counts.medium >= counts.low && counts.medium >= counts.high) {
      return "medium";
    } else {
      return "high";
    }
  };

  const estimatedReturns = calculateEstimatedReturns();

  return (
    <div className="space-y-6">
      {showQuestionnaire ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              Risk Tolerance Assessment
            </CardTitle>
            <CardDescription>
              Question {currentQuestionIndex + 1} of {riskQuestions.length}
            </CardDescription>
            <Progress
              value={(currentQuestionIndex / riskQuestions.length) * 100}
              className="mt-2"
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <h3 className="text-lg font-medium mb-4">
              {riskQuestions[currentQuestionIndex].question}
            </h3>
            <div className="space-y-3">
              {riskQuestions[currentQuestionIndex].options.map(
                (option, index) => (
                  <Button
                    key={index}
                    variant={
                      answers[currentQuestionIndex] === option.value
                        ? "default"
                        : "outline"
                    }
                    className="w-full justify-start text-left h-auto py-3 px-4"
                    onClick={() => handleQuestionAnswer(option.value)}
                  >
                    {option.text}
                  </Button>
                )
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                } else {
                  setShowQuestionnaire(false);
                }
              }}
            >
              {currentQuestionIndex > 0 ? "Previous Question" : "Cancel"}
            </Button>
            <div className="text-sm text-muted-foreground">
              Your answers help us determine your ideal investment strategy
            </div>
          </CardFooter>
        </Card>
      ) : (
        <>
          {/* Header Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                    Automated Investing
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Let our AI-powered robo-advisor manage your investments
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Our automated investing platform creates a diversified portfolio
                tailored to your goals and risk tolerance. Professional
                management with low fees and automatic rebalancing.
              </p>
            </CardContent>
          </Card>

          <Tabs
            defaultValue={userPortfolio ? "portfolio" : "plans"}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              {userPortfolio && (
                <TabsTrigger value="portfolio" className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  My Portfolio
                </TabsTrigger>
              )}
              <TabsTrigger value="plans" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Investment Plans
              </TabsTrigger>
              <TabsTrigger value="calculator" className="flex items-center">
                <Sliders className="h-4 w-4 mr-2" />
                Investment Calculator
              </TabsTrigger>
            </TabsList>

            {/* My Portfolio Tab */}
            {userPortfolio && (
              <TabsContent value="portfolio">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Portfolio Summary */}
                  <Card className="md:col-span-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Portfolio Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Current Plan
                          </div>
                          <Badge>{userPortfolio.planName}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Start Date
                          </div>
                          <div className="font-medium">
                            {userPortfolio.startDate}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-baseline">
                          <div className="text-sm text-muted-foreground">
                            Current Value
                          </div>
                          <div className="text-2xl font-bold">
                            $
                            {userPortfolio.currentValue.toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-sm text-muted-foreground">
                            Total Invested
                          </div>
                          <div className="font-medium">
                            ${userPortfolio.invested.toLocaleString("en-US")}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Total Returns
                          </div>
                          <div
                            className={`font-medium flex items-center ${
                              userPortfolio.returns >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {userPortfolio.returns >= 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            )}
                            $
                            {userPortfolio.returns.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            <span className="ml-1">
                              ({userPortfolio.returnsPercentage >= 0 ? "+" : ""}
                              {userPortfolio.returnsPercentage}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Next Contribution
                          </div>
                          <div className="font-medium">
                            ${userPortfolio.nextContribution.amount} on{" "}
                            {userPortfolio.nextContribution.date}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-4">
                        <Button variant="outline" className="w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Adjust Plan
                        </Button>
                        <Button className="w-full">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Add Funds
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Portfolio Performance */}
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          Portfolio Performance
                        </CardTitle>
                      </div>
                      <Select defaultValue="6M">
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue placeholder="Time Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1M">1 Month</SelectItem>
                          <SelectItem value="3M">3 Months</SelectItem>
                          <SelectItem value="6M">6 Months</SelectItem>
                          <SelectItem value="1Y">1 Year</SelectItem>
                          <SelectItem value="ALL">All Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center bg-muted/30 rounded-md mb-4">
                        <div className="text-center">
                          <LineChart className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mt-2">
                            Performance chart visualization would appear here
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {/* Contribution History */}
                        <div className="col-span-3">
                          <h3 className="text-sm font-medium mb-2">
                            Contribution History
                          </h3>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {userPortfolio.contributions.map(
                              (contribution, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-2 bg-muted/30 rounded-md text-sm"
                                >
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                    {contribution.date}
                                  </div>
                                  <div className="font-medium">
                                    ${contribution.amount}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Insights */}
                  <Card className="md:col-span-3">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                        AI Investment Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {investmentSuggestions.map((suggestion, index) => (
                          <Card key={index} className="bg-muted/30 border-0">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm">
                                {suggestion.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <p className="text-xs text-muted-foreground">
                                {suggestion.description}
                              </p>
                              <div className="flex justify-between mt-2 text-xs">
                                <div className="flex items-center">
                                  <span className="text-muted-foreground mr-1">
                                    Impact:
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`
                                    ${
                                      suggestion.impact === "High"
                                        ? "bg-green-100 text-green-800"
                                        : suggestion.impact === "Medium"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-orange-100 text-orange-800"
                                    }
                                  `}
                                  >
                                    {suggestion.impact}
                                  </Badge>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-muted-foreground mr-1">
                                    Effort:
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`
                                    ${
                                      suggestion.effort === "Low"
                                        ? "bg-green-100 text-green-800"
                                        : suggestion.effort === "Medium"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-orange-100 text-orange-800"
                                    }
                                  `}
                                  >
                                    {suggestion.effort}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-xs h-8"
                              >
                                Learn More
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            )}

            {/* Investment Plans Tab */}
            <TabsContent value="plans">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {investmentPlans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`relative overflow-hidden ${
                        selectedPlan === plan.id ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <div className="absolute top-0 right-0">
                          <Badge className="rounded-none rounded-bl-md">
                            Selected
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Risk Level
                            </div>
                            <div className="font-medium flex items-center">
                              <Badge
                                variant="outline"
                                className={`
                                ${
                                  plan.riskLevel === "Low"
                                    ? "bg-green-100 text-green-800"
                                    : plan.riskLevel === "Medium"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-orange-100 text-orange-800"
                                }
                              `}
                              >
                                {plan.riskLevel}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Target Return
                            </div>
                            <div className="font-medium">
                              {plan.targetReturn}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Fee
                            </div>
                            <div className="font-medium">
                              {plan.managementFee}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Min Investment
                            </div>
                            <div className="font-medium">
                              {plan.minInvestment}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground mb-2">
                            Asset Allocation
                          </div>
                          <div className="space-y-1">
                            {Object.entries(plan.allocation).map(
                              ([asset, percentage]) => (
                                <div
                                  key={asset}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <div className="capitalize">{asset}</div>
                                  <div className="flex items-center">
                                    <div className="w-32 mr-2">
                                      <Progress
                                        value={percentage}
                                        className="h-1.5"
                                      />
                                    </div>
                                    <div>{percentage}%</div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-muted-foreground mb-2">
                            Historical Performance
                          </div>
                          <div className="grid grid-cols-6 gap-1 text-xs">
                            {Object.entries(plan.performance).map(
                              ([period, value]) => (
                                <div key={period} className="text-center">
                                  <div className="font-medium text-xs mb-1">
                                    {period}
                                  </div>
                                  <div
                                    className={`${
                                      value >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {value >= 0 ? "+" : ""}
                                    {value}%
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          variant={
                            selectedPlan === plan.id ? "default" : "outline"
                          }
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          {selectedPlan === plan.id
                            ? "Selected"
                            : "Select Plan"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-blue-600" />
                      Not Sure Which Plan Is Right For You?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      Take our risk assessment questionnaire to help determine
                      your investment risk tolerance and get a personalized
                      recommendation.
                    </p>
                    <Button onClick={() => setShowQuestionnaire(true)}>
                      Start Risk Assessment
                    </Button>
                  </CardContent>
                </Card>

                {selectedPlan && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Get Started with {getPlanById(selectedPlan)?.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="initial-investment">
                            Initial Investment
                          </Label>
                          <Input
                            id="initial-investment"
                            type="number"
                            value={initialInvestment}
                            onChange={(e) =>
                              setInitialInvestment(Number(e.target.value))
                            }
                            min={500}
                          />
                          <p className="text-xs text-muted-foreground">
                            Minimum investment:{" "}
                            {getPlanById(selectedPlan)?.minInvestment}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="monthly-contribution">
                            Monthly Contribution
                          </Label>
                          <Input
                            id="monthly-contribution"
                            type="number"
                            value={monthlyContribution}
                            onChange={(e) =>
                              setMonthlyContribution(Number(e.target.value))
                            }
                            min={0}
                          />
                          <p className="text-xs text-muted-foreground">
                            Regular contributions help build wealth faster
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Switch id="auto-rebalance" defaultChecked />
                        <Label htmlFor="auto-rebalance">
                          Enable automatic portfolio rebalancing
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="dividend-reinvest" defaultChecked />
                        <Label htmlFor="dividend-reinvest">
                          Reinvest dividends automatically
                        </Label>
                      </div>

                      <div className="pt-4">
                        <Button className="w-full">
                          <CircleDollarSign className="h-4 w-4 mr-2" />
                          Start Investing
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Investment Calculator Tab */}
            <TabsContent value="calculator">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Investment Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="risk-profile">Risk Tolerance</Label>
                      <Select
                        value={riskTolerance}
                        onValueChange={setRiskTolerance}
                      >
                        <SelectTrigger id="risk-profile">
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            Conservative (Low Risk)
                          </SelectItem>
                          <SelectItem value="medium">
                            Balanced (Medium Risk)
                          </SelectItem>
                          <SelectItem value="high">
                            Aggressive (High Risk)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="initial-investment-calc">
                        Initial Investment
                      </Label>
                      <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-muted-foreground">$</span>
                          </div>
                          <Input
                            id="initial-investment-calc"
                            type="number"
                            value={initialInvestment}
                            onChange={(e) =>
                              setInitialInvestment(Number(e.target.value))
                            }
                            className="pl-7"
                            min={0}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Initial Investment Range</Label>
                      <Slider
                        value={[initialInvestment]}
                        min={0}
                        max={10000}
                        step={100}
                        onValueChange={(value) =>
                          setInitialInvestment(value[0])
                        }
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>$0</span>
                        <span>$5,000</span>
                        <span>$10,000</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthly-contribution-calc">
                        Monthly Contribution
                      </Label>
                      <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-muted-foreground">$</span>
                          </div>
                          <Input
                            id="monthly-contribution-calc"
                            type="number"
                            value={monthlyContribution}
                            onChange={(e) =>
                              setMonthlyContribution(Number(e.target.value))
                            }
                            className="pl-7"
                            min={0}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Monthly Contribution Range</Label>
                      <Slider
                        value={[monthlyContribution]}
                        min={0}
                        max={1000}
                        step={10}
                        onValueChange={(value) =>
                          setMonthlyContribution(value[0])
                        }
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>$0</span>
                        <span>$500</span>
                        <span>$1,000</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investment-timeline">
                        Investment Timeline (Years)
                      </Label>
                      <Input
                        id="investment-timeline"
                        type="number"
                        value={investmentTimeline}
                        onChange={(e) =>
                          setInvestmentTimeline(Number(e.target.value))
                        }
                        min={1}
                        max={40}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Investment Timeline Range</Label>
                      <Slider
                        value={[investmentTimeline]}
                        min={1}
                        max={30}
                        step={1}
                        onValueChange={(value) =>
                          setInvestmentTimeline(value[0])
                        }
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1 Year</span>
                        <span>15 Years</span>
                        <span>30 Years</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Investment Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="h-64 flex items-center justify-center bg-muted/30 rounded-md mb-4">
                      <div className="text-center">
                        <BarChart4 className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Investment growth projection chart would appear here
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">
                          Estimated Results
                        </h3>
                        <div className="space-y-3">
                          <div className="bg-muted/30 p-3 rounded-md">
                            <div className="text-sm text-muted-foreground">
                              Total Invested
                            </div>
                            <div className="text-2xl font-bold">
                              ${estimatedReturns.totalInvested}
                            </div>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-md">
                            <div className="text-sm text-muted-foreground">
                              Estimated Final Value
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                              ${estimatedReturns.totalValue}
                            </div>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-md">
                            <div className="text-sm text-muted-foreground">
                              Estimated Returns
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                              ${estimatedReturns.totalReturns}
                            </div>
                            <div className="text-sm text-green-600">
                              +{estimatedReturns.returnPercentage}%
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">
                          Recommended Plan
                        </h3>
                        <div className="space-y-3">
                          <div className="p-4 border rounded-md">
                            {riskTolerance === "low" && (
                              <>
                                <h4 className="font-medium">
                                  Conservative Growth
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Low-risk portfolio focused on capital
                                  preservation with modest growth.
                                </p>
                                <div className="mt-2 flex items-center">
                                  <Badge
                                    variant="outline"
                                    className="bg-green-100 text-green-800 mr-2"
                                  >
                                    Low Risk
                                  </Badge>
                                  <span className="text-sm">
                                    Target Return: 4-6%
                                  </span>
                                </div>
                              </>
                            )}
                            {riskTolerance === "medium" && (
                              <>
                                <h4 className="font-medium">Balanced Growth</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Balanced approach with moderate risk for
                                  long-term growth.
                                </p>
                                <div className="mt-2 flex items-center">
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-100 text-blue-800 mr-2"
                                  >
                                    Medium Risk
                                  </Badge>
                                  <span className="text-sm">
                                    Target Return: 6-8%
                                  </span>
                                </div>
                              </>
                            )}
                            {riskTolerance === "high" && (
                              <>
                                <h4 className="font-medium">
                                  Aggressive Growth
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Higher risk strategy focused on maximum
                                  long-term growth.
                                </p>
                                <div className="mt-2 flex items-center">
                                  <Badge
                                    variant="outline"
                                    className="bg-orange-100 text-orange-800 mr-2"
                                  >
                                    High Risk
                                  </Badge>
                                  <span className="text-sm">
                                    Target Return: 8-12%
                                  </span>
                                </div>
                              </>
                            )}
                            <Button className="w-full mt-4">
                              Start With This Plan
                            </Button>
                          </div>

                          <div className="text-sm">
                            <div className="flex items-start space-x-2 mb-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                              <p className="text-muted-foreground">
                                Personalized asset allocation based on your risk
                                profile
                              </p>
                            </div>
                            <div className="flex items-start space-x-2 mb-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                              <p className="text-muted-foreground">
                                Automatic rebalancing to maintain optimal
                                diversification
                              </p>
                            </div>
                            <div className="flex items-start space-x-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                              <p className="text-muted-foreground">
                                Low management fees and no hidden charges
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowQuestionnaire(true)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Take Full Risk Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              AI-Powered Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our advanced algorithms continuously analyze market conditions and
              adjust your portfolio for optimal performance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 text-blue-600" />
              Automatic Rebalancing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your portfolio is automatically rebalanced to maintain your target
              asset allocation and risk level.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Coins className="h-5 w-5 mr-2 text-blue-600" />
              Low Management Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Enjoy professional portfolio management with fees as low as 0.25%
              annually, with no hidden charges.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
