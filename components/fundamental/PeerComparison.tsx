"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/custom-badge";
import {
  Search,
  Users,
  BarChart2,
  RefreshCw,
  Download,
  ArrowUpDown,
} from "lucide-react";
import { fundamentalAnalysisService } from "@/lib/api/fundamentalAnalysisService";
import { PeerComparisonItem } from "@/lib/types/fundamental-analysis-types";

export default function PeerComparison() {
  const [searchTicker, setSearchTicker] = useState("");
  const [ticker, setTicker] = useState("AAPL");
  const [peerData, setPeerData] = useState<PeerComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("marketCap");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [comparisonType, setComparisonType] = useState("valuation");

  useEffect(() => {
    fetchPeerData();
  }, [ticker, comparisonType]);

  const fetchPeerData = async () => {
    setLoading(true);
    try {
      const data = await fundamentalAnalysisService.getPeerComparison(ticker, [
        comparisonType,
      ]);
      setPeerData(data);
    } catch (error) {
      console.error("Error fetching peer comparison data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTicker.trim()) {
      setTicker(searchTicker.toUpperCase());
    }
  };

  const formatValue = (value: number, type: string) => {
    if (type === "percentage") {
      return `${value.toFixed(2)}%`;
    } else if (type === "multiple") {
      return value.toFixed(2) + "x";
    } else if (type === "currency") {
      if (Math.abs(value) >= 1e12) {
        return `$${(value / 1e12).toFixed(2)}T`;
      } else if (Math.abs(value) >= 1e9) {
        return `$${(value / 1e9).toFixed(2)}B`;
      } else if (Math.abs(value) >= 1e6) {
        return `$${(value / 1e6).toFixed(2)}M`;
      } else {
        return `$${value.toFixed(2)}`;
      }
    } else {
      return value.toFixed(2);
    }
  };

  const getValueClassName = (item: any, field: string) => {
    if (!peerData.length || !field.endsWith("Percentile")) return "";

    const value = item[field];
    if (value === undefined) return "";

    // Determine if higher percentile is better based on the metric
    const higherIsBetter = ![
      "debtToEquityPercentile",
      "peRatioPercentile",
    ].includes(field);

    if (value > 80) {
      return higherIsBetter
        ? "text-green-600 font-medium"
        : "text-red-600 font-medium";
    } else if (value > 60) {
      return higherIsBetter ? "text-green-500" : "text-red-500";
    } else if (value < 20) {
      return higherIsBetter
        ? "text-red-600 font-medium"
        : "text-green-600 font-medium";
    } else if (value < 40) {
      return higherIsBetter ? "text-red-500" : "text-green-500";
    }

    return "text-gray-500";
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedData = [...peerData].sort((a, b) => {
    // If the sort field is marketCap, use it directly
    if (sortField === "marketCap") {
      return sortDirection === "asc"
        ? a.marketCap - b.marketCap
        : b.marketCap - a.marketCap;
    }

    // For all other fields, they're in the metrics object
    const aValue = a.metrics[sortField] as number;
    const bValue = b.metrics[sortField] as number;

    if (aValue === undefined || bValue === undefined) return 0;

    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  const downloadCSV = () => {
    if (!peerData.length) return;

    // Define headers based on comparison type
    let headers: string[] = ["Company", "Ticker"];

    if (comparisonType === "valuation") {
      headers = [
        ...headers,
        "Market Cap",
        "P/E",
        "P/S",
        "P/B",
        "EV/EBITDA",
        "Dividend Yield",
      ];
    } else if (comparisonType === "growth") {
      headers = [
        ...headers,
        "Revenue Growth (YoY)",
        "EPS Growth (YoY)",
        "5Y Revenue CAGR",
        "5Y EPS CAGR",
      ];
    } else if (comparisonType === "profitability") {
      headers = [
        ...headers,
        "Gross Margin",
        "Operating Margin",
        "Net Margin",
        "ROE",
        "ROA",
      ];
    }

    // Create rows
    const rows = sortedData.map((item) => {
      const row = [item.companyName, item.ticker];

      if (comparisonType === "valuation") {
        row.push(
          item.marketCap.toString(),
          item.metrics.peRatio?.toString() || "",
          item.metrics.psRatio?.toString() || "",
          item.metrics.pbRatio?.toString() || "",
          item.metrics.evToEbitda?.toString() || "",
          item.metrics.dividendYield?.toString() || ""
        );
      } else if (comparisonType === "growth") {
        row.push(
          item.metrics.revenueGrowthYoY?.toString() || "",
          item.metrics.epsGrowthYoY?.toString() || "",
          item.metrics.fiveYearRevenueCAGR?.toString() || "",
          item.metrics.fiveYearEpsCAGR?.toString() || ""
        );
      } else if (comparisonType === "profitability") {
        row.push(
          item.metrics.grossMargin?.toString() || "",
          item.metrics.operatingMargin?.toString() || "",
          item.metrics.netMargin?.toString() || "",
          item.metrics.roe?.toString() || "",
          item.metrics.roa?.toString() || ""
        );
      }

      return row;
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${ticker}_peer_comparison_${comparisonType}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const comparisonTypeOptions = [
    { value: "valuation", label: "Valuation Metrics" },
    { value: "growth", label: "Growth Metrics" },
    { value: "profitability", label: "Profitability Metrics" },
  ];

  const renderSortIndicator = (field: string) => {
    if (sortField !== field)
      return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUpDown className="ml-1 h-4 w-4 rotate-180 transform" />
    ) : (
      <ArrowUpDown className="ml-1 h-4 w-4" />
    );
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2">Loading peer comparison data...</span>
        </div>
      );
    }

    if (!peerData.length) {
      return (
        <div className="text-center p-8 text-gray-500">
          No peer comparison data available for this ticker.
        </div>
      );
    }

    return (
      <Table className="border">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Ticker</TableHead>

            {comparisonType === "valuation" && (
              <>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("marketCap")}
                >
                  <div className="flex items-center justify-end">
                    Market Cap
                    {renderSortIndicator("marketCap")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("peRatio")}
                >
                  <div className="flex items-center justify-end">
                    P/E
                    {renderSortIndicator("peRatio")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("psRatio")}
                >
                  <div className="flex items-center justify-end">
                    P/S
                    {renderSortIndicator("psRatio")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("pbRatio")}
                >
                  <div className="flex items-center justify-end">
                    P/B
                    {renderSortIndicator("pbRatio")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("evToEbitda")}
                >
                  <div className="flex items-center justify-end">
                    EV/EBITDA
                    {renderSortIndicator("evToEbitda")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("dividendYield")}
                >
                  <div className="flex items-center justify-end">
                    Div Yield
                    {renderSortIndicator("dividendYield")}
                  </div>
                </TableHead>
              </>
            )}

            {comparisonType === "growth" && (
              <>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("revenueGrowthYoY")}
                >
                  <div className="flex items-center justify-end">
                    Rev Growth (YoY)
                    {renderSortIndicator("revenueGrowthYoY")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("epsGrowthYoY")}
                >
                  <div className="flex items-center justify-end">
                    EPS Growth (YoY)
                    {renderSortIndicator("epsGrowthYoY")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("fiveYearRevenueCAGR")}
                >
                  <div className="flex items-center justify-end">
                    5Y Rev CAGR
                    {renderSortIndicator("fiveYearRevenueCAGR")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("fiveYearEpsCAGR")}
                >
                  <div className="flex items-center justify-end">
                    5Y EPS CAGR
                    {renderSortIndicator("fiveYearEpsCAGR")}
                  </div>
                </TableHead>
              </>
            )}

            {comparisonType === "profitability" && (
              <>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("grossMargin")}
                >
                  <div className="flex items-center justify-end">
                    Gross Margin
                    {renderSortIndicator("grossMargin")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("operatingMargin")}
                >
                  <div className="flex items-center justify-end">
                    Op. Margin
                    {renderSortIndicator("operatingMargin")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("netMargin")}
                >
                  <div className="flex items-center justify-end">
                    Net Margin
                    {renderSortIndicator("netMargin")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("roe")}
                >
                  <div className="flex items-center justify-end">
                    ROE
                    {renderSortIndicator("roe")}
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("roa")}
                >
                  <div className="flex items-center justify-end">
                    ROA
                    {renderSortIndicator("roa")}
                  </div>
                </TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, i) => (
            <TableRow
              key={i}
              className={item.ticker === ticker ? "bg-blue-50" : ""}
            >
              <TableCell className="font-medium">
                {item.companyName}
                {item.ticker === ticker && (
                  <Badge variant="outline" className="ml-2 bg-blue-100">
                    Selected
                  </Badge>
                )}
              </TableCell>
              <TableCell>{item.ticker}</TableCell>

              {comparisonType === "valuation" && (
                <>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "marketCapPercentile"
                    )}`}
                  >
                    {formatValue(item.marketCap, "currency")}
                  </TableCell>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "peRatioPercentile"
                    )}`}
                  >
                    {formatValue(item.metrics.peRatio || 0, "multiple")}
                  </TableCell>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "psRatioPercentile"
                    )}`}
                  >
                    {formatValue(item.metrics.psRatio || 0, "multiple")}
                  </TableCell>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "pbRatioPercentile"
                    )}`}
                  >
                    {formatValue(item.metrics.pbRatio || 0, "multiple")}
                  </TableCell>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "evToEbitdaPercentile"
                    )}`}
                  >
                    {formatValue(item.metrics.evToEbitda || 0, "multiple")}
                  </TableCell>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "dividendYieldPercentile"
                    )}`}
                  >
                    {formatValue(item.metrics.dividendYield || 0, "percentage")}
                  </TableCell>
                </>
              )}

              {comparisonType === "growth" && (
                <>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "revenueGrowthYoYPercentile"
                    )}`}
                  >
                    {formatValue(
                      item.metrics.revenueGrowthYoY || 0,
                      "percentage"
                    )}
                  </TableCell>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "epsGrowthYoYPercentile"
                    )}`}
                  >
                    {formatValue(item.metrics.epsGrowthYoY || 0, "percentage")}
                  </TableCell>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "fiveYearRevenueCAGRPercentile"
                    )}`}
                  >
                    {formatValue(
                      item.metrics.fiveYearRevenueCAGR || 0,
                      "percentage"
                    )}
                  </TableCell>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "fiveYearEpsCAGRPercentile"
                    )}`}
                  >
                    {formatValue(
                      item.metrics.fiveYearEpsCAGR || 0,
                      "percentage"
                    )}
                  </TableCell>
                </>
              )}

              {comparisonType === "profitability" && (
                <>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "grossMarginPercentile"
                    )}`}
                  >
                    {formatValue(item.metrics.grossMargin || 0, "percentage")}
                  </TableCell>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "operatingMarginPercentile"
                    )}`}
                  >
                    {formatValue(
                      item.metrics.operatingMargin || 0,
                      "percentage"
                    )}
                  </TableCell>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "netMarginPercentile"
                    )}`}
                  >
                    {formatValue(item.metrics.netMargin || 0, "percentage")}
                  </TableCell>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "roePercentile"
                    )}`}
                  >
                    {formatValue(item.metrics.roe || 0, "percentage")}
                  </TableCell>
                  <TableCell
                    className={`text-right ${getValueClassName(
                      item,
                      "roaPercentile"
                    )}`}
                  >
                    {formatValue(item.metrics.roa || 0, "percentage")}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Peer Company Comparison</CardTitle>
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
              <Select value={comparisonType} onValueChange={setComparisonType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Comparison Type" />
                </SelectTrigger>
                <SelectContent>
                  {comparisonTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={downloadCSV}
                disabled={!peerData.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">{renderTableContent()}</div>

          {peerData.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md flex items-start">
              <Users className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Peer Analysis Insights:</p>
                <p className="mt-1">
                  {ticker} ranks{" "}
                  {sortedData.findIndex((item) => item.ticker === ticker) + 1}{" "}
                  out of {sortedData.length} peers in terms of{" "}
                  {sortField === "marketCap"
                    ? "market capitalization"
                    : sortField}
                  .
                  {comparisonType === "valuation" &&
                    (() => {
                      // Find the selected company in the data
                      const selectedCompany = sortedData.find(
                        (item) => item.ticker === ticker
                      );
                      if (!selectedCompany || !selectedCompany.metrics)
                        return "";

                      // Calculate average PE ratio
                      const avgPeRatio =
                        sortedData.reduce(
                          (sum, item) => sum + (item.metrics?.peRatio || 0),
                          0
                        ) / sortedData.length;

                      // Determine if below or above average
                      const isBelowAvg =
                        (selectedCompany.metrics.peRatio || 0) < avgPeRatio;

                      return ` The company's valuation metrics are ${
                        isBelowAvg ? "below" : "above"
                      } the peer group average, suggesting it may be ${
                        isBelowAvg ? "undervalued" : "overvalued"
                      } relative to its competitors.`;
                    })()}
                  {comparisonType === "growth" &&
                    (() => {
                      // Find the selected company in the data
                      const selectedCompany = sortedData.find(
                        (item) => item.ticker === ticker
                      );
                      if (!selectedCompany || !selectedCompany.metrics)
                        return "";

                      // Calculate average revenue growth
                      const avgRevenueGrowth =
                        sortedData.reduce(
                          (sum, item) =>
                            sum + (item.metrics?.revenueGrowthYoY || 0),
                          0
                        ) / sortedData.length;

                      // Determine if above or below average
                      const isAboveAvg =
                        (selectedCompany.metrics.revenueGrowthYoY || 0) >
                        avgRevenueGrowth;

                      return ` The company's growth metrics are ${
                        isAboveAvg ? "above" : "below"
                      } the peer group average, indicating ${
                        isAboveAvg ? "stronger" : "weaker"
                      } expansion compared to competitors.`;
                    })()}
                  {comparisonType === "profitability" &&
                    (() => {
                      // Find the selected company in the data
                      const selectedCompany = sortedData.find(
                        (item) => item.ticker === ticker
                      );
                      if (!selectedCompany || !selectedCompany.metrics)
                        return "";

                      // Calculate average net margin
                      const avgNetMargin =
                        sortedData.reduce(
                          (sum, item) => sum + (item.metrics?.netMargin || 0),
                          0
                        ) / sortedData.length;

                      // Determine if above or below average
                      const isAboveAvg =
                        (selectedCompany.metrics.netMargin || 0) > avgNetMargin;

                      return ` The company's profitability metrics are ${
                        isAboveAvg ? "above" : "below"
                      } the peer group average, suggesting ${
                        isAboveAvg ? "better" : "worse"
                      } operational efficiency than competitors.`;
                    })()}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
