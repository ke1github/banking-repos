"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  ArrowUpDown,
  Star,
  ExternalLink,
  Download,
  RefreshCw,
  Filter,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Bond {
  id: string;
  name: string;
  type: "Government" | "Corporate" | "Municipal";
  rating: string;
  yield: number;
  maturity: string;
  price: number;
  coupon: number;
  duration: number;
  issuer: string;
}

const mockBonds: Bond[] = [
  {
    id: "GOI_10Y",
    name: "Government of India 10Y Bond",
    type: "Government",
    rating: "AAA",
    yield: 7.2,
    maturity: "2034-01-15",
    price: 98.75,
    coupon: 7.17,
    duration: 8.5,
    issuer: "Government of India",
  },
  {
    id: "HDFC_5Y",
    name: "HDFC Bank 5Y Bond",
    type: "Corporate",
    rating: "AAA",
    yield: 8.1,
    maturity: "2029-06-30",
    price: 101.25,
    coupon: 8.05,
    duration: 4.2,
    issuer: "HDFC Bank",
  },
];

interface BondScreenerProps {
  searchQuery: string;
}

export default function BondScreener({ searchQuery }: BondScreenerProps) {
  const [bonds] = useState<Bond[]>(mockBonds);
  const [filteredBonds, setFilteredBonds] = useState<Bond[]>(mockBonds);

  useEffect(() => {
    const filtered = bonds.filter(
      (bond) =>
        bond.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bond.issuer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBonds(filtered);
  }, [bonds, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {filteredBonds.length} Bonds Found
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
                <TableHead>Bond Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Yield</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Coupon</TableHead>
                <TableHead>Maturity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBonds.map((bond) => (
                <TableRow key={bond.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-8 w-8 text-purple-600" />
                      <div>
                        <div className="font-medium">{bond.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {bond.issuer}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{bond.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{bond.rating}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {bond.yield.toFixed(2)}%
                  </TableCell>
                  <TableCell>₹{bond.price.toFixed(2)}</TableCell>
                  <TableCell>{bond.coupon.toFixed(2)}%</TableCell>
                  <TableCell>
                    {new Date(bond.maturity).toLocaleDateString()}
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
