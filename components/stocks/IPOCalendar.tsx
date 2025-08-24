"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Bell,
  ChevronRight,
  Building,
  Search,
  Filter,
  Info,
  AlertTriangle,
  ExternalLink,
  TrendingUp,
  DollarSign,
  Clock,
  CalendarDays,
  Star,
  ArrowLeftRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Mock data for IPOs
const upcomingIPOs = [
  {
    id: "ipo-001",
    company: "GreenTech Solutions",
    ticker: "GRNT",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Clean Energy",
    expectedDate: "Sep 15, 2025",
    priceRange: "$18.00 - $22.00",
    shares: "10M",
    valuation: "$2.2B",
    underwriters: ["Morgan Stanley", "Goldman Sachs", "JP Morgan"],
    description:
      "GreenTech Solutions is a renewable energy technology company focused on developing efficient solar and wind energy storage solutions.",
    status: "upcoming",
    interestLevel: "high",
  },
  {
    id: "ipo-002",
    company: "MediHealth Innovations",
    ticker: "MDHI",
    exchange: "NYSE",
    sector: "Healthcare",
    industry: "Biotechnology",
    expectedDate: "Sep 22, 2025",
    priceRange: "$24.00 - $28.00",
    shares: "8M",
    valuation: "$3.5B",
    underwriters: ["Goldman Sachs", "Barclays", "Bank of America"],
    description:
      "MediHealth Innovations develops advanced diagnostic tools and therapies for chronic diseases using AI and machine learning.",
    status: "upcoming",
    interestLevel: "medium",
  },
  {
    id: "ipo-003",
    company: "Urban Mobility",
    ticker: "UBRM",
    exchange: "NASDAQ",
    sector: "Transportation",
    industry: "Electric Vehicles",
    expectedDate: "Oct 5, 2025",
    priceRange: "$32.00 - $38.00",
    shares: "12M",
    valuation: "$5.8B",
    underwriters: ["JP Morgan", "Morgan Stanley", "Citigroup"],
    description:
      "Urban Mobility designs and manufactures electric vehicles and infrastructure solutions for urban transportation needs.",
    status: "upcoming",
    interestLevel: "high",
  },
  {
    id: "ipo-004",
    company: "DataSecure Networks",
    ticker: "DTSN",
    exchange: "NYSE",
    sector: "Technology",
    industry: "Cybersecurity",
    expectedDate: "Oct 12, 2025",
    priceRange: "$20.00 - $24.00",
    shares: "7M",
    valuation: "$1.8B",
    underwriters: ["Citigroup", "Deutsche Bank", "Credit Suisse"],
    description:
      "DataSecure Networks provides advanced cybersecurity solutions for enterprise clients using blockchain and AI technologies.",
    status: "upcoming",
    interestLevel: "medium",
  },
  {
    id: "ipo-005",
    company: "NexGen Robotics",
    ticker: "NGRT",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Robotics",
    expectedDate: "Oct 19, 2025",
    priceRange: "$28.00 - $34.00",
    shares: "9M",
    valuation: "$4.2B",
    underwriters: ["Goldman Sachs", "Morgan Stanley", "JP Morgan"],
    description:
      "NexGen Robotics develops automation solutions for manufacturing, healthcare, and logistics industries using advanced robotics.",
    status: "upcoming",
    interestLevel: "high",
  },
];

