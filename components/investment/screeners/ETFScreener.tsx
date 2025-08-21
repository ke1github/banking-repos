"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, ArrowUpDown, Star, ExternalLink, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ETF {
  id: string;
  name: string;
  symbol: string;
  nav: number;
  change: number;
  changePercent: number;
  aum: number;
  expenseRatio: number;
  trackingIndex: string;
  category: string;
}

const mockETFs: ETF[] = [
  {
    id: "NIFTYBEES",
    name: "Nippon India ETF Nifty BeES",
    symbol: "NIFTYBEES",
    nav: 245.8,
    change: 2.95,
    changePercent: 1.22,
    aum: 8450,
    expenseRatio: 0.05,
    trackingIndex: "NIFTY 50",
    category: "Large Cap",
  },
  {
    id: "GOLDBEES",
    name: "Goldman Sachs Gold BeeS",
    symbol: "GOLDBEES",
    nav: 45.67,
    change: 0.23,
    changePercent: 0.51,
    aum: 2340,
    expenseRatio: 0.25,
    trackingIndex: "Gold Price",
    category: "Gold",
  },
];

interface ETFScreenerProps {
  searchQuery: string;
}

export default function ETFScreener({ searchQuery }: ETFScreenerProps) {
  const [etfs] = useState<ETF[]>(mockETFs);
  const [filteredETFs, setFilteredETFs] = useState<ETF[]>(mockETFs);

  useEffect(() => {
    const filtered = etfs.filter(
      (etf) =>
        etf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etf.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etf.trackingIndex.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredETFs(filtered);
  }, [etfs, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {filteredETFs.length} ETFs Found
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
                <TableHead>ETF Name</TableHead>
                <TableHead>NAV</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>AUM</TableHead>
                <TableHead>Expense Ratio</TableHead>
                <TableHead>Tracking Index</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredETFs.map((etf) => (
                <TableRow key={etf.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Globe className="h-8 w-8 text-indigo-600" />
                      <div>
                        <div className="font-medium">{etf.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {etf.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{etf.nav.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        etf.changePercent >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {etf.changePercent >= 0 ? "+" : ""}
                      {etf.changePercent.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell>₹{etf.aum} Cr</TableCell>
                  <TableCell>{etf.expenseRatio.toFixed(2)}%</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{etf.trackingIndex}</Badge>
                  </TableCell>
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
