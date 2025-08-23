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
import { Search, Download, Calendar, RefreshCw } from "lucide-react";
import { fundamentalAnalysisService } from "@/lib/api/fundamentalAnalysisService";
import {
  FinancialStatement,
  FinancialLineItem,
} from "@/lib/types/fundamental-analysis-types";

export default function FinancialStatements() {
  const [searchTicker, setSearchTicker] = useState("");
  const [ticker, setTicker] = useState("AAPL");
  const [statementType, setStatementType] = useState("income");
  const [period, setPeriod] = useState("annual");
  const [statements, setStatements] = useState<FinancialStatement[]>([]);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<number[]>([]);
  const [quarters, setQuarters] = useState<number[]>([]);

  useEffect(() => {
    fetchStatements();
  }, [ticker, statementType, period]);

  const fetchStatements = async () => {
    setLoading(true);
    try {
      const data = await fundamentalAnalysisService.getFinancialStatements(
        ticker,
        statementType as "income" | "balance" | "cash-flow",
        period as "annual" | "quarterly"
      );

      setStatements(data);

      // Extract unique years and quarters
      if (period === "annual") {
        const uniqueYears = [...new Set(data.map((s) => s.year))].sort(
          (a, b) => b - a
        );
        setYears(uniqueYears);
      } else {
        const yearQuarters = data.map((s) => ({
          year: s.year,
          quarter: s.quarter,
        }));
        // Sort by year and quarter, most recent first
        yearQuarters.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return (b.quarter || 0) - (a.quarter || 0);
        });

        setYears([...new Set(yearQuarters.map((yq) => yq.year))]);
        setQuarters([...new Set(yearQuarters.map((yq) => yq.quarter || 0))]);
      }
    } catch (error) {
      console.error("Error fetching financial statements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTicker.trim()) {
      setTicker(searchTicker.toUpperCase());
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const renderGrowthIndicator = (growth: number | undefined) => {
    if (growth === undefined) return null;

    const color =
      growth > 0
        ? "text-green-500"
        : growth < 0
        ? "text-red-500"
        : "text-gray-500";
    return (
      <span className={`ml-2 text-xs ${color}`}>
        {formatPercentage(growth)}
      </span>
    );
  };

  const downloadCSV = () => {
    if (!statements.length) return;

    const header = [
      "Line Item",
      ...statements.map((s) =>
        period === "annual" ? `${s.year}` : `Q${s.quarter} ${s.year}`
      ),
    ];

    // Get all unique line items across all statements
    const allLineItems = statements
      .flatMap((s) => s.items)
      .filter(
        (item, index, self) =>
          index === self.findIndex((i) => i.name === item.name)
      )
      .sort((a, b) => a.order - b.order);

    const rows = allLineItems.map((item) => {
      const row = [item.name];
      statements.forEach((statement) => {
        const matchingItem = statement.items.find((i) => i.name === item.name);
        row.push(matchingItem ? matchingItem.value.toString() : "");
      });
      return row;
    });

    const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${ticker}_${statementType}_${period}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statementTypeOptions = [
    { value: "income", label: "Income Statement" },
    { value: "balance", label: "Balance Sheet" },
    { value: "cash-flow", label: "Cash Flow Statement" },
  ];

  const periodOptions = [
    { value: "annual", label: "Annual" },
    { value: "quarterly", label: "Quarterly" },
  ];

  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2">Loading financial data...</span>
        </div>
      );
    }

    if (!statements.length) {
      return (
        <div className="text-center p-8 text-gray-500">
          No financial data available for this ticker.
        </div>
      );
    }

    // Get all unique line items
    const allLineItems =
      statements[0]?.items.sort((a, b) => a.order - b.order) || [];

    return (
      <Table className="border">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-1/3">Line Item</TableHead>
            {statements.map((statement, i) => (
              <TableHead key={i} className="text-right">
                {period === "annual"
                  ? statement.year
                  : `Q${statement.quarter} ${statement.year}`}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {allLineItems.map((item, i) => (
            <TableRow
              key={i}
              className={
                item.isTotal
                  ? "font-bold bg-gray-50"
                  : item.isSubtotal
                  ? "font-semibold"
                  : ""
              }
            >
              <TableCell className={item.parentId ? "pl-8" : ""}>
                {item.name}
              </TableCell>
              {statements.map((statement, j) => {
                const statementItem = statement.items.find(
                  (si) => si.name === item.name
                );
                return (
                  <TableCell key={j} className="text-right">
                    {statementItem ? (
                      <>
                        {formatCurrency(statementItem.value)}
                        {j > 0 &&
                          renderGrowthIndicator(statementItem.growthYoY)}
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                );
              })}
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
          <CardTitle>Financial Statements Analysis</CardTitle>
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
              <Select value={statementType} onValueChange={setStatementType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statement Type" />
                </SelectTrigger>
                <SelectContent>
                  {statementTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[150px]">
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
                disabled={!statements.length}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">{renderTableContent()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
