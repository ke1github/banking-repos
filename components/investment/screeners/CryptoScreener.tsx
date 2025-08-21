"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
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
  Coins,
  Star,
  ExternalLink,
  ArrowUpDown,
  Download,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crypto {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  rank: number;
  high24h: number;
  low24h: number;
  ath: number;
  athChangePercent: number;
  circulatingSupply: number;
  totalSupply: number;
  isFavorite?: boolean;
}

interface CryptoScreenerProps {
  searchQuery: string;
}

// Mock crypto data with Indian pricing
const mockCryptos: Crypto[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 4350000,
    change24h: 125000,
    changePercent24h: 2.95,
    volume24h: 2540000000,
    marketCap: 85670000000000,
    rank: 1,
    high24h: 4390000,
    low24h: 4180000,
    ath: 5680000,
    athChangePercent: -23.4,
    circulatingSupply: 19687000,
    totalSupply: 21000000,
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 285000,
    change24h: -8500,
    changePercent24h: -2.89,
    volume24h: 1850000000,
    marketCap: 34250000000000,
    rank: 2,
    high24h: 295000,
    low24h: 280000,
    ath: 375000,
    athChangePercent: -24.0,
    circulatingSupply: 120280000,
    totalSupply: 120280000,
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    price: 45.5,
    change24h: 1.25,
    changePercent24h: 2.82,
    volume24h: 485000000,
    marketCap: 1625000000000,
    rank: 8,
    high24h: 46.2,
    low24h: 43.8,
    ath: 248.5,
    athChangePercent: -81.7,
    circulatingSupply: 35700000000,
    totalSupply: 45000000000,
  },
  {
    id: "binancecoin",
    symbol: "BNB",
    name: "BNB",
    price: 48500,
    change24h: 850,
    changePercent24h: 1.78,
    volume24h: 945000000,
    marketCap: 7425000000000,
    rank: 4,
    high24h: 49200,
    low24h: 47800,
    ath: 56800,
    athChangePercent: -14.6,
    circulatingSupply: 153000000,
    totalSupply: 153000000,
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: 19850,
    change24h: 485,
    changePercent24h: 2.5,
    volume24h: 1250000000,
    marketCap: 9150000000000,
    rank: 5,
    high24h: 20100,
    low24h: 19200,
    ath: 21850,
    athChangePercent: -9.2,
    circulatingSupply: 460850000,
    totalSupply: 571850000,
  },
  {
    id: "polygon",
    symbol: "MATIC",
    name: "Polygon",
    price: 74.25,
    change24h: -2.15,
    changePercent24h: -2.81,
    volume24h: 385000000,
    marketCap: 735000000000,
    rank: 12,
    high24h: 76.8,
    low24h: 72.5,
    ath: 234.5,
    athChangePercent: -68.3,
    circulatingSupply: 9900000000,
    totalSupply: 10000000000,
  },
];

