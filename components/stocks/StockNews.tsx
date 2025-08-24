"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Globe,
  Tag,
  TrendingUp,
  TrendingDown,
  Bookmark,
  BookmarkPlus,
  Share2,
  ThumbsUp,
  RefreshCw,
  Search,
  Filter,
  Bell,
  BellOff,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

// Mock news items
const marketNewsItems = [
  {
    id: 1,
    title: "Federal Reserve signals potential rate cuts for next quarter",
    source: "Financial Times",
    category: "Economy",
    image: "/icons/news/financial-times.png",
    time: "2 hours ago",
    impact: "high",
    sentiment: "positive",
    snippet:
      "The Federal Reserve has indicated it may begin cutting interest rates as early as next quarter, citing improvements in inflation data and a moderating labor market.",
    url: "#",
  },
  {
    id: 2,
    title: "Tech stocks rally on AI revenue growth expectations",
    source: "The Wall Street Journal",
    category: "Technology",
    image: "/icons/news/wsj.png",
    time: "4 hours ago",
    impact: "medium",
    sentiment: "positive",
    snippet:
      "Major technology companies saw their stocks surge on expectations that artificial intelligence advancements will drive substantial revenue growth in the coming quarters.",
    url: "#",
  },
  {
    id: 3,
    title: "Oil prices drop as OPEC+ members consider production increase",
    source: "Bloomberg",
    category: "Energy",
    image: "/icons/news/bloomberg.png",
    time: "6 hours ago",
    impact: "medium",
    sentiment: "negative",
    snippet:
      "Crude oil prices fell sharply following reports that OPEC+ members are discussing a potential increase in production quotas at their upcoming meeting.",
    url: "#",
  },
  {
    id: 4,
    title:
      "Major retailer announces significant store closures amid changing consumer habits",
    source: "Reuters",
    category: "Retail",
    image: "/icons/news/reuters.png",
    time: "8 hours ago",
    impact: "medium",
    sentiment: "negative",
    snippet:
      "A leading retail chain announced plans to close over 200 locations nationwide as consumers continue to shift toward online shopping, affecting approximately 2,500 jobs.",
    url: "#",
  },
  {
    id: 5,
    title: "Healthcare merger creates new industry giant with $50B market cap",
    source: "CNBC",
    category: "Healthcare",
    image: "/icons/news/cnbc.png",
    time: "10 hours ago",
    impact: "high",
    sentiment: "positive",
    snippet:
      "Two major healthcare providers have completed their merger, creating a new industry powerhouse with a combined market capitalization of over $50 billion.",
    url: "#",
  },
];

// Mock earnings announcements
const earningsAnnouncements = [
  {
    id: 1,
    company: "TechGiant Inc.",
    ticker: "TGI",
    date: "Today",
    time: "After Market",
    epsEstimate: 2.75,
    epsActual: 3.12,
    revenueEstimate: "14.2B",
    revenueActual: "15.1B",
    sentiment: "positive",
    priceChange: "+5.8%",
  },
  {
    id: 2,
    company: "Global Retail Corp",
    ticker: "GRC",
    date: "Today",
    time: "Before Market",
    epsEstimate: 1.34,
    epsActual: 1.28,
    revenueEstimate: "28.5B",
    revenueActual: "27.9B",
    sentiment: "negative",
    priceChange: "-2.3%",
  },
  {
    id: 3,
    company: "Advanced Pharma",
    ticker: "APHA",
    date: "Tomorrow",
    time: "After Market",
    epsEstimate: 0.87,
    epsActual: null,
    revenueEstimate: "4.8B",
    revenueActual: null,
    sentiment: "neutral",
    priceChange: "N/A",
  },
  {
    id: 4,
    company: "Industrial Solutions",
    ticker: "INDS",
    date: "Tomorrow",
    time: "Before Market",
    epsEstimate: 2.15,
    epsActual: null,
    revenueEstimate: "12.3B",
    revenueActual: null,
    sentiment: "neutral",
    priceChange: "N/A",
  },
  {
    id: 5,
    company: "FinTech Innovations",
    ticker: "FNTI",
    date: "Jun 15",
    time: "After Market",
    epsEstimate: 0.54,
    epsActual: null,
    revenueEstimate: "2.1B",
    revenueActual: null,
    sentiment: "neutral",
    priceChange: "N/A",
  },
];