const recentIPOs = [
  {
    id: "ipo-r001",
    company: "CloudScale Systems",
    ticker: "CLSC",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Cloud Computing",
    ipoDate: "Aug 18, 2025",
    offerPrice: "$26.00",
    currentPrice: "$42.75",
    performance: "+64.4%",
    shares: "15M",
    valuation: "$3.9B",
    underwriters: ["Morgan Stanley", "Goldman Sachs", "JP Morgan"],
    description:
      "CloudScale Systems provides enterprise-grade cloud infrastructure and platform services for global businesses.",
    status: "completed",
  },
  {
    id: "ipo-r002",
    company: "AgroTech Farms",
    ticker: "AGTF",
    exchange: "NYSE",
    sector: "Agriculture",
    industry: "Agricultural Technology",
    ipoDate: "Aug 10, 2025",
    offerPrice: "$18.00",
    currentPrice: "$22.35",
    performance: "+24.2%",
    shares: "12M",
    valuation: "$2.2B",
    underwriters: ["JP Morgan", "Bank of America", "Wells Fargo"],
    description:
      "AgroTech Farms develops sustainable farming technologies and vertical farming solutions for urban environments.",
    status: "completed",
  },
  {
    id: "ipo-r003",
    company: "QuantumLogic",
    ticker: "QNTM",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Quantum Computing",
    ipoDate: "Aug 5, 2025",
    offerPrice: "$32.00",
    currentPrice: "$29.80",
    performance: "-6.9%",
    shares: "8M",
    valuation: "$5.1B",
    underwriters: ["Goldman Sachs", "Morgan Stanley", "Barclays"],
    description:
      "QuantumLogic develops quantum computing hardware and software solutions for scientific research and enterprise applications.",
    status: "completed",
  },
  {
    id: "ipo-r004",
    company: "HealthStream Analytics",
    ticker: "HSAM",
    exchange: "NYSE",
    sector: "Healthcare",
    industry: "Health Analytics",
    ipoDate: "Jul 28, 2025",
    offerPrice: "$22.00",
    currentPrice: "$34.50",
    performance: "+56.8%",
    shares: "10M",
    valuation: "$2.2B",
    underwriters: ["JP Morgan", "Citigroup", "Morgan Stanley"],
    description:
      "HealthStream Analytics provides data analytics and AI solutions for healthcare providers to improve patient outcomes.",
    status: "completed",
  },
  {
    id: "ipo-r005",
    company: "FintechPay",
    ticker: "FNTC",
    exchange: "NASDAQ",
    sector: "Financial Services",
    industry: "Financial Technology",
    ipoDate: "Jul 20, 2025",
    offerPrice: "$24.00",
    currentPrice: "$21.35",
    performance: "-11.0%",
    shares: "14M",
    valuation: "$3.4B",
    underwriters: ["Morgan Stanley", "Goldman Sachs", "JP Morgan"],
    description:
      "FintechPay offers digital payment solutions and financial services for consumers and businesses globally.",
    status: "completed",
  },
];

// Popular sectors for filtering
const sectors = [
  "All Sectors",
  "Technology",
  "Healthcare",
  "Financial Services",
  "Consumer",
  "Energy",
  "Industrials",
  "Communication Services",
  "Materials",
  "Real Estate",
  "Utilities",
];

