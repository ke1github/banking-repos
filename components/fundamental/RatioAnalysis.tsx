"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, BarChart2, RefreshCw, Download, Zap } from "lucide-react";
import { fundamentalAnalysisService } from "@/lib/api/fundamentalAnalysisService";
import { FinancialRatio } from "@/lib/types/fundamental-analysis-types";

export default function RatioAnalysis({
  ticker = "AAPL",
}: {
  ticker?: string;
}) {
  const [searchTicker, setSearchTicker] = useState("");
  const [currentTicker, setCurrentTicker] = useState(ticker);
  const [period, setPeriod] = useState("ttm");
  const [category, setCategory] = useState("profitability");
  const [ratios, setRatios] = useState<FinancialRatio[]>([]);
  const [loading, setLoading] = useState(true);
  const [industryAverage, setIndustryAverage] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    fetchRatios();
  }, [currentTicker, period, category]);

  const fetchRatios = async () => {
    setLoading(true);
    try {
      const data = await fundamentalAnalysisService.getFinancialRatios(
        currentTicker,
        period as "annual" | "quarterly" | "ttm",
        5 // Default limit value
      );
      setRatios(data);

      // For now, we'll use a mock value for industry averages
      // In a real app, you would fetch these from a service
      setIndustryAverage({
        grossMargin: 0.33,
        operatingMargin: 0.18,
        netMargin: 0.12,
        returnOnAssets: 0.07,
        returnOnEquity: 0.14,
        returnOnInvestedCapital: 0.11,
        currentRatio: 1.5,
        quickRatio: 1.0,
        cashRatio: 0.4,
        debtToEquity: 0.6,
        debtToAssets: 0.35,
        interestCoverage: 10,
        assetTurnover: 0.8,
        inventoryTurnover: 10,
        receivablesTurnover: 12,
        payablesTurnover: 14,
        peRatio: 18,
        pbRatio: 2.5,
        evToEbitda: 12,
        evToSales: 3,
        priceToSalesTTM: 2.2,
        priceToFreeCashFlow: 15,
        dividendYield: 0.02,
        dividendPayoutRatio: 0.3,
        revenueGrowth: 0.1,
        earningsGrowth: 0.12,
        ebitdaGrowth: 0.11,
      });
    } catch (error) {
      console.error("Error fetching financial ratios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTicker.trim()) {
      setCurrentTicker(searchTicker.toUpperCase());
    }
  };

  // Format ratio values with appropriate units
  const formatRatioValue = (value: number, isPercentage = false) => {
    if (isPercentage) {
      return `${(value * 100).toFixed(2)}%`;
    }
    return value.toFixed(2);
  };

  // Get comparison indicator with industry average
  const getComparisonIndicator = (
    ratioKey: string,
    value: number,
    industryAvg: number | undefined
  ) => {
    if (!industryAvg) return null;

    const percentDiff = ((value - industryAvg) / industryAvg) * 100;
    const absPercentDiff = Math.abs(percentDiff);

    let color = "text-gray-500";

    // Determine if higher is better (for most ratios)
    const higherIsBetter = [
      "grossMargin",
      "operatingMargin",
      "netMargin",
      "returnOnAssets",
      "returnOnEquity",
      "returnOnInvestedCapital",
      "currentRatio",
      "quickRatio",
      "cashRatio",
      "interestCoverage",
      "assetTurnover",
      "inventoryTurnover",
      "dividendYield",
      "revenueGrowth",
      "earningsGrowth",
      "ebitdaGrowth",
    ].includes(ratioKey);

    // Determine if lower is better (for some ratios)
    const lowerIsBetter = [
      "debtToEquity",
      "debtToAssets",
      "peRatio",
      "evToEbitda",
    ].includes(ratioKey);

    // Neutral ratios don't have a clear better direction
    const isNeutral = !higherIsBetter && !lowerIsBetter;

    if (!isNeutral) {
      if (
        (higherIsBetter && percentDiff > 0) ||
        (lowerIsBetter && percentDiff < 0)
      ) {
        color = absPercentDiff > 20 ? "text-green-600" : "text-green-500";
      } else {
        color = absPercentDiff > 20 ? "text-red-600" : "text-red-500";
      }
    }

    return (
      <span className={`ml-2 text-xs ${color}`}>
        {percentDiff > 0 ? "+" : ""}
        {percentDiff.toFixed(1)}% vs industry
      </span>
    );
  };

  // Helper to get ratio keys by category
  const getRatioKeysByCategory = (): (keyof FinancialRatio)[] => {
    switch (category) {
      case "profitability":
        return [
          "grossMargin",
          "operatingMargin",
          "netMargin",
          "returnOnAssets",
          "returnOnEquity",
          "returnOnInvestedCapital",
        ];
      case "liquidity":
        return ["currentRatio", "quickRatio", "cashRatio"];
      case "solvency":
        return ["debtToEquity", "debtToAssets", "interestCoverage"];
      case "efficiency":
        return [
          "assetTurnover",
          "inventoryTurnover",
          "receivablesTurnover",
          "payablesTurnover",
        ];
      case "valuation":
        return [
          "peRatio",
          "pbRatio",
          "evToEbitda",
          "evToSales",
          "priceToSalesTTM",
          "priceToFreeCashFlow",
        ];
      case "dividend":
        return ["dividendYield", "dividendPayoutRatio"];
      case "growth":
        return ["revenueGrowth", "earningsGrowth", "ebitdaGrowth"];
      default:
        return ["grossMargin", "operatingMargin", "netMargin"];
    }
  };

  // Format ratio label for display
  const formatRatioLabel = (key: string): string => {
    // Convert camelCase to Title Case with Spaces
    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

    // Special case acronyms
    return label
      .replace(/P E Ratio/g, "P/E Ratio")
      .replace(/P B Ratio/g, "P/B Ratio")
      .replace(/Ev To Ebitda/g, "EV/EBITDA")
      .replace(/Ev To Sales/g, "EV/Sales")
      .replace(/Ttm/g, "TTM")
      .replace(/Roe/g, "ROE")
      .replace(/Roa/g, "ROA")
      .replace(/Roic/g, "ROIC");
  };

  // Check if data should be displayed as percentage
  const isPercentageRatio = (key: string): boolean => {
    return [
      "grossMargin",
      "operatingMargin",
      "netMargin",
      "returnOnAssets",
      "returnOnEquity",
      "returnOnInvestedCapital",
      "dividendYield",
      "dividendPayoutRatio",
      "revenueGrowth",
      "earningsGrowth",
      "ebitdaGrowth",
    ].includes(key);
  };

  const downloadCSV = () => {
    if (!ratios.length) return;

    const header = ["Ratio", "Value", "Industry Average", "Difference (%)"];
    const rows = [];

    // Get ratios based on selected category
    const ratioKeys = getRatioKeysByCategory();

    for (const key of ratioKeys) {
      const value = ratios[0]?.[key] as number | undefined;
      if (value === undefined) continue;

      const industryAvg = industryAverage[key as string];
      const diff = industryAvg
        ? ((value - industryAvg) / industryAvg) * 100
        : 0;

      rows.push([
        formatRatioLabel(key as string),
        value.toString(),
        industryAvg.toString(),
        diff.toFixed(2),
      ]);
    }

    const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${currentTicker}_${category}_ratios_${period}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const periodOptions = [
    { value: "ttm", label: "Trailing Twelve Months" },
    { value: "annual", label: "Annual" },
    { value: "quarterly", label: "Quarterly" },
  ];

  const categoryOptions = [
    { value: "profitability", label: "Profitability" },
    { value: "liquidity", label: "Liquidity" },
    { value: "solvency", label: "Solvency" },
    { value: "efficiency", label: "Efficiency" },
    { value: "valuation", label: "Valuation" },
    { value: "dividend", label: "Dividend" },
    { value: "growth", label: "Growth" },
  ];

  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2">Loading ratio data...</span>
        </div>
      );
    }

    if (!ratios.length) {
      return (
        <div className="text-center p-8 text-gray-500">
          No ratio data available for this ticker.
        </div>
      );
    }

    return (
      <Table className="border">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Ratio</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Industry Avg</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getRatioKeysByCategory().map((ratioKey) => {
            const value = ratios[0]?.[ratioKey] as number | undefined;
            if (value === undefined) return null;

            const industryAvg = industryAverage[ratioKey as string];

            return (
              <TableRow key={ratioKey as string}>
                <TableCell className="font-medium">
                  {formatRatioLabel(ratioKey as string)}
                </TableCell>
                <TableCell className="text-right">
                  {formatRatioValue(
                    value,
                    isPercentageRatio(ratioKey as string)
                  )}
                  {getComparisonIndicator(
                    ratioKey as string,
                    value,
                    industryAvg
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {industryAvg !== undefined
                    ? formatRatioValue(
                        industryAvg,
                        isPercentageRatio(ratioKey as string)
                      )
                    : "N/A"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Financial Ratio Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
            <div className="flex-1 flex space-x-2">
              <Input
                placeholder="Enter stock ticker (e.g., AAPL)"
                value={searchTicker}
                onChange={(e) => setSearchTicker(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex space-x-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ratio Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[230px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={downloadCSV}
                disabled={!ratios.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">{renderTableContent()}</div>

          {ratios.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md flex items-start">
              <Zap className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Key Insights:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {category === "profitability" && ratios[0] && (
                    <>
                      <li>
                        Profit margins{" "}
                        {ratios[0].netMargin > (industryAverage.netMargin || 0)
                          ? "exceed"
                          : "lag behind"}{" "}
                        industry averages, indicating{" "}
                        {ratios[0].netMargin > (industryAverage.netMargin || 0)
                          ? "strong"
                          : "challenged"}{" "}
                        operational efficiency.
                      </li>
                      <li>
                        Return metrics suggest{" "}
                        {ratios[0].returnOnEquity >
                        (industryAverage.returnOnEquity || 0)
                          ? "effective"
                          : "inefficient"}{" "}
                        use of capital compared to peers.
                      </li>
                    </>
                  )}
                  {category === "liquidity" && ratios[0] && (
                    <>
                      <li>
                        The company has{" "}
                        {ratios[0].currentRatio > 1.5
                          ? "healthy"
                          : "potential concerns with"}{" "}
                        short-term liquidity to cover immediate obligations.
                      </li>
                      <li>
                        Quick ratio indicates{" "}
                        {ratios[0].quickRatio > 1.0
                          ? "sufficient"
                          : "potentially insufficient"}{" "}
                        liquid assets available.
                      </li>
                    </>
                  )}
                  {category === "solvency" && ratios[0] && (
                    <>
                      <li>
                        Debt levels are{" "}
                        {ratios[0].debtToEquity <
                        (industryAverage.debtToEquity || 0)
                          ? "lower"
                          : "higher"}{" "}
                        than industry averages, suggesting{" "}
                        {ratios[0].debtToEquity <
                        (industryAverage.debtToEquity || 0)
                          ? "conservative"
                          : "aggressive"}{" "}
                        financial leverage.
                      </li>
                      <li>
                        Interest coverage ratio shows{" "}
                        {ratios[0].interestCoverage > 3
                          ? "comfortable"
                          : "potential strain in"}{" "}
                        ability to service debt obligations.
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
