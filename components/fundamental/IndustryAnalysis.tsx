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
import {
  Search,
  TrendingUp,
  RefreshCw,
  Download,
  Globe,
  ArrowUpDown,
} from "lucide-react";
import { fundamentalAnalysisService } from "@/lib/api/fundamentalAnalysisService";
import { IndustryAnalysis as IndustryAnalysisType } from "@/lib/types/fundamental-analysis-types";

export default function IndustryAnalysis() {
  const [searchIndustry, setSearchIndustry] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [period, setPeriod] = useState("annual");
  const [year, setYear] = useState(new Date().getFullYear());
  const [industryData, setIndustryData] = useState<IndustryAnalysisType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("marketShare");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchIndustryData();
  }, [industry, period, year]);

  const fetchIndustryData = async () => {
    setLoading(true);
    try {
      // Convert industry name to a ticker-like format for the API
      const industryTicker = industry.replace(/\s+/g, "-").toUpperCase();

      const data = await fundamentalAnalysisService.getIndustryAnalysis(
        industryTicker,
        period as "annual" | "quarterly" | "ttm"
      );

      // If we need to filter by year, do it here
      if (data && data.year !== year) {
        // In a real app, we might fetch data for the specific year
        // For now, just update the year in the returned data
        data.year = year;
        data.reportDate = new Date(year, 0, 1); // January 1st of the selected year
      }

      setIndustryData(data);
    } catch (error) {
      console.error("Error fetching industry data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchIndustry.trim()) {
      setIndustry(searchIndustry);
    }
  };

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (Math.abs(value) >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (Math.abs(value) >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedCompanies =
    industryData?.topCompanies.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a] as number;
      const bValue = b[sortField as keyof typeof b] as number;

      if (aValue === undefined || bValue === undefined) return 0;

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }) || [];

  const downloadCSV = () => {
    if (!industryData) return;

    // Define headers
    const headers = [
      "Industry",
      "Market Size",
      "Growth Rate",
      "Avg Profit Margin",
      "Avg ROE",
      "Avg PE",
      "Concentration",
    ];

    // Create row
    const row = [
      industryData.industryName,
      industryData.totalMarketSize.toString(),
      industryData.growthRate.toString(),
      industryData.avgProfitMargin.toString(),
      industryData.avgROE.toString(),
      industryData.avgPE.toString(),
      industryData.concentration.toString(),
    ];

    // Create companies section
    const companyHeaders = ["Rank", "Company", "Market Share"];
    const companyRows = industryData.topCompanies.map((company) => [
      company.rank.toString(),
      company.companyName,
      company.marketShare.toString(),
    ]);

    // Create trends section
    const trendHeaders = ["Trend", "Description", "Impact", "Strength"];
    const trendRows = industryData.trends.map((trend) => [
      trend.name,
      trend.description,
      trend.impact,
      trend.strength.toString(),
    ]);

    // Combine all sections
    const csvContent = [
      headers.join(","),
      row.join(","),
      "",
      "Top Companies",
      companyHeaders.join(","),
      ...companyRows.map((r) => r.join(",")),
      "",
      "Industry Trends",
      trendHeaders.join(","),
      ...trendRows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${industry}_industry_analysis_${period}_${year}.csv`
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

  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: (new Date().getFullYear() - i).toString(),
    label: (new Date().getFullYear() - i).toString(),
  }));

  const renderSortIndicator = (field: string) => {
    if (sortField !== field)
      return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUpDown className="ml-1 h-4 w-4 rotate-180 transform" />
    ) : (
      <ArrowUpDown className="ml-1 h-4 w-4" />
    );
  };

  const renderIndustryContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2">Loading industry data...</span>
        </div>
      );
    }

    if (!industryData) {
      return (
        <div className="text-center p-8 text-gray-500">
          No industry data available.
        </div>
      );
    }

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Market Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(industryData.totalMarketSize)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Growth: {formatPercentage(industryData.growthRate)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Industry Averages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Profit Margin:</span>
                  <span className="font-medium">
                    {formatPercentage(industryData.avgProfitMargin)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">ROE:</span>
                  <span className="font-medium">
                    {formatPercentage(industryData.avgROE)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">P/E Ratio:</span>
                  <span className="font-medium">
                    {industryData.avgPE.toFixed(2)}x
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Market Concentration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {industryData.concentration.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {industryData.concentration < 1500
                  ? "Competitive Market"
                  : industryData.concentration < 2500
                  ? "Moderately Concentrated"
                  : "Highly Concentrated"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="leaders" className="mb-6">
          <TabsList>
            <TabsTrigger value="leaders">Market Leaders</TabsTrigger>
            <TabsTrigger value="trends">Industry Trends</TabsTrigger>
            <TabsTrigger value="swot">SWOT Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="leaders">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Top Companies in {industryData.industryName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="border">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead
                        className="cursor-pointer w-20"
                        onClick={() => handleSort("rank")}
                      >
                        <div className="flex items-center">
                          Rank
                          {renderSortIndicator("rank")}
                        </div>
                      </TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead
                        className="text-right cursor-pointer"
                        onClick={() => handleSort("marketShare")}
                      >
                        <div className="flex items-center justify-end">
                          Market Share
                          {renderSortIndicator("marketShare")}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedCompanies.map((company, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          #{company.rank}
                        </TableCell>
                        <TableCell>{company.companyName}</TableCell>
                        <TableCell className="text-right">
                          {formatPercentage(company.marketShare)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Key Industry Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="border">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Trend</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Impact</TableHead>
                      <TableHead className="text-right">Strength</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {industryData.trends.map((trend, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {trend.name}
                        </TableCell>
                        <TableCell>{trend.description}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              trend.impact === "positive"
                                ? "bg-green-100 text-green-800"
                                : trend.impact === "negative"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {trend.impact}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {trend.strength}/10
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="swot">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Industry SWOT Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 bg-green-50">
                    <h3 className="font-medium text-green-800 mb-2">
                      Strengths
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {industryData.swot.strengths.map((item, i) => (
                        <li key={i} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border rounded-md p-4 bg-red-50">
                    <h3 className="font-medium text-red-800 mb-2">
                      Weaknesses
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {industryData.swot.weaknesses.map((item, i) => (
                        <li key={i} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border rounded-md p-4 bg-blue-50">
                    <h3 className="font-medium text-blue-800 mb-2">
                      Opportunities
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {industryData.swot.opportunities.map((item, i) => (
                        <li key={i} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border rounded-md p-4 bg-amber-50">
                    <h3 className="font-medium text-amber-800 mb-2">Threats</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {industryData.swot.threats.map((item, i) => (
                        <li key={i} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button variant="outline" onClick={downloadCSV}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Industry Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
            <div className="flex-1 flex space-x-2">
              <Input
                placeholder="Enter industry name (e.g., Technology)"
                value={searchIndustry}
                onChange={(e) => setSearchIndustry(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex space-x-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
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

              <Select
                value={year.toString()}
                onValueChange={(value) => setYear(parseInt(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderIndustryContent()}
        </CardContent>
      </Card>
    </div>
  );
}
