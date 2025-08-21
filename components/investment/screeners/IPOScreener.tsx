"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Star, ExternalLink, Download, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface IPO {
  id: string;
  companyName: string;
  issueSize: number;
  priceRange: [number, number];
  lotSize: number;
  openDate: string;
  closeDate: string;
  listingDate: string;
  category: string;
  lead: string;
  status: "Upcoming" | "Open" | "Closed" | "Listed";
}

const mockIPOs: IPO[] = [
  {
    id: "NEWTECH_IPO",
    companyName: "NewTech Solutions Ltd",
    issueSize: 2500,
    priceRange: [320, 350],
    lotSize: 40,
    openDate: "2025-09-01",
    closeDate: "2025-09-03",
    listingDate: "2025-09-10",
    category: "Main Board",
    lead: "Kotak Mahindra Capital",
    status: "Upcoming",
  },
  {
    id: "GREENERGY_IPO",
    companyName: "GreenEnergy India Ltd",
    issueSize: 1800,
    priceRange: [280, 310],
    lotSize: 48,
    openDate: "2025-08-25",
    closeDate: "2025-08-27",
    listingDate: "2025-09-05",
    category: "Main Board",
    lead: "ICICI Securities",
    status: "Open",
  },
];

interface IPOScreenerProps {
  searchQuery: string;
}

export default function IPOScreener({ searchQuery }: IPOScreenerProps) {
  const [ipos] = useState<IPO[]>(mockIPOs);
  const [filteredIPOs, setFilteredIPOs] = useState<IPO[]>(mockIPOs);

  useEffect(() => {
    const filtered = ipos.filter(
      (ipo) =>
        ipo.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ipo.lead.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredIPOs(filtered);
  }, [ipos, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Open":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-yellow-100 text-yellow-800";
      case "Listed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {filteredIPOs.length} IPOs Found
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
                <TableHead>Company</TableHead>
                <TableHead>Issue Size</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Lot Size</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIPOs.map((ipo) => (
                <TableRow key={ipo.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Zap className="h-8 w-8 text-red-600" />
                      <div>
                        <div className="font-medium">{ipo.companyName}</div>
                        <div className="text-sm text-muted-foreground">
                          {ipo.lead}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ₹{ipo.issueSize} Cr
                  </TableCell>
                  <TableCell>
                    ₹{ipo.priceRange[0]} - ₹{ipo.priceRange[1]}
                  </TableCell>
                  <TableCell>{ipo.lotSize} shares</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(ipo.openDate).toLocaleDateString()} -{" "}
                        {new Date(ipo.closeDate).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground mt-1">
                        Listing:{" "}
                        {new Date(ipo.listingDate).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ipo.status)}>
                      {ipo.status}
                    </Badge>
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
