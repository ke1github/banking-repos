"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HeaderWithAvatar from "@/components/HeaderWithAvatar";
import { Slider } from "@/components/ui/slider";

export default function PlannerPage() {
  // State for retirement calculator
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [years, setYears] = useState(30);
  const [expectedReturn, setExpectedReturn] = useState(7);
  
  // Calculate future value (simple calculation for demo)
  const calculateFutureValue = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const months = years * 12;
    
    // Future value of initial investment
    const initialFV = initialInvestment * Math.pow(1 + monthlyRate, months);
    
    // Future value of monthly contributions
    const contributionFV = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    return Math.round(initialFV + contributionFV);
  };

  return (
    <div className="p-6 space-y-6">
      <HeaderWithAvatar
        title="Investment Planner"
        subtitle="Plan your financial future and set investment goals"
        avatarSrc="/icons/calculator.svg"
      />

      <Tabs defaultValue="retirement" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="retirement">Retirement</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="goals">Custom Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="retirement" className="mt-0">
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
                <div className="text-4xl font-bold">${calculateFutureValue().toLocaleString()}</div>
                <p className="text-sm text-muted-foreground text-center">
                  This is an estimate based on the provided inputs and assumes a constant rate of return.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="education" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Education Savings Calculator</h3>
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Education savings calculator would appear here</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="goals" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Custom Financial Goals</h3>
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Custom goals planner would appear here</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
