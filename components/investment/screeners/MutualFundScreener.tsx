"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Filter,
  BarChart3,
  Star,
  ExternalLink,
  ArrowUpDown,
  Download,
  RefreshCw,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MutualFund {
  id: string;
  name: string;
  scheme: string;
  category: string;
  subCategory: string;
  nav: number;
  change: number;
  changePercent: number;
  returns1Y: number;
  returns3Y: number;
  returns5Y: number;
  expenseRatio: number;
  aum: number; // in crores
  rating: number; // 1-5 stars
  riskLevel: "Low" | "Moderate" | "High";
  minInvestment: number;
  exitLoad: number;
  fundManager: string;
  fundHouse: string;
  launchDate: string;
  isFavorite?: boolean;
}

interface MutualFundScreenerProps {
  searchQuery: string;
}

// Mock Indian mutual fund data
const mockMutualFunds: MutualFund[] = [
  {
    id: "AXIS_BLUECHIP",
    name: "Axis Bluechip Fund",
    scheme: "Direct Growth",
    category: "Equity",
    subCategory: "Large Cap",
    nav: 45.67,
    change: 0.23,
    changePercent: 0.51,
    returns1Y: 12.5,
    returns3Y: 15.8,
    returns5Y: 13.2,
    expenseRatio: 0.45,
    aum: 28450,
    rating: 4,
    riskLevel: "Moderate",
    minInvestment: 1000,
    exitLoad: 1.0,
    fundManager: "Shreyash Devalkar",
    fundHouse: "Axis Mutual Fund",
    launchDate: "2009-12-30",
  },
  {
    id: "SBI_LARGE_CAP",
    name: "SBI Large Cap Fund",
    scheme: "Direct Growth",
    category: "Equity",
    subCategory: "Large Cap",
    nav: 62.34,
    change: 0.45,
    changePercent: 0.73,
    returns1Y: 11.8,
    returns3Y: 14.6,
    returns5Y: 12.9,
    expenseRatio: 0.52,
    aum: 34580,
    rating: 4,
    riskLevel: "Moderate",
    minInvestment: 1000,
    exitLoad: 1.0,
    fundManager: "R. Srinivasan",
    fundHouse: "SBI Mutual Fund",
    launchDate: "2006-03-15",
  },
  {
    id: "HDFC_TOP_100",
    name: "HDFC Top 100 Fund",
    scheme: "Direct Growth",
    category: "Equity",
    subCategory: "Large Cap",
    nav: 78.92,
    change: -0.12,
    changePercent: -0.15,
    returns1Y: 13.2,
    returns3Y: 16.1,
    returns5Y: 14.5,
    expenseRatio: 0.38,
    aum: 45680,
    rating: 5,
    riskLevel: "Moderate",
    minInvestment: 1000,
    exitLoad: 1.0,
    fundManager: "Prashant Jain",
    fundHouse: "HDFC Mutual Fund",
    launchDate: "1996-09-30",
  },
  {
    id: "ICICI_SMALL_CAP",
    name: "ICICI Prudential Smallcap Fund",
    scheme: "Direct Growth",
    category: "Equity",
    subCategory: "Small Cap",
    nav: 89.45,
    change: 2.35,
    changePercent: 2.7,
    returns1Y: 18.5,
    returns3Y: 22.8,
    returns5Y: 19.2,
    expenseRatio: 0.68,
    aum: 15680,
    rating: 4,
    riskLevel: "High",
    minInvestment: 5000,
    exitLoad: 1.0,
    fundManager: "Ankit Agarwal",
    fundHouse: "ICICI Prudential",
    launchDate: "2007-10-01",
  },
  {
    id: "KOTAK_GILT",
    name: "Kotak Gilt Fund",
    scheme: "Direct Growth",
    category: "Debt",
    subCategory: "Gilt",
    nav: 32.18,
    change: 0.05,
    changePercent: 0.16,
    returns1Y: 7.2,
    returns3Y: 8.5,
    returns5Y: 7.8,
    expenseRatio: 0.25,
    aum: 8450,
    rating: 3,
    riskLevel: "Low",
    minInvestment: 1000,
    exitLoad: 0.0,
    fundManager: "Lakshmi Iyer",
    fundHouse: "Kotak Mutual Fund",
    launchDate: "2000-08-01",
  },
  {
    id: "UTI_NIFTY",
    name: "UTI Nifty Index Fund",
    scheme: "Direct Growth",
    category: "Equity",
    subCategory: "Index",
    nav: 156.78,
    change: 1.85,
    changePercent: 1.2,
    returns1Y: 14.5,
    returns3Y: 16.8,
    returns5Y: 15.2,
    expenseRatio: 0.1,
    aum: 12680,
    rating: 4,
    riskLevel: "Moderate",
    minInvestment: 1000,
    exitLoad: 0.0,
    fundManager: "Sharwan Kumar Goyal",
    fundHouse: "UTI Mutual Fund",
    launchDate: "2002-12-31",
  },
];

