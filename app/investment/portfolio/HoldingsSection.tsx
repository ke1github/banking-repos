"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { holdings } from "./data/mockData";

export const HoldingsSection = () => {
  const [holdingsFilter, setHoldingsFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter holdings based on search term and filter
  const filteredHoldings = holdings.filter((holding) => {
    const matchesSearch =
      searchTerm === "" ||
      holding.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      holdingsFilter === "all" ||
      (holdingsFilter === "gainers" && holding.gain > 0) ||
      (holdingsFilter === "losers" && holding.gain < 0) ||
      (holdingsFilter === "sector" && holding.sector === "Technology");

    return matchesSearch && matchesFilter;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <CardTitle>Your Holdings</CardTitle>
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search holdings..."
                className="w-full md:w-[200px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {holdingsFilter === "all"
                    ? "All Holdings"
                    : holdingsFilter === "gainers"
                    ? "Gainers"
                    : holdingsFilter === "losers"
                    ? "Losers"
                    : "By Sector"}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setHoldingsFilter("all")}>
                  All Holdings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHoldingsFilter("gainers")}>
                  Gainers
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHoldingsFilter("losers")}>
                  Losers
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setHoldingsFilter("sector")}>
                  Technology Sector
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export CSV</DropdownMenuItem>
                <DropdownMenuItem>Print</DropdownMenuItem>
                <DropdownMenuItem>View Cost Basis</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Rebalance Portfolio</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Symbol
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Name
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Shares
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Price
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Today
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Value
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Gain/Loss
                </th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHoldings.map((holding, i) => (
                <tr
                  key={i}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-bold text-blue-600">
                          {holding.symbol.split(".")[0]}
                        </span>
                      </div>
                      <span className="font-medium">{holding.symbol}</span>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div>
                      <div className="font-medium">{holding.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {holding.sector}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle text-right">
                    {holding.shares}
                  </td>
                  <td className="p-4 align-middle text-right">
                    ${holding.price.toFixed(2)}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div
                      className={`${
                        holding.todayChange >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {holding.todayChange >= 0 ? "+" : ""}
                      {holding.todayChange}%
                    </div>
                  </td>
                  <td className="p-4 align-middle text-right font-medium">
                    ${holding.value.toLocaleString()}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div
                      className={`${
                        holding.gain >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      <div>${holding.gain.toFixed(2)}</div>
                      <div className="text-xs">
                        {holding.gain >= 0 ? "+" : ""}
                        {holding.gainPercent.toFixed(2)}%
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle text-center">
                    <div className="flex justify-center space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <TrendingDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
