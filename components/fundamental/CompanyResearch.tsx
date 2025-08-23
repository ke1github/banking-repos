"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/custom-badge";
import {
  Search,
  Building,
  TrendingUp,
  Users,
  Calendar,
  Globe,
  FileText,
  DollarSign,
  Activity,
  Award,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { fundamentalAnalysisService } from "@/lib/api/fundamentalAnalysisService";
import {
  CompanyProfile,
  AnalystRating,
  CompanyInsiderTrading,
  ESGScore,
} from "@/lib/types/fundamental-analysis-types";
import { formatIndianCurrency } from "@/lib/types/indianStocks";

export default function CompanyResearch() {
  const [searchTicker, setSearchTicker] = useState("");
  const [ticker, setTicker] = useState("AAPL");
  const [loading, setLoading] = useState({
    profile: true,
    analyst: true,
    insider: true,
    esg: true,
  });
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [analystRatings, setAnalystRatings] = useState<AnalystRating[]>([]);
  const [insiderTrading, setInsiderTrading] = useState<CompanyInsiderTrading[]>(
    []
  );
  const [esgScore, setEsgScore] = useState<ESGScore | null>(null);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    fetchCompanyData(ticker);
  }, [ticker]);

  const fetchCompanyData = async (ticker: string) => {
    setLoading({
      profile: true,
      analyst: true,
      insider: true,
      esg: true,
    });

    try {
      // Fetch company profile
      const profileData = await fundamentalAnalysisService.getCompanyProfile(
        ticker
      );
      setProfile(profileData);
      setLoading((prev) => ({ ...prev, profile: false }));

      // Fetch analyst ratings
      const analystData = await fundamentalAnalysisService.getAnalystRatings(
        ticker
      );
      setAnalystRatings(analystData);
      setLoading((prev) => ({ ...prev, analyst: false }));

      // Fetch insider trading
      const insiderData = await fundamentalAnalysisService.getInsiderTrading(
        ticker,
        10
      );
      setInsiderTrading(insiderData);
      setLoading((prev) => ({ ...prev, insider: false }));

      // Fetch ESG scores
      const esgData = await fundamentalAnalysisService.getESGScores(ticker);
      setEsgScore(esgData);
      setLoading((prev) => ({ ...prev, esg: false }));
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const handleSearch = () => {
    if (searchTicker.trim()) {
      setTicker(searchTicker.toUpperCase());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(2)} T`;
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)} B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)} M`;
    }
    return value.toString();
  };

  const getAnalystSentiment = () => {
    if (!analystRatings.length)
      return { sentiment: "Neutral", color: "bg-gray-100 text-gray-800" };

    const buys = analystRatings.filter(
      (r) => r.rating === "Buy" || r.rating === "Overweight"
    ).length;
    const sells = analystRatings.filter(
      (r) => r.rating === "Sell" || r.rating === "Underweight"
    ).length;
    const holds = analystRatings.filter(
      (r) => r.rating === "Hold" || r.rating === "Neutral"
    ).length;

    const total = analystRatings.length;
    const buyPercentage = (buys / total) * 100;

    if (buyPercentage >= 70) {
      return {
        sentiment: "Strongly Bullish",
        color: "bg-green-100 text-green-800",
      };
    } else if (buyPercentage >= 50) {
      return { sentiment: "Bullish", color: "bg-green-50 text-green-700" };
    } else if (buyPercentage >= 30) {
      return { sentiment: "Neutral", color: "bg-gray-100 text-gray-800" };
    } else if (buyPercentage >= 10) {
      return { sentiment: "Bearish", color: "bg-red-50 text-red-700" };
    } else {
      return {
        sentiment: "Strongly Bearish",
        color: "bg-red-100 text-red-800",
      };
    }
  };

  const getESGRating = () => {
    if (!esgScore) return { rating: "N/A", color: "bg-gray-100 text-gray-800" };

    const totalScore = esgScore.totalScore;

    if (totalScore >= 85) {
      return { rating: "Leader", color: "bg-green-100 text-green-800" };
    } else if (totalScore >= 70) {
      return { rating: "Outperformer", color: "bg-green-50 text-green-700" };
    } else if (totalScore >= 50) {
      return { rating: "Average", color: "bg-gray-100 text-gray-800" };
    } else if (totalScore >= 30) {
      return { rating: "Underperformer", color: "bg-amber-50 text-amber-700" };
    } else {
      return { rating: "Laggard", color: "bg-red-100 text-red-800" };
    }
  };

  const analystSentiment = getAnalystSentiment();
  const esgRating = getESGRating();

  return (
    <div>
      {/* Search and Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Company Research</h1>
          <p className="text-muted-foreground">
            Comprehensive information about companies and their performance
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              placeholder="Enter ticker symbol (e.g., AAPL)"
              value={searchTicker}
              onChange={(e) => setSearchTicker(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Company Profile */}
      {loading.profile ? (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
              <span>Loading company profile...</span>
            </div>
          </CardContent>
        </Card>
      ) : profile ? (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  {profile.logoUrl ? (
                    <img
                      src={profile.logoUrl}
                      alt={profile.name}
                      className="h-14 w-14 object-contain"
                    />
                  ) : (
                    <Building className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-2xl">{profile.name}</CardTitle>
                    <Badge variant="outline">{profile.ticker}</Badge>
                    <Badge variant="outline">{profile.exchange}</Badge>
                  </div>
                  <CardDescription className="mt-1">
                    {profile.sector} • {profile.industry}
                  </CardDescription>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <div className="text-3xl font-bold">
                  ${formatMarketCap(profile.marketCap)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Market Capitalization
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeSection} onValueChange={setActiveSection}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analyst">Analyst Coverage</TabsTrigger>
                <TabsTrigger value="insider">Insider Activity</TabsTrigger>
                <TabsTrigger value="esg">ESG Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Company Info</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Building className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                        <div>
                          <div className="font-medium">Headquarters</div>
                          <div className="text-sm text-gray-600">
                            {profile.headquarters}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                        <div>
                          <div className="font-medium">Founded</div>
                          <div className="text-sm text-gray-600">
                            {profile.founded}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Users className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                        <div>
                          <div className="font-medium">Employees</div>
                          <div className="text-sm text-gray-600">
                            {profile.employees.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Globe className="h-5 w-5 mr-2 mt-0.5 text-gray-500" />
                        <div>
                          <div className="font-medium">Website</div>
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {profile.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-lg font-medium mb-3">Description</h3>
                    <p className="text-gray-700">{profile.description}</p>

                    <h3 className="text-lg font-medium mt-6 mb-3">
                      Key People
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center p-3 border rounded-md bg-gray-50">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">CEO</div>
                          <div className="font-medium">{profile.ceo}</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 border rounded-md bg-gray-50">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Exchange</div>
                          <div className="font-medium">{profile.exchange}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analyst">
                {loading.analyst ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                    <span>Loading analyst ratings...</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col md:flex-row items-start justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-medium">Analyst Ratings</h3>
                        <p className="text-sm text-gray-500">
                          Based on {analystRatings.length} analyst
                          recommendations
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${analystSentiment.color}`}
                        >
                          {analystSentiment.sentiment}
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="text-left p-3">Firm</th>
                            <th className="text-left p-3">Analyst</th>
                            <th className="text-left p-3">Rating</th>
                            <th className="text-left p-3">Price Target</th>
                            <th className="text-left p-3">Previous</th>
                            <th className="text-left p-3">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analystRatings.map((rating) => (
                            <tr
                              key={rating.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3 font-medium">
                                {rating.analystFirm}
                              </td>
                              <td className="p-3">{rating.analystName}</td>
                              <td className="p-3">
                                <Badge
                                  variant={
                                    rating.rating === "Buy" ||
                                    rating.rating === "Overweight"
                                      ? "success"
                                      : rating.rating === "Sell" ||
                                        rating.rating === "Underweight"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {rating.rating}
                                </Badge>
                              </td>
                              <td className="p-3">
                                ${rating.priceTarget.toFixed(2)}
                              </td>
                              <td className="p-3 text-sm text-gray-500">
                                {rating.previousRating && (
                                  <span>
                                    {rating.previousRating},{" "}
                                    {rating.previousPriceTarget && (
                                      <span>
                                        ${rating.previousPriceTarget.toFixed(2)}
                                      </span>
                                    )}
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-sm text-gray-500">
                                {new Date(rating.date).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="insider">
                {loading.insider ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                    <span>Loading insider trading data...</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col md:flex-row items-start justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-medium">
                          Insider Trading Activity
                        </h3>
                        <p className="text-sm text-gray-500">
                          Recent transactions by company insiders
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="text-left p-3">Insider</th>
                            <th className="text-left p-3">Position</th>
                            <th className="text-left p-3">Type</th>
                            <th className="text-left p-3">Shares</th>
                            <th className="text-left p-3">Price</th>
                            <th className="text-left p-3">Value</th>
                            <th className="text-left p-3">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {insiderTrading.map((transaction) => (
                            <tr
                              key={transaction.id}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3 font-medium">
                                {transaction.insiderName}
                              </td>
                              <td className="p-3">{transaction.position}</td>
                              <td className="p-3">
                                <Badge
                                  variant={
                                    transaction.transactionType === "Buy"
                                      ? "success"
                                      : transaction.transactionType === "Sell"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {transaction.transactionType}
                                </Badge>
                              </td>
                              <td className="p-3">
                                {transaction.shareCount.toLocaleString()}
                              </td>
                              <td className="p-3">
                                ${transaction.sharePrice.toFixed(2)}
                              </td>
                              <td className="p-3">
                                $
                                {transaction.totalValue.toLocaleString(
                                  undefined,
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td className="p-3 text-sm text-gray-500">
                                {new Date(
                                  transaction.transactionDate
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="esg">
                {loading.esg ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                    <span>Loading ESG data...</span>
                  </div>
                ) : esgScore ? (
                  <div>
                    <div className="flex flex-col md:flex-row items-start justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-medium">
                          Environmental, Social & Governance
                        </h3>
                        <p className="text-sm text-gray-500">
                          ESG performance metrics and ratings
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0">
                        <div
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${esgRating.color}`}
                        >
                          ESG Rating: {esgRating.rating}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-green-700">
                            Environmental
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">
                            {esgScore.environmentalScore}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Industry Avg:{" "}
                            {esgScore.industryAvg.environmentalScore}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                            <div
                              className="bg-green-600 h-2.5 rounded-full"
                              style={{
                                width: `${esgScore.environmentalScore}%`,
                              }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-blue-700">
                            Social
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">
                            {esgScore.socialScore}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Industry Avg: {esgScore.industryAvg.socialScore}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${esgScore.socialScore}%` }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-purple-700">
                            Governance
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">
                            {esgScore.governanceScore}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Industry Avg: {esgScore.industryAvg.governanceScore}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                            <div
                              className="bg-purple-600 h-2.5 rounded-full"
                              style={{ width: `${esgScore.governanceScore}%` }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">ESG Ratings</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {esgScore.ratings.map((rating, index) => (
                          <div key={index} className="border rounded-md p-4">
                            <div className="text-sm text-gray-500">
                              {rating.source}
                            </div>
                            <div className="text-xl font-semibold mt-1">
                              {rating.rating}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Scale: {rating.scale}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {esgScore.controversies.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-3">
                          ESG Controversies
                        </h3>
                        <div className="space-y-3">
                          {esgScore.controversies.map((controversy, index) => (
                            <div
                              key={index}
                              className="flex items-start p-3 border rounded-md bg-gray-50"
                            >
                              <AlertTriangle
                                className={`h-5 w-5 mr-3 mt-0.5 ${
                                  controversy.severity === "High" ||
                                  controversy.severity === "Severe"
                                    ? "text-red-500"
                                    : controversy.severity === "Medium"
                                    ? "text-amber-500"
                                    : "text-yellow-500"
                                }`}
                              />
                              <div>
                                <div className="flex items-center">
                                  <div className="font-medium">
                                    {controversy.description}
                                  </div>
                                  <Badge
                                    variant={
                                      controversy.severity === "High" ||
                                      controversy.severity === "Severe"
                                        ? "destructive"
                                        : controversy.severity === "Medium"
                                        ? "default"
                                        : "outline"
                                    }
                                    className="ml-2"
                                  >
                                    {controversy.severity} Severity
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {new Date(
                                    controversy.date
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="inline-block p-3 rounded-full bg-gray-100 mb-4">
                      <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium">
                      No ESG Data Available
                    </h3>
                    <p className="text-gray-500 mt-1">
                      ESG information is not available for this company
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Data as of {new Date().toLocaleDateString()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchCompanyData(ticker)}
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <div className="inline-block p-3 rounded-full bg-gray-100 mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">No Company Selected</h3>
              <p className="text-gray-500 mt-1">
                Enter a ticker symbol to view company research
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
