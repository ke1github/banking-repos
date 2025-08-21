"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Star,
  ExternalLink,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Commodity {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  openInterest: number;
  high52w: number;
  low52w: number;
  unit: string;
  exchange: string;
  category: string;
}

const mockCommodities: Commodity[] = [
  {
    id: "GOLD",
    name: "Gold",
    symbol: "GOLD",
    price: 62450,
    change: 230,
    changePercent: 0.37,
    volume: 125000,
    openInterest: 85000,
    high52w: 68500,
    low52w: 58200,
    unit: "10 Grams",
    exchange: "MCX",
    category: "Precious Metals",
  },
  {
    id: "SILVER",
    name: "Silver",
    symbol: "SILVER",
    price: 72850,
    change: -450,
    changePercent: -0.61,
    volume: 89000,
    openInterest: 156000,
    high52w: 85400,
    low52w: 68200,
    unit: "1 Kg",
    exchange: "MCX",
    category: "Precious Metals",
  },
  {
    id: "CRUDE_OIL",
    name: "Crude Oil",
    symbol: "CRUDEOIL",
    price: 6285,
    change: 125,
    changePercent: 2.03,
    volume: 245000,
    openInterest: 189000,
    high52w: 7150,
    low52w: 5850,
    unit: "1 BBL",
    exchange: "MCX",
    category: "Energy",
  },
  {
    id: "COPPER",
    name: "Copper",
    symbol: "COPPER",
    price: 825.5,
    change: -12.25,
    changePercent: -1.46,
    volume: 65000,
    openInterest: 125000,
    high52w: 895.8,
    low52w: 720.3,
    unit: "1 Kg",
    exchange: "MCX",
    category: "Base Metals",
  },
];

interface CommodityScreenerProps {
  searchQuery: string;
}

export default function CommodityScreener({
  searchQuery,
}: CommodityScreenerProps) {
  const [commodities] = useState<Commodity[]>(mockCommodities);
  const [filteredCommodities, setFilteredCommodities] =
    useState<Commodity[]>(mockCommodities);

  useEffect(() => {
    const filtered = commodities.filter(
      (commodity) =>
        commodity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commodity.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        commodity.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCommodities(filtered);
  }, [commodities, searchQuery]);

  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;
  const formatVolume = (volume: number) => {
    if (volume >= 100000) return `${(volume / 100000).toFixed(1)}L`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toLocaleString();
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {filteredCommodities.length} Commodities Found
        </h3>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commodity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Open Interest</TableHead>
                <TableHead>52W Range</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommodities.map((commodity) => (
                <TableRow key={commodity.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Target className="h-8 w-8 text-yellow-600" />
                      <div>
                        <div className="font-medium">{commodity.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {commodity.exchange}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {commodity.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(commodity.price)}
                  </TableCell>
                  <TableCell>
                    {formatChange(commodity.change, commodity.changePercent)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatVolume(commodity.volume)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatVolume(commodity.openInterest)}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>
                      <div className="text-green-600">
                        H: {formatPrice(commodity.high52w)}
                      </div>
                      <div className="text-red-600">
                        L: {formatPrice(commodity.low52w)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{commodity.unit}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