export default function IPOCalendar() {
  const [selectedIPO, setSelectedIPO] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [showHighInterestOnly, setShowHighInterestOnly] = useState(false);

  // Filter upcoming IPOs based on search query, sector, and interest level
  const filteredUpcomingIPOs = upcomingIPOs.filter((ipo) => {
    const matchesSearch =
      ipo.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ipo.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ipo.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ipo.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector =
      selectedSector === "All Sectors" || ipo.sector === selectedSector;

    const matchesInterest =
      !showHighInterestOnly || ipo.interestLevel === "high";

    return matchesSearch && matchesSector && matchesInterest;
  });

  // Filter recent IPOs based on search query and sector
  const filteredRecentIPOs = recentIPOs.filter((ipo) => {
    const matchesSearch =
      ipo.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ipo.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ipo.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ipo.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector =
      selectedSector === "All Sectors" || ipo.sector === selectedSector;

    return matchesSearch && matchesSector;
  });

  const handleSelectIPO = (ipo: any) => {
    setSelectedIPO(ipo);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                IPO Calendar
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track upcoming and recent initial public offerings
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company name, ticker, sector..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Switch
                  id="high-interest"
                  checked={showHighInterestOnly}
                  onCheckedChange={setShowHighInterestOnly}
                />
                <Label htmlFor="high-interest" className="cursor-pointer">
                  High Interest Only
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="upcoming" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming IPOs
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Recent IPOs
              </TabsTrigger>
            </TabsList>

            {/* Upcoming IPOs Tab */}
            <TabsContent value="upcoming">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Upcoming IPOs</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredUpcomingIPOs.length > 0 ? (
                    <div className="space-y-4">
                      {filteredUpcomingIPOs.map((ipo) => (
                        <div
                          key={ipo.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedIPO?.id === ipo.id
                              ? "bg-muted border-blue-300"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => handleSelectIPO(ipo)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium">{ipo.company}</h3>
                                {ipo.interestLevel === "high" && (
                                  <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                                    <Star className="h-3 w-3 mr-1" />
                                    High Interest
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {ipo.ticker} • {ipo.exchange}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {ipo.expectedDate}
                              </div>
                              <Badge variant="outline" className="mt-1">
                                {ipo.sector}
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Price Range
                              </div>
                              <div>{ipo.priceRange}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Shares Offered
                              </div>
                              <div>{ipo.shares}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Valuation
                              </div>
                              <div>{ipo.valuation}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        No IPOs found matching your criteria.
                      </p>
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedSector("All Sectors");
                          setShowHighInterestOnly(false);
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recent IPOs Tab */}
            <TabsContent value="recent">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recent IPOs</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredRecentIPOs.length > 0 ? (
                    <div className="space-y-4">
                      {filteredRecentIPOs.map((ipo) => (
                        <div
                          key={ipo.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedIPO?.id === ipo.id
                              ? "bg-muted border-blue-300"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => handleSelectIPO(ipo)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{ipo.company}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {ipo.ticker} • {ipo.exchange}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {ipo.ipoDate}
                              </div>
                              <Badge variant="outline" className="mt-1">
                                {ipo.sector}
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-4 gap-2 text-sm">
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Offer Price
                              </div>
                              <div>{ipo.offerPrice}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Current Price
                              </div>
                              <div>{ipo.currentPrice}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Performance
                              </div>
                              <div
                                className={`${
                                  ipo.performance.startsWith("+")
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {ipo.performance}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">
                                Valuation
                              </div>
                              <div>{ipo.valuation}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        No IPOs found matching your criteria.
                      </p>
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedSector("All Sectors");
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* IPO Details Panel */}
        <div className="md:col-span-1">
          {selectedIPO ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex justify-between items-center">
                  <span>IPO Details</span>
                  {selectedIPO.status === "upcoming" && (
                    <Button variant="ghost" size="sm" className="h-8">
                      <Bell className="h-4 w-4 mr-2" />
                      Set Alert
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center">
                    {selectedIPO.company}
                    <Badge className="ml-2" variant="outline">
                      {selectedIPO.ticker}
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedIPO.industry} • {selectedIPO.exchange}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Company Overview
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedIPO.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">IPO Details</h4>
                    <div className="space-y-2">
                      {selectedIPO.status === "upcoming" ? (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Expected Date:
                            </span>
                            <span className="font-medium">
                              {selectedIPO.expectedDate}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Price Range:
                            </span>
                            <span className="font-medium">
                              {selectedIPO.priceRange}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              IPO Date:
                            </span>
                            <span className="font-medium">
                              {selectedIPO.ipoDate}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Offer Price:
                            </span>
                            <span className="font-medium">
                              {selectedIPO.offerPrice}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Current Price:
                            </span>
                            <span className="font-medium">
                              {selectedIPO.currentPrice}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Performance:
                            </span>
                            <span
                              className={`font-medium ${
                                selectedIPO.performance.startsWith("+")
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {selectedIPO.performance}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Shares Offered:
                        </span>
                        <span className="font-medium">
                          {selectedIPO.shares}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Valuation:
                        </span>
                        <span className="font-medium">
                          {selectedIPO.valuation}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Underwriters</h4>
                    <div className="space-y-1">
                      {selectedIPO.underwriters.map(
                        (underwriter: string, index: number) => (
                          <div key={index} className="text-sm">
                            • {underwriter}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col space-y-2">
                  {selectedIPO.status === "upcoming" ? (
                    <>
                      <Button>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Participate in IPO
                      </Button>
                      <Button variant="outline">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        Add to Calendar
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Stock Details
                      </Button>
                      <Button variant="outline">
                        <ArrowLeftRight className="h-4 w-4 mr-2" />
                        Trade Stock
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <div className="text-center space-y-3">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium">Select an IPO</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Click on an IPO from the list to view detailed information
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* IPO Resources */}
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">IPO Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>IPO Calendar Guide</span>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  <span>Understanding IPO Investing</span>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>IPO Participation Criteria</span>
                </div>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
