"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Target } from "lucide-react";
import { CALCULATOR_TABS, CALCULATOR_COLORS } from "@/constants/calculators";

// Import Calculator Components
import {
  LoanCalculator,
  SIPCalculator,
  SavingsCalculator,
  FDCalculator,
  CreditCardCalculator,
  PPFCalculator,
  EligibilityCalculator,
  CompareCalculator,
} from "@/components/calculators";

const BankingCalculators = () => {
  const [activeTab, setActiveTab] = useState("loan");

  // Component mapping for dynamic rendering
  const componentMap = {
    loan: LoanCalculator,
    savings: SavingsCalculator,
    fd: FDCalculator,
    creditcard: CreditCardCalculator,
    sip: SIPCalculator,
    ppf: PPFCalculator,
    eligibility: EligibilityCalculator,
    compare: CompareCalculator,
  };

  const ActiveComponent = componentMap[activeTab as keyof typeof componentMap];

  return (
    <div className="p-4 md:p-6 space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Modern Header */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-20 translate-y-12 -translate-x-12"></div>

        <div className="relative flex items-center gap-6">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <Calculator className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
              Banking Calculators
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Comprehensive financial tools to help you plan loans, savings, and
              investments
            </p>

            {/* Stats Pills */}
            <div className="flex gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>8
                Calculators
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Real-time Results
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Tax Calculations
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Separator */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-gray-600">
              Choose Your Calculator
            </span>
          </div>
        </div>
      </div>

      {/* Calculator Tabs - Modern Card-based Design */}
      <div className="w-full">
        {/* Modern Tab Navigation */}
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {CALCULATOR_TABS.map((tab) => {
              const IconComponent = tab.icon;
              const colorClass =
                CALCULATOR_COLORS[tab.color as keyof typeof CALCULATOR_COLORS];
              const isActive = activeTab === tab.id;

              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full cursor-pointer"
                >
                  <div
                    className={`
                    relative overflow-hidden rounded-xl border-2 bg-white p-3 md:p-4 
                    transition-all duration-200
                    hover:border-blue-300 hover:shadow-lg hover:scale-105
                    ${
                      isActive
                        ? "border-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50"
                        : "border-gray-200"
                    }
                  `}
                  >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 opacity-5">
                      <IconComponent className="w-full h-full transform rotate-12" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                      <div
                        className={`
                        p-2 md:p-3 rounded-lg transition-all duration-200
                        ${colorClass}
                        hover:scale-110
                        ${isActive ? "scale-110" : ""}
                      `}
                      >
                        <IconComponent className="h-5 w-5 md:h-6 md:w-6" />
                      </div>

                      <div>
                        <h3
                          className={`font-semibold text-xs md:text-sm ${
                            isActive ? "text-blue-700" : "text-gray-900"
                          }`}
                        >
                          {tab.label}
                        </h3>
                        <p
                          className={`text-[10px] md:text-xs mt-1 line-clamp-2 hidden sm:block ${
                            isActive ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {tab.description.split(" ").slice(0, 4).join(" ")}...
                        </p>
                      </div>
                    </div>

                    {/* Active Indicator */}
                    <div
                      className={`
                      absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500
                      transition-transform duration-200
                      ${isActive ? "scale-x-100" : "scale-x-0"}
                    `}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calculator Components - Enhanced with Animation */}
        <div className="space-y-6">
          <div className="relative">
            {/* Subtle Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 rounded-2xl"></div>

            {/* Content */}
            <div className="relative z-10">
              <ActiveComponent />
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Features Overview - Modern Design */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Banking Calculator Features
              </h2>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Professional financial tools at your fingertips
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CALCULATOR_TABS.slice(0, 4).map((tab, index) => {
              const IconComponent = tab.icon;
              const colorClass =
                CALCULATOR_COLORS[tab.color as keyof typeof CALCULATOR_COLORS];

              return (
                <div
                  key={tab.id}
                  className="group relative p-6 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-white to-gray-50/50"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Background Pattern */}
                  <div className="absolute top-2 right-2 opacity-5">
                    <IconComponent className="h-12 w-12" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    <div
                      className={`
                      inline-flex p-3 rounded-xl mb-4 transition-transform duration-300
                      ${colorClass}
                      group-hover:scale-110
                    `}
                    >
                      <IconComponent className="h-8 w-8" />
                    </div>

                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                      {tab.label}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tab.description}
                    </p>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300"></div>
                </div>
              );
            })}
          </div>

          {/* Additional Features Badge */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                All calculators include advanced features, tax calculations, and
                professional insights
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankingCalculators;
