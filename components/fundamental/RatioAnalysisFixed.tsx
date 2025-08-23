"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fundamentalAnalysisService } from "@/lib/api/fundamentalAnalysisService";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import { FinancialRatio } from "@/lib/types/fundamental-analysis-types";

export default function RatioAnalysisFixed({ ticker }: { ticker: string }) {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("annual");
  const [category, setCategory] = useState("profitability");
  const [ratios, setRatios] = useState<FinancialRatio[]>([]);
  const [industryAverage, setIndustryAverage] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    fetchRatios();
  }, [ticker, period, category]);

  const fetchRatios = async () => {
    setLoading(true);
    try {
      const data = await fundamentalAnalysisService.getFinancialRatios(
        ticker,
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

  // Format ratio values with appropriate units
  const formatRatioValue = (value: number, isPercentage = false) => {
    if (isPercentage) {
      return `${(value * 100).toFixed(2)}%`;
    }
    return value.toFixed(2);
  };

  // Get comparison indicator with industry average
  const getComparisonIndicator = (
    ratio: keyof FinancialRatio,
    industryAvg: number | undefined
  ) => {
    if (!industryAvg) return null;

    // Get the actual value from the first ratio object (most recent)
    const value = ratios[0]?.[ratio] as number | undefined;
    if (value === undefined) return null;

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
    ].includes(ratio as string);

    // Determine if lower is better (for some ratios)
    const lowerIsBetter = [
      "debtToEquity",
      "debtToAssets",
      "peRatio",
      "evToEbitda",
    ].includes(ratio as string);

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

  const downloadCSV = () => {
    if (!ratios.length) return;

    const header = ["Ratio", "Value", "Industry Average", "Difference (%)"];
    const rows = [];

    // Get ratios based on selected category
    const ratioKeys = getRatioKeysByCategory();

    for (const key of ratioKeys) {
      const value = ratios[0]?.[key] as number | undefined;
      if (value === undefined) continue;

      const industryAvg = industryAverage[key] || 0;
      const diff = industryAvg
        ? ((value - industryAvg) / industryAvg) * 100
        : 0;

      rows.push([
        formatRatioLabel(key),
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
    link.setAttribute("download", `${ticker}_${category}_ratios_${period}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      .replace(/Ttm/g, "TTM");
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Ratios</CardTitle>
          <CardDescription>
            Analyze financial ratios to assess the company's performance.
          </CardDescription>
          <div className="flex flex-wrap gap-4 pt-4">
            <div className="w-40">
              <Select
                value={period}
                onValueChange={(value) => setPeriod(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="ttm">TTM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Select
                value={category}
                onValueChange={(value) => setCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profitability">Profitability</SelectItem>
                  <SelectItem value="liquidity">Liquidity</SelectItem>
                  <SelectItem value="solvency">Solvency</SelectItem>
                  <SelectItem value="efficiency">Efficiency</SelectItem>
                  <SelectItem value="valuation">Valuation</SelectItem>
                  <SelectItem value="dividend">Dividend</SelectItem>
                  <SelectItem value="growth">Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className="ml-auto"
              onClick={downloadCSV}
              disabled={loading || !ratios.length}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">Loading...</div>
          ) : !ratios.length ? (
            <div className="py-8 text-center">No data available</div>
          ) : (
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ratio</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Industry Average</TableHead>
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
                        <TableCell>
                          {formatRatioValue(
                            value,
                            isPercentageRatio(ratioKey as string)
                          )}
                          {getComparisonIndicator(ratioKey, industryAvg)}
                        </TableCell>
                        <TableCell>
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

              <div className="mt-8 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h4 className="mb-2 font-semibold">Analysis Overview</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {category === "profitability" && (
                    <>
                      {ratios[0]?.netMargin !== undefined && (
                        <>
                          This company has a net profit margin of{" "}
                          {formatRatioValue(ratios[0].netMargin, true)}, which
                          is{" "}
                          {ratios[0].netMargin >
                          (industryAverage.netMargin || 0)
                            ? "above"
                            : "below"}{" "}
                          the industry average of{" "}
                          {formatRatioValue(
                            industryAverage.netMargin || 0,
                            true
                          )}
                          . The return on equity is{" "}
                          {formatRatioValue(
                            ratios[0].returnOnEquity || 0,
                            true
                          )}
                          , indicating how efficiently the company generates
                          profit from shareholders' equity.
                        </>
                      )}
                    </>
                  )}

                  {category === "liquidity" && (
                    <>
                      {ratios[0]?.currentRatio !== undefined && (
                        <>
                          With a current ratio of{" "}
                          {formatRatioValue(ratios[0].currentRatio)}, the
                          company's ability to pay short-term obligations is{" "}
                          {ratios[0].currentRatio > 1.5
                            ? "strong"
                            : ratios[0].currentRatio > 1.0
                            ? "adequate"
                            : "concerning"}
                          . The quick ratio of{" "}
                          {formatRatioValue(ratios[0].quickRatio || 0)} suggests{" "}
                          {ratios[0].quickRatio > 1.0 ? "good" : "limited"}{" "}
                          ability to cover short-term liabilities with liquid
                          assets.
                        </>
                      )}
                    </>
                  )}

                  {category === "solvency" && (
                    <>
                      {ratios[0]?.debtToEquity !== undefined && (
                        <>
                          The debt-to-equity ratio of{" "}
                          {formatRatioValue(ratios[0].debtToEquity)} is{" "}
                          {ratios[0].debtToEquity <
                          (industryAverage.debtToEquity || 0)
                            ? "lower"
                            : "higher"}{" "}
                          than the industry average, indicating{" "}
                          {ratios[0].debtToEquity <
                          (industryAverage.debtToEquity || 0)
                            ? "lower"
                            : "higher"}{" "}
                          financial leverage. The interest coverage ratio of{" "}
                          {formatRatioValue(ratios[0].interestCoverage || 0)}{" "}
                          shows the company can cover its interest expenses{" "}
                          {ratios[0].interestCoverage > 3
                            ? "comfortably"
                            : "with some difficulty"}
                          .
                        </>
                      )}
                    </>
                  )}

                  {category === "valuation" && (
                    <>
                      {ratios[0]?.peRatio !== undefined && (
                        <>
                          With a P/E ratio of{" "}
                          {formatRatioValue(ratios[0].peRatio)}, the stock is
                          trading at{" "}
                          {ratios[0].peRatio > (industryAverage.peRatio || 0)
                            ? "a premium"
                            : "a discount"}{" "}
                          to the industry average of{" "}
                          {formatRatioValue(industryAverage.peRatio || 0)}. The
                          EV/EBITDA of{" "}
                          {formatRatioValue(ratios[0].evToEbitda || 0)} provides
                          additional insight into the company's valuation
                          relative to earnings.
                        </>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
