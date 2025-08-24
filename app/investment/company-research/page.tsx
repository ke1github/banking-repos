"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Building2,
  TrendingUp,
  DollarSign,
  FileText,
  BarChart,
  Users,
  Globe,
  ChevronRight,
} from "lucide-react";

// Placeholder component for section content
const SectionPlaceholder = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-muted-foreground">{description}</p>
    <Separator />
    <div className="h-[200px] flex items-center justify-center border border-dashed rounded-lg bg-muted/30">
      <p className="text-muted-foreground">{title} data would appear here</p>
    </div>
  </div>
);

export default function CompanyResearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("AAPL");
  // Add a comment to trigger recompilation

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Company Research</h1>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for a company..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Apple Inc. (AAPL)</CardTitle>
              <CardDescription>
                NASDAQ • Technology • United States
              </CardDescription>
            </div>
            <div className="text-2xl font-semibold">
              $178.32{" "}
              <span className="text-green-500 text-sm ml-1">+2.45 (1.38%)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="news">News & Events</TabsTrigger>
              <TabsTrigger value="peers">Peers</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Market Data</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Market Cap</dt>
                        <dd className="font-medium">$2.78T</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">P/E Ratio</dt>
                        <dd className="font-medium">29.42</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">
                          Dividend Yield
                        </dt>
                        <dd className="font-medium">0.54%</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">52-Week High</dt>
                        <dd className="font-medium">$199.62</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">52-Week Low</dt>
                        <dd className="font-medium">$124.17</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Avg. Volume</dt>
                        <dd className="font-medium">58.32M</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Company Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="mb-4">
                      Apple Inc. designs, manufactures, and markets smartphones,
                      personal computers, tablets, wearables, and accessories
                      worldwide. The company offers iPhone, Mac, iPad, and
                      wearables, home, and accessories.
                    </p>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Sector</dt>
                        <dd className="font-medium">Technology</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Industry</dt>
                        <dd className="font-medium">Consumer Electronics</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Employees</dt>
                        <dd className="font-medium">164,000</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">CEO</dt>
                        <dd className="font-medium">Tim Cook</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Investment Thesis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="mb-4">
                      Apple maintains strong competitive advantages through its
                      ecosystem, brand loyalty, and hardware-software
                      integration. The company continues to expand its services
                      segment, which provides higher margins and recurring
                      revenue.
                    </p>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">
                          Analyst Rating
                        </dt>
                        <dd className="font-medium text-green-600">Buy</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Price Target</dt>
                        <dd className="font-medium">$210.00</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Upside</dt>
                        <dd className="font-medium text-green-600">17.8%</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <SectionPlaceholder
                  title="Business Model"
                  description="Apple's business model centers around designing, manufacturing, and selling premium hardware products while building an ecosystem of software and services."
                  icon={<Building2 className="h-5 w-5" />}
                />

                <SectionPlaceholder
                  title="Growth Drivers"
                  description="Key growth drivers include services expansion, wearables growth, and potential new product categories like AR/VR."
                  icon={<TrendingUp className="h-5 w-5" />}
                />

                <SectionPlaceholder
                  title="Financial Health"
                  description="Assessment of Apple's balance sheet strength, cash flow generation, and capital allocation strategy."
                  icon={<DollarSign className="h-5 w-5" />}
                />

                <SectionPlaceholder
                  title="Risk Factors"
                  description="Potential challenges including competition, regulatory pressures, and supply chain dependencies."
                  icon={<FileText className="h-5 w-5" />}
                />
              </div>
            </TabsContent>

            <TabsContent value="financials" className="mt-0">
              <div className="space-y-6">
                <SectionPlaceholder
                  title="Income Statement"
                  description="Revenue, cost structure, profitability trends, and earnings growth."
                  icon={<BarChart className="h-5 w-5" />}
                />
              </div>
            </TabsContent>

            <TabsContent value="news" className="mt-0">
              <div className="space-y-6">
                <SectionPlaceholder
                  title="Recent News"
                  description="Latest news articles, press releases, and media coverage."
                  icon={<Globe className="h-5 w-5" />}
                />
              </div>
            </TabsContent>

            <TabsContent value="peers" className="mt-0">
              <div className="space-y-6">
                <SectionPlaceholder
                  title="Peer Comparison"
                  description="Comparative analysis with competitors like Microsoft, Google, Samsung, etc."
                  icon={<Users className="h-5 w-5" />}
                />
              </div>
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <div className="space-y-6">
                <SectionPlaceholder
                  title="Analyst Reports"
                  description="Research reports and analysis from financial institutions and market experts."
                  icon={<FileText className="h-5 w-5" />}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ESG Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <SectionPlaceholder
              title="Environmental, Social, and Governance"
              description="Apple's sustainability initiatives, social responsibility programs, and corporate governance practices."
              icon={<Globe className="h-5 w-5" />}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ownership Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <SectionPlaceholder
              title="Institutional and Insider Ownership"
              description="Breakdown of major shareholders, institutional investors, and insider holdings."
              icon={<Users className="h-5 w-5" />}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
