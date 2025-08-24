"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import TabList from "@/components/ui/TabList";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  GraduationCap,
  Target,
  BarChart,
  LineChart,
  ArrowUpDown,
  PieChart,
  Calendar,
} from "lucide-react";

export default function PlannerPage() {
  // State for retirement calculator
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [years, setYears] = useState(30);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [activeTab, setActiveTab] = useState("retirement");

  // Calculate future value (simple calculation for demo)
  const calculateFutureValue = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const months = years * 12;

    // Future value of initial investment
    const initialFV = initialInvestment * Math.pow(1 + monthlyRate, months);

    // Future value of monthly contributions
    const contributionFV =
      monthlyContribution *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    return Math.round(initialFV + contributionFV);
  };

  const RetirementCalculator = () => (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Retirement Calculator</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="initial-investment">Initial Investment</Label>
            <Input
              id="initial-investment"
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly-contribution">Monthly Contribution</Label>
            <Input
              id="monthly-contribution"
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years">Years to Retirement</Label>
            <div className="flex items-center space-x-4">
              <Slider
                id="years"
                min={1}
                max={50}
                step={1}
                value={[years]}
                onValueChange={(value) => setYears(value[0])}
                className="flex-1"
              />
              <span className="w-12 text-center">{years}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected-return">Expected Annual Return (%)</Label>
            <div className="flex items-center space-x-4">
              <Slider
                id="expected-return"
                min={1}
                max={15}
                step={0.5}
                value={[expectedReturn]}
                onValueChange={(value) => setExpectedReturn(value[0])}
                className="flex-1"
              />
              <span className="w-12 text-center">{expectedReturn}%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 border rounded-lg p-6">
          <h4 className="text-lg font-medium">Estimated Future Value</h4>
          <div className="text-4xl font-bold">
            ${calculateFutureValue().toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            This is an estimate based on the provided inputs and assumes a
            constant rate of return.
          </p>
        </div>
      </div>
    </div>
  );

  const plannerTabs = [
    {
      value: "retirement",
      label: "Retirement",
      icon: <Briefcase className="h-4 w-4 mr-2" />,
      content: <RetirementCalculator />,
    },
    {
      value: "education",
      label: "Education",
      icon: <GraduationCap className="h-4 w-4 mr-2" />,
      content: (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">
            Education Savings Calculator
          </h3>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">
              Education savings calculator would appear here
            </p>
          </div>
        </div>
      ),
    },
    {
      value: "goals",
      label: "Custom Goals",
      icon: <Target className="h-4 w-4 mr-2" />,
      content: (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Custom Financial Goals</h3>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">
              Custom goals planner would appear here
            </p>
          </div>
        </div>
      ),
    },
    {
      value: "asset-allocation",
      label: "Asset Allocation",
      icon: <PieChart className="h-4 w-4 mr-2" />,
      content: (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">
            Asset Allocation Planner
          </h3>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">
              Asset allocation planning tool would appear here
            </p>
          </div>
        </div>
      ),
    },
    {
      value: "tax-planning",
      label: "Tax Planning",
      icon: <BarChart className="h-4 w-4 mr-2" />,
      content: (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Tax Planning</h3>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">
              Tax optimization tools would appear here
            </p>
          </div>
        </div>
      ),
    },
    {
      value: "scenario-planning",
      label: "Scenario Planning",
      icon: <LineChart className="h-4 w-4 mr-2" />,
      content: (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">
            Financial Scenario Planning
          </h3>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">
              Financial scenario modeling tool would appear here
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">
          Investment Planner
        </h1>
        <p className="text-muted-foreground">
          Plan your financial future and set investment goals
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Financial Planning Tools</CardTitle>
            <Badge variant="outline" className="text-xs font-normal py-0 h-5">
              Personalized
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <TabList
            items={plannerTabs}
            defaultValue="retirement"
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