export default function CryptoScreener({ searchQuery }: CryptoScreenerProps) {
  const [cryptos, setCryptos] = useState<Crypto[]>(mockCryptos);
  const [filteredCryptos, setFilteredCryptos] = useState<Crypto[]>(mockCryptos);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Crypto;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 5000000] as [number, number],
    marketCapRange: [0, 100000000] as [number, number], // in thousands of crores
    rankRange: [1, 100] as [number, number],
    change24hRange: [-50, 50] as [number, number],
    volume24hRange: [0, 5000000000] as [number, number],
  });

  // Apply filters and search
  useEffect(() => {
    const filtered = cryptos.filter((crypto) => {
      // Search filter
      if (
        searchQuery &&
        !crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Price range
      if (
        crypto.price < filters.priceRange[0] ||
        crypto.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Market cap range (in thousands of crores)
      const marketCapThousandCrores = crypto.marketCap / 100000000000;
      if (
        marketCapThousandCrores < filters.marketCapRange[0] ||
        marketCapThousandCrores > filters.marketCapRange[1]
      ) {
        return false;
      }

      // Rank range
      if (
        crypto.rank < filters.rankRange[0] ||
        crypto.rank > filters.rankRange[1]
      ) {
        return false;
      }

      // 24h change range
      if (
        crypto.changePercent24h < filters.change24hRange[0] ||
        crypto.changePercent24h > filters.change24hRange[1]
      ) {
        return false;
      }

      // Volume range
      if (
        crypto.volume24h < filters.volume24hRange[0] ||
        crypto.volume24h > filters.volume24hRange[1]
      ) {
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
    setFilteredCryptos(filtered);
  }, [cryptos, searchQuery, filters, sortConfig]);

  const handleSort = (key: keyof Crypto) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 5000000],
      marketCapRange: [0, 100000000],
      rankRange: [1, 100],
      change24hRange: [-50, 50],
      volume24hRange: [0, 5000000000],
    });
  };

  const refreshData = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const formatMarketCap = (cap: number) => {
    const crores = cap / 10000000;
    if (crores >= 100000) {
      return `₹${(crores / 100000).toFixed(1)}L Cr`;
    }
    return `₹${crores.toFixed(0)} Cr`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 10000000) return `₹${(volume / 10000000).toFixed(1)} Cr`;
    if (volume >= 100000) return `₹${(volume / 100000).toFixed(1)} L`;
    return `₹${volume.toLocaleString()}`;
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
          {/* Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Price Range (₹{filters.priceRange[0].toLocaleString()} - ₹
                {filters.priceRange[1].toLocaleString()})
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: value as [number, number],
                  }))
                }
                max={5000000}
                step={50000}
                className="w-full"
              />
            </div>

            {/* Market Cap Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Market Cap (₹{(filters.marketCapRange[0] / 100).toFixed(0)}K Cr
                - ₹{(filters.marketCapRange[1] / 100).toFixed(0)}K Cr)
              </label>
              <Slider
                value={filters.marketCapRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    marketCapRange: value as [number, number],
                  }))
                }
                max={100000000}
                step={1000000}
                className="w-full"
              />
            </div>

            {/* Rank Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Market Rank ({filters.rankRange[0]} - {filters.rankRange[1]})
              </label>
              <Slider
                value={filters.rankRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    rankRange: value as [number, number],
                  }))
                }
                min={1}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* 24h Change Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                24h Change ({filters.change24hRange[0]}% -{" "}
                {filters.change24hRange[1]}%)
              </label>
              <Slider
                value={filters.change24hRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    change24hRange: value as [number, number],
                  }))
                }
                min={-50}
                max={50}
                step={1}
                className="w-full"
              />
            </div>

            {/* Volume Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                24h Volume (₹{(filters.volume24hRange[0] / 10000000).toFixed(0)}{" "}
                Cr - ₹{(filters.volume24hRange[1] / 10000000).toFixed(0)} Cr)
              </label>
              <Slider
                value={filters.volume24hRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    volume24hRange: value as [number, number],
                  }))
                }
                max={5000000000}
                step={100000000}
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
            {filteredCryptos.length} Cryptocurrency
            {filteredCryptos.length !== 1 ? "s" : ""} Found
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

      {/* Crypto Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("rank")}
                      className="h-auto p-0 font-semibold"
                    >
                      Rank <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 font-semibold"
                    >
                      Name <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("price")}
                      className="h-auto p-0 font-semibold"
                    >
                      Price <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("changePercent24h")}
                      className="h-auto p-0 font-semibold"
                    >
                      24h Change <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("volume24h")}
                      className="h-auto p-0 font-semibold"
                    >
                      24h Volume <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("marketCap")}
                      className="h-auto p-0 font-semibold"
                    >
                      Market Cap <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("athChangePercent")}
                      className="h-auto p-0 font-semibold"
                    >
                      ATH Change <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCryptos.map((crypto) => (
                  <TableRow key={crypto.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      #{crypto.rank}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Coins className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium">{crypto.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {crypto.name}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(crypto.price)}
                    </TableCell>
                    <TableCell>
                      {formatChange(crypto.change24h, crypto.changePercent24h)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatVolume(crypto.volume24h)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatMarketCap(crypto.marketCap)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          crypto.athChangePercent >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {crypto.athChangePercent.toFixed(1)}%
                      </span>
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

      {filteredCryptos.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Coins className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No cryptocurrencies found
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
