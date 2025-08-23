"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailedStock } from "@/lib/types/enhancedStockTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatIndianCurrency, formatVolume } from "@/lib/types/indianStocks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StockDetailsPanelProps {
  stock: DetailedStock;
  onClose?: () => void;
}

export default function StockDetailsPanel({
  stock,
  onClose,
}: StockDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const quarterlyData = stock.financials.quarterlyResults || [];
  const peers = stock.financials.peers || [];

  // Format quarterly data for charts
  const formattedQuarterlyData = quarterlyData.map((q) => ({
    name: q.quarter,
    revenue: q.revenue / 10000000, // Convert to crores
    netProfit: q.netProfit / 10000000, // Convert to crores
    eps: q.eps || 0,
  }));

  // Format peer comparison data for charts
  const peerPeRatios = peers.map((p) => ({
    name: p.symbol,
    pe: p.pe || 0,
  }));

  // Add current stock to peer comparison
  peerPeRatios.unshift({
    name: stock.symbol,
    pe: stock.financials.pe || 0,
  });

  return (
    <Card className="border border-gray-200 shadow-md w-full">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold">
                {stock.symbol}
              </CardTitle>
              <span className="text-gray-500">{stock.exchange}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{stock.name}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {formatIndianCurrency(stock.price)}
            </div>
            <div
              className={`text-sm ${
                stock.changePercent >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stock.changePercent >= 0 ? "+" : ""}
              {stock.changePercent.toFixed(2)}% ({stock.change >= 0 ? "+" : ""}
              {stock.change.toFixed(2)})
            </div>
          </div>
        </div>
      </CardHeader>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="px-6 pt-2 border-b">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly Results</TabsTrigger>
          <TabsTrigger value="peers">Peer Comparison</TabsTrigger>
          <TabsTrigger value="shareholding">Shareholding</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <div className="text-sm text-gray-500">Market Cap</div>
                  <div className="font-medium">
                    {formatIndianCurrency(stock.marketCap || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Sector</div>
                  <div className="font-medium">{stock.sector || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">P/E Ratio</div>
                  <div className="font-medium">
                    {stock.financials.pe?.toFixed(2) || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">P/B Ratio</div>
                  <div className="font-medium">
                    {stock.financials.pb?.toFixed(2) || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">ROE</div>
                  <div className="font-medium">
                    {stock.financials.roe?.toFixed(2) || "N/A"}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">ROCE</div>
                  <div className="font-medium">
                    {stock.financials.roce?.toFixed(2) || "N/A"}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Debt/Equity</div>
                  <div className="font-medium">
                    {stock.financials.debtToEquity?.toFixed(2) || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Dividend Yield</div>
                  <div className="font-medium">
                    {stock.financials.dividendYield?.toFixed(2) || "N/A"}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">52w High</div>
                  <div className="font-medium">
                    {formatIndianCurrency(stock.high52w || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">52w Low</div>
                  <div className="font-medium">
                    {formatIndianCurrency(stock.low52w || 0)}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quarterly Trend</h3>
              {quarterlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={formattedQuarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      name="Revenue (Cr)"
                    />
                    <Line
                      type="monotone"
                      dataKey="netProfit"
                      stroke="#82ca9d"
                      name="Net Profit (Cr)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  No quarterly data available
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quarterly" className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quarterly Results</h3>

          {quarterlyData.length > 0 ? (
            <>
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={formattedQuarterlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="revenue"
                      name="Revenue (Cr)"
                      fill="#8884d8"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="netProfit"
                      name="Net Profit (Cr)"
                      fill="#82ca9d"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quarter</TableHead>
                      <TableHead>Revenue (₹)</TableHead>
                      <TableHead>Net Profit (₹)</TableHead>
                      <TableHead>EPS (₹)</TableHead>
                      <TableHead>Sales Growth</TableHead>
                      <TableHead>Profit Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quarterlyData.map((quarter, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {quarter.quarter}
                        </TableCell>
                        <TableCell>
                          {formatIndianCurrency(quarter.revenue)}
                        </TableCell>
                        <TableCell>
                          {formatIndianCurrency(quarter.netProfit)}
                        </TableCell>
                        <TableCell>
                          {quarter.eps?.toFixed(2) || "N/A"}
                        </TableCell>
                        <TableCell
                          className={
                            quarter.salesGrowth && quarter.salesGrowth >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {quarter.salesGrowth
                            ? `${
                                quarter.salesGrowth >= 0 ? "+" : ""
                              }${quarter.salesGrowth.toFixed(2)}%`
                            : "N/A"}
                        </TableCell>
                        <TableCell
                          className={
                            quarter.profitGrowth && quarter.profitGrowth >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {quarter.profitGrowth
                            ? `${
                                quarter.profitGrowth >= 0 ? "+" : ""
                              }${quarter.profitGrowth.toFixed(2)}%`
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center py-8">
              No quarterly data available
            </div>
          )}
        </TabsContent>

        <TabsContent value="peers" className="p-6">
          <h3 className="text-lg font-semibold mb-4">Peer Comparison</h3>

          {peers.length > 0 ? (
            <>
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={peerPeRatios} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pe" name="P/E Ratio" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Price (₹)</TableHead>
                      <TableHead>Market Cap (₹)</TableHead>
                      <TableHead>P/E</TableHead>
                      <TableHead>ROE (%)</TableHead>
                      <TableHead>Debt/Equity</TableHead>
                      <TableHead>Div. Yield (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Current stock */}
                    <TableRow className="bg-blue-50">
                      <TableCell className="font-medium">
                        {stock.symbol}
                      </TableCell>
                      <TableCell>{formatIndianCurrency(stock.price)}</TableCell>
                      <TableCell>
                        {stock.marketCap
                          ? formatIndianCurrency(stock.marketCap)
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {stock.financials.pe?.toFixed(2) || "N/A"}
                      </TableCell>
                      <TableCell>
                        {stock.financials.roe?.toFixed(2) || "N/A"}
                      </TableCell>
                      <TableCell>
                        {stock.financials.debtToEquity?.toFixed(2) || "N/A"}
                      </TableCell>
                      <TableCell>
                        {stock.financials.dividendYield?.toFixed(2) || "N/A"}
                      </TableCell>
                    </TableRow>

                    {/* Peer stocks */}
                    {peers.map((peer, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {peer.symbol}
                        </TableCell>
                        <TableCell>
                          {formatIndianCurrency(peer.price)}
                        </TableCell>
                        <TableCell>
                          {formatIndianCurrency(peer.marketCap)}
                        </TableCell>
                        <TableCell>{peer.pe?.toFixed(2) || "N/A"}</TableCell>
                        <TableCell>{peer.roe?.toFixed(2) || "N/A"}</TableCell>
                        <TableCell>
                          {peer.debtToEquity?.toFixed(2) || "N/A"}
                        </TableCell>
                        <TableCell>
                          {peer.dividendYield?.toFixed(2) || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center py-8">
              No peer comparison data available
            </div>
          )}
        </TabsContent>

        <TabsContent value="shareholding" className="p-6">
          <h3 className="text-lg font-semibold mb-4">Shareholding Pattern</h3>

          {stock.financials.shareholdingPattern ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChartComponent
                    data={[
                      {
                        name: "Promoters",
                        value: stock.financials.shareholdingPattern.promoters,
                      },
                      {
                        name: "FII",
                        value: stock.financials.shareholdingPattern.fii,
                      },
                      {
                        name: "DII",
                        value: stock.financials.shareholdingPattern.dii,
                      },
                      {
                        name: "Public",
                        value: stock.financials.shareholdingPattern.public,
                      },
                      {
                        name: "Others",
                        value: stock.financials.shareholdingPattern.others,
                      },
                    ]}
                  />
                </ResponsiveContainer>
              </div>

              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Holding (%)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Promoters</TableCell>
                      <TableCell>
                        {stock.financials.shareholdingPattern.promoters}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Foreign Institutional Investors</TableCell>
                      <TableCell>
                        {stock.financials.shareholdingPattern.fii}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Domestic Institutional Investors</TableCell>
                      <TableCell>
                        {stock.financials.shareholdingPattern.dii}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Public</TableCell>
                      <TableCell>
                        {stock.financials.shareholdingPattern.public}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Others</TableCell>
                      <TableCell>
                        {stock.financials.shareholdingPattern.others}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="text-sm text-gray-500 mt-4">
                  As of: {stock.financials.shareholdingPattern.asOfDate}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              No shareholding data available
            </div>
          )}
        </TabsContent>

        <TabsContent value="technical" className="p-6">
          <h3 className="text-lg font-semibold mb-4">Technical Indicators</h3>

          {stock.financials.technicalIndicators ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-md font-semibold mb-2">
                  Price vs Moving Averages
                </h4>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Current Price</TableCell>
                      <TableCell className="font-medium">
                        {formatIndianCurrency(stock.price)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>50-Day MA</TableCell>
                      <TableCell
                        className={
                          stock.price >
                          (stock.financials.technicalIndicators.movingAverages
                            ?.ma50 || 0)
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {formatIndianCurrency(
                          stock.financials.technicalIndicators.movingAverages
                            ?.ma50 || 0
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>200-Day MA</TableCell>
                      <TableCell
                        className={
                          stock.price >
                          (stock.financials.technicalIndicators.movingAverages
                            ?.ma200 || 0)
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {formatIndianCurrency(
                          stock.financials.technicalIndicators.movingAverages
                            ?.ma200 || 0
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>RSI (14)</TableCell>
                      <TableCell
                        className={
                          stock.financials.technicalIndicators.rsi &&
                          stock.financials.technicalIndicators.rsi > 70
                            ? "text-red-600"
                            : stock.financials.technicalIndicators.rsi &&
                              stock.financials.technicalIndicators.rsi < 30
                            ? "text-green-600"
                            : ""
                        }
                      >
                        {stock.financials.technicalIndicators.rsi?.toFixed(2) ||
                          "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>MACD</TableCell>
                      <TableCell
                        className={
                          stock.financials.technicalIndicators.macd?.value &&
                          stock.financials.technicalIndicators.macd.value >
                            stock.financials.technicalIndicators.macd.signal
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {stock.financials.technicalIndicators.macd?.value.toFixed(
                          2
                        ) || "N/A"}
                        (
                        {stock.financials.technicalIndicators.macd?.signal.toFixed(
                          2
                        ) || "N/A"}
                        )
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div>
                <h4 className="text-md font-semibold mb-2">Price Range</h4>
                <div className="relative h-20 bg-gray-200 rounded-md my-4">
                  {stock.low52w && stock.high52w && (
                    <>
                      <div className="absolute h-full w-full flex items-center">
                        <div
                          className="absolute h-3 bg-blue-500 rounded-full"
                          style={{
                            left: `${
                              ((stock.price - stock.low52w) /
                                (stock.high52w - stock.low52w)) *
                              100
                            }%`,
                            transform: "translateX(-50%)",
                          }}
                        ></div>
                      </div>
                      <div className="absolute text-xs text-gray-700 -bottom-6 left-0">
                        52W Low: {formatIndianCurrency(stock.low52w)}
                      </div>
                      <div className="absolute text-xs text-gray-700 -bottom-6 right-0">
                        52W High: {formatIndianCurrency(stock.high52w)}
                      </div>
                      <div
                        className="absolute text-xs text-blue-700 -top-6"
                        style={{
                          left: `${
                            ((stock.price - stock.low52w) /
                              (stock.high52w - stock.low52w)) *
                            100
                          }%`,
                          transform: "translateX(-50%)",
                        }}
                      >
                        Current: {formatIndianCurrency(stock.price)}
                      </div>
                    </>
                  )}
                </div>

                <h4 className="text-md font-semibold mt-8 mb-2">
                  Technical Analysis
                </h4>
                <div className="border rounded-md p-4 bg-gray-50">
                  {renderTechnicalSummary(stock)}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              No technical indicator data available
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}

// Function to render technical analysis summary
function renderTechnicalSummary(stock: DetailedStock) {
  const technicalIndicators = stock.financials.technicalIndicators;

  if (!technicalIndicators) return <p>No technical data available</p>;

  const rsi = technicalIndicators.rsi || 0;
  const macdValue = technicalIndicators.macd?.value || 0;
  const macdSignal = technicalIndicators.macd?.signal || 0;
  const ma50 = technicalIndicators.movingAverages?.ma50 || 0;
  const ma200 = technicalIndicators.movingAverages?.ma200 || 0;

  let rsiStatus = "Neutral";
  if (rsi > 70) rsiStatus = "Overbought";
  else if (rsi < 30) rsiStatus = "Oversold";

  let macdStatus = "Neutral";
  if (macdValue > macdSignal) macdStatus = "Bullish";
  else if (macdValue < macdSignal) macdStatus = "Bearish";

  let maStatus = "Neutral";
  if (stock.price > ma50 && ma50 > ma200) maStatus = "Strong Bullish";
  else if (stock.price > ma50 && ma50 < ma200) maStatus = "Moderately Bullish";
  else if (stock.price < ma50 && ma50 > ma200) maStatus = "Moderately Bearish";
  else if (stock.price < ma50 && ma50 < ma200) maStatus = "Strong Bearish";

  let overallStatus = "Neutral";
  const bullishCount = [
    rsiStatus === "Oversold",
    macdStatus === "Bullish",
    maStatus.includes("Bullish"),
  ].filter(Boolean).length;

  const bearishCount = [
    rsiStatus === "Overbought",
    macdStatus === "Bearish",
    maStatus.includes("Bearish"),
  ].filter(Boolean).length;

  if (bullishCount > bearishCount) overallStatus = "Bullish";
  else if (bearishCount > bullishCount) overallStatus = "Bearish";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span>RSI (14):</span>
        <span
          className={
            rsiStatus === "Overbought"
              ? "text-red-600 font-medium"
              : rsiStatus === "Oversold"
              ? "text-green-600 font-medium"
              : "text-gray-600"
          }
        >
          {rsiStatus}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span>MACD:</span>
        <span
          className={
            macdStatus === "Bullish"
              ? "text-green-600 font-medium"
              : macdStatus === "Bearish"
              ? "text-red-600 font-medium"
              : "text-gray-600"
          }
        >
          {macdStatus}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span>Moving Averages:</span>
        <span
          className={
            maStatus.includes("Bullish")
              ? "text-green-600 font-medium"
              : maStatus.includes("Bearish")
              ? "text-red-600 font-medium"
              : "text-gray-600"
          }
        >
          {maStatus}
        </span>
      </div>

      <div className="border-t pt-2 mt-2">
        <div className="flex justify-between items-center font-medium">
          <span>Overall:</span>
          <span
            className={
              overallStatus === "Bullish"
                ? "text-green-600"
                : overallStatus === "Bearish"
                ? "text-red-600"
                : "text-gray-600"
            }
          >
            {overallStatus}
          </span>
        </div>
      </div>
    </div>
  );
}

// Simple PieChart component
function PieChartComponent({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <div>
        <h3 className="text-center mb-4">
          Chart placeholder - data visualization would go here
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry, index) => (
              <TableRow key={`row-${index}`}>
                <TableCell style={{ color: COLORS[index % COLORS.length] }}>
                  {entry.name}
                </TableCell>
                <TableCell>{entry.value}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ResponsiveContainer>
  );
}