export default function StockNews() {
  const [newsFilter, setNewsFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter news based on category and search query
  const filteredNews = marketNewsItems.filter((item) => {
    const matchesCategory =
      newsFilter === "all" ||
      item.category.toLowerCase() === newsFilter.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Market News & Updates
          </h1>
          <p className="text-muted-foreground">
            Stay informed with the latest market news and earnings announcements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Set Alerts
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="market-news" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="market-news">Market News</TabsTrigger>
          <TabsTrigger value="earnings">Earnings Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="market-news" className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search news..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={newsFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setNewsFilter("all")}
              >
                All
              </Button>
              <Button
                variant={newsFilter === "economy" ? "default" : "outline"}
                size="sm"
                onClick={() => setNewsFilter("economy")}
              >
                Economy
              </Button>
              <Button
                variant={newsFilter === "technology" ? "default" : "outline"}
                size="sm"
                onClick={() => setNewsFilter("technology")}
              >
                Technology
              </Button>
              <Button
                variant={newsFilter === "energy" ? "default" : "outline"}
                size="sm"
                onClick={() => setNewsFilter("energy")}
              >
                Energy
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredNews.length > 0 ? (
              filteredNews.map((news) => (
                <Card key={news.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={news.image} alt={news.source} />
                            <AvatarFallback>{news.source[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {news.source}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {news.category}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {news.time}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-2">
                        {news.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {news.snippet}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={
                              news.sentiment === "positive"
                                ? "default"
                                : news.sentiment === "negative"
                                ? "destructive"
                                : "outline"
                            }
                            className={cn(
                              "text-xs",
                              news.sentiment === "positive" &&
                                "bg-green-500 hover:bg-green-500/80"
                            )}
                          >
                            {news.sentiment === "positive" ? (
                              <TrendingUp className="mr-1 h-3 w-3" />
                            ) : news.sentiment === "negative" ? (
                              <TrendingDown className="mr-1 h-3 w-3" />
                            ) : null}
                            {news.sentiment.charAt(0).toUpperCase() +
                              news.sentiment.slice(1)}{" "}
                            Impact
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {news.impact.charAt(0).toUpperCase() +
                              news.impact.slice(1)}{" "}
                            Priority
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <BookmarkPlus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-[180px] bg-muted/30 flex flex-col justify-between">
                      <div className="h-full flex items-center justify-center p-4">
                        {news.sentiment === "positive" ? (
                          <TrendingUp className="h-12 w-12 text-green-500/70" />
                        ) : news.sentiment === "negative" ? (
                          <TrendingDown className="h-12 w-12 text-red-500/70" />
                        ) : (
                          <Globe className="h-12 w-12 text-blue-500/70" />
                        )}
                      </div>
                      <div className="p-4 bg-background">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <a
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>Read More</span>
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <p className="text-muted-foreground">
                  No news matching your criteria.
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setNewsFilter("all");
                    setSearchQuery("");
                  }}
                >
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="earnings" className="pt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Upcoming Earnings Announcements
              </CardTitle>
              <CardDescription>
                Companies reporting earnings in the next few days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {earningsAnnouncements.map((earnings) => (
                  <div key={earnings.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{earnings.company}</h3>
                          <Badge variant="outline">{earnings.ticker}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground gap-3 mt-1">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {earnings.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {earnings.time}
                          </div>
                        </div>
                      </div>

                      {earnings.epsActual !== null ? (
                        <Badge
                          variant={
                            earnings.sentiment === "positive"
                              ? "default"
                              : earnings.sentiment === "negative"
                              ? "destructive"
                              : "outline"
                          }
                          className={cn(
                            earnings.sentiment === "positive" &&
                              "bg-green-500 hover:bg-green-500/80"
                          )}
                        >
                          {earnings.priceChange}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Upcoming</Badge>
                      )}
                    </div>

                    <Separator className="my-2" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          EPS Est.
                        </p>
                        <p className="font-medium">
                          ${earnings.epsEstimate.toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          EPS Actual
                        </p>
                        <p className="font-medium">
                          {earnings.epsActual !== null
                            ? `$${earnings.epsActual.toFixed(2)}`
                            : "Pending"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Revenue Est.
                        </p>
                        <p className="font-medium">
                          ${earnings.revenueEstimate}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Revenue Actual
                        </p>
                        <p className="font-medium">
                          {earnings.revenueActual !== null
                            ? `$${earnings.revenueActual}`
                            : "Pending"}
                        </p>
                      </div>
                    </div>

                    {earnings.epsActual === null && (
                      <div className="mt-3 flex justify-end">
                        <Button variant="outline" size="sm">
                          <Bell className="mr-2 h-3 w-3" />
                          Set Reminder
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Full Earnings Calendar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