const categories = ["All", "Equity", "Debt", "Hybrid", "Index", "ELSS"];
const subCategories = [
  "All",
  "Large Cap",
  "Mid Cap",
  "Small Cap",
  "Multi Cap",
  "Gilt",
  "Corporate Bond",
  "Index",
];
const riskLevels = ["All", "Low", "Moderate", "High"];
const fundHouses = [
  "All",
  "HDFC",
  "SBI",
  "Axis",
  "ICICI Prudential",
  "Kotak",
  "UTI",
  "Aditya Birla",
];

export default function MutualFundScreener({
  searchQuery,
}: MutualFundScreenerProps) {
  const [funds, setFunds] = useState<MutualFund[]>(mockMutualFunds);
  const [filteredFunds, setFilteredFunds] =
    useState<MutualFund[]>(mockMutualFunds);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MutualFund;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter states
  const [filters, setFilters] = useState({
    category: "All",
    subCategory: "All",
    riskLevel: "All",
    fundHouse: "All",
    navRange: [0, 200] as [number, number],
    returns1YRange: [-10, 30] as [number, number],
    returns3YRange: [-5, 25] as [number, number],
    expenseRatioRange: [0, 2] as [number, number],
    aumRange: [0, 50000] as [number, number], // in crores
    minRating: 1,
    maxExpenseRatio: 2,
    minAUM: 0,
  });

  // Apply filters and search
  useEffect(() => {
    const filtered = funds.filter((fund) => {
      // Search filter
      if (
        searchQuery &&
        !fund.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !fund.scheme.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !fund.fundHouse.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (filters.category !== "All" && fund.category !== filters.category) {
        return false;
      }

      // Sub Category filter
      if (
        filters.subCategory !== "All" &&
        fund.subCategory !== filters.subCategory
      ) {
        return false;
      }

      // Risk Level filter
      if (filters.riskLevel !== "All" && fund.riskLevel !== filters.riskLevel) {
        return false;
      }

      // Fund House filter
      if (
        filters.fundHouse !== "All" &&
        !fund.fundHouse.includes(filters.fundHouse)
      ) {
        return false;
      }

      // NAV range
      if (fund.nav < filters.navRange[0] || fund.nav > filters.navRange[1]) {
        return false;
      }

      // 1Y Returns range
      if (
        fund.returns1Y < filters.returns1YRange[0] ||
        fund.returns1Y > filters.returns1YRange[1]
      ) {
        return false;
      }

      // 3Y Returns range
      if (
        fund.returns3Y < filters.returns3YRange[0] ||
        fund.returns3Y > filters.returns3YRange[1]
      ) {
        return false;
      }

      // Expense Ratio range
      if (
        fund.expenseRatio < filters.expenseRatioRange[0] ||
        fund.expenseRatio > filters.expenseRatioRange[1]
      ) {
        return false;
      }

      // AUM range
      if (fund.aum < filters.aumRange[0] || fund.aum > filters.aumRange[1]) {
        return false;
      }

      // Minimum rating
      if (fund.rating < filters.minRating) {
        return false;
      }

      return true;
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue == null || bValue == null) return 0;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    setFilteredFunds(filtered);
  }, [funds, searchQuery, filters, sortConfig]);

  const handleSort = (key: keyof MutualFund) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: "All",
      subCategory: "All",
      riskLevel: "All",
      fundHouse: "All",
      navRange: [0, 200],
      returns1YRange: [-10, 30],
      returns3YRange: [-5, 25],
      expenseRatioRange: [0, 2],
      aumRange: [0, 50000],
      minRating: 1,
      maxExpenseRatio: 2,
      minAUM: 0,
    });
  };

  const refreshData = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const formatNAV = (nav: number) => `₹${nav.toFixed(2)}`;
  const formatAUM = (aum: number) => `₹${aum.toLocaleString()} Cr`;
  const formatReturns = (returns: number) => `${returns.toFixed(1)}%`;

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    const color = isPositive ? "text-green-600" : "text-red-600";
    const icon = isPositive ? TrendingUp : TrendingDown;
    const Icon = icon;

    return (
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon className="h-3 w-3" />
        <span className="text-sm">
          {isPositive ? "+" : ""}
          {changePercent.toFixed(2)}%
        </span>
      </div>
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Moderate":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw
                  className={cn("h-4 w-4 mr-2", loading && "animate-spin")}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub Category Filter */}
            <div className="space-y-2">
              <Label>Sub Category</Label>
              <Select
                value={filters.subCategory}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, subCategory: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((subCategory) => (
                    <SelectItem key={subCategory} value={subCategory}>
                      {subCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Risk Level Filter */}
            <div className="space-y-2">
              <Label>Risk Level</Label>
              <Select
                value={filters.riskLevel}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, riskLevel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {riskLevels.map((risk) => (
                    <SelectItem key={risk} value={risk}>
                      {risk}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fund House Filter */}
            <div className="space-y-2">
              <Label>Fund House</Label>
              <Select
                value={filters.fundHouse}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, fundHouse: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fundHouses.map((house) => (
                    <SelectItem key={house} value={house}>
                      {house}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* NAV Range */}
            <div className="space-y-3">
              <Label>
                NAV Range (₹{filters.navRange[0]} - ₹{filters.navRange[1]})
              </Label>
              <Slider
                value={filters.navRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    navRange: value as [number, number],
                  }))
                }
                max={200}
                step={5}
                className="w-full"
              />
            </div>

            {/* 1Y Returns Range */}
            <div className="space-y-3">
              <Label>
                1Y Returns ({filters.returns1YRange[0]}% -{" "}
                {filters.returns1YRange[1]}%)
              </Label>
              <Slider
                value={filters.returns1YRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    returns1YRange: value as [number, number],
                  }))
                }
                min={-10}
                max={30}
                step={1}
                className="w-full"
              />
            </div>

            {/* 3Y Returns Range */}
            <div className="space-y-3">
              <Label>
                3Y Returns ({filters.returns3YRange[0]}% -{" "}
                {filters.returns3YRange[1]}%)
              </Label>
              <Slider
                value={filters.returns3YRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    returns3YRange: value as [number, number],
                  }))
                }
                min={-5}
                max={25}
                step={1}
                className="w-full"
              />
            </div>

            {/* Expense Ratio Range */}
            <div className="space-y-3">
              <Label>
                Expense Ratio ({filters.expenseRatioRange[0]}% -{" "}
                {filters.expenseRatioRange[1]}%)
              </Label>
              <Slider
                value={filters.expenseRatioRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    expenseRatioRange: value as [number, number],
                  }))
                }
                max={2}
                step={0.05}
                className="w-full"
              />
            </div>

            {/* AUM Range */}
            <div className="space-y-3">
              <Label>
                AUM (₹{filters.aumRange[0]} Cr - ₹{filters.aumRange[1]} Cr)
              </Label>
              <Slider
                value={filters.aumRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    aumRange: value as [number, number],
                  }))
                }
                max={50000}
                step={1000}
                className="w-full"
              />
            </div>

            {/* Minimum Rating */}
            <div className="space-y-3">
              <Label>Minimum Rating ({filters.minRating} stars)</Label>
              <Slider
                value={[filters.minRating]}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    minRating: value[0],
                  }))
                }
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            {filteredFunds.length} Fund{filteredFunds.length !== 1 ? "s" : ""}{" "}
            Found
          </h3>
          {searchQuery && (
            <Badge variant="secondary">Searching: "{searchQuery}"</Badge>
          )}
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Funds Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 font-semibold"
                    >
                      Fund Name <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("nav")}
                      className="h-auto p-0 font-semibold"
                    >
                      NAV <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("changePercent")}
                      className="h-auto p-0 font-semibold"
                    >
                      1D Change <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("returns1Y")}
                      className="h-auto p-0 font-semibold"
                    >
                      1Y Returns <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("returns3Y")}
                      className="h-auto p-0 font-semibold"
                    >
                      3Y Returns <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("expenseRatio")}
                      className="h-auto p-0 font-semibold"
                    >
                      Expense <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("aum")}
                      className="h-auto p-0 font-semibold"
                    >
                      AUM <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFunds.map((fund) => (
                  <TableRow key={fund.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {fund.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {fund.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {fund.subCategory}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {fund.fundHouse} • {fund.scheme}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatNAV(fund.nav)}
                    </TableCell>
                    <TableCell>
                      {formatChange(fund.change, fund.changePercent)}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span
                        className={
                          fund.returns1Y >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {formatReturns(fund.returns1Y)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      <span
                        className={
                          fund.returns3Y >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {formatReturns(fund.returns3Y)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {fund.expenseRatio.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatAUM(fund.aum)}
                    </TableCell>
                    <TableCell>{renderStars(fund.rating)}</TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(fund.riskLevel)}>
                        {fund.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Target className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredFunds.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No mutual funds found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search criteria
            </p>
            <Button onClick={resetFilters}>Reset Filters</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
