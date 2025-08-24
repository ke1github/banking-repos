"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Search,
  AlertCircle,
  Check,
  ArrowUpDown,
  DollarSign,
  Clock,
  ChevronRight,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ArrowLeftRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

// Mock data for trade functionality
const recentTrades = [
  {
    id: "TR-78945",
    symbol: "AAPL",
    type: "Buy",
    quantity: 5,
    price: 198.45,
    total: 992.25,
    status: "Completed",
    date: "Aug 24, 2025",
    time: "10:15 AM",
  },
  {
    id: "TR-78932",
    symbol: "MSFT",
    type: "Sell",
    quantity: 2,
    price: 410.34,
    total: 820.68,
    status: "Completed",
    date: "Aug 23, 2025",
    time: "3:42 PM",
  },
  {
    id: "TR-78921",
    symbol: "AMZN",
    type: "Buy",
    quantity: 3,
    price: 178.25,
    total: 534.75,
    status: "Completed",
    date: "Aug 23, 2025",
    time: "11:27 AM",
  },
  {
    id: "TR-78903",
    symbol: "GOOGL",
    type: "Buy",
    quantity: 2,
    price: 164.38,
    total: 328.76,
    status: "Completed",
    date: "Aug 22, 2025",
    time: "2:15 PM",
  },
  {
    id: "TR-78899",
    symbol: "TSLA",
    type: "Sell",
    quantity: 4,
    price: 215.65,
    total: 862.6,
    status: "Completed",
    date: "Aug 22, 2025",
    time: "10:32 AM",
  },
];

const openOrders = [
  {
    id: "OR-45621",
    symbol: "NVDA",
    type: "Buy",
    orderType: "Limit",
    quantity: 2,
    price: 800.0,
    total: 1600.0,
    status: "Open",
    date: "Aug 24, 2025",
    time: "9:45 AM",
  },
  {
    id: "OR-45615",
    symbol: "META",
    type: "Sell",
    orderType: "Stop",
    quantity: 3,
    price: 520.0,
    total: 1560.0,
    status: "Open",
    date: "Aug 24, 2025",
    time: "9:30 AM",
  },
];

// Mock stock quote for the trade form
const mockStockQuote = {
  symbol: "AAPL",
  name: "Apple Inc.",
  price: 198.45,
  change: 2.34,
  changePercent: 1.19,
  bid: 198.43,
  ask: 198.47,
  volume: "34.5M",
  avgVolume: "28.7M",
  dayRange: "196.42 - 199.10",
  yearRange: "165.80 - 215.35",
  marketCap: "$3.1T",
  pe: 32.5,
  eps: 6.12,
  dividend: 0.96,
  dividendYield: 0.48,
  exchange: "NASDAQ",
};

export default function StockTrading() {
  const [stockSymbol, setStockSymbol] = useState("AAPL");
  const [tradeType, setTradeType] = useState("buy");
  const [orderType, setOrderType] = useState("market");
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(mockStockQuote.price);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Calculate estimated cost
  const estimatedCost =
    quantity * (orderType === "market" ? mockStockQuote.price : limitPrice);

  // Handle trade form submission
  const handleSubmitTrade = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(true);
      // Reset confirmation after 5 seconds
      setTimeout(() => setShowConfirmation(false), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Trade Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <ArrowLeftRight className="h-5 w-5 mr-2 text-blue-600" />
                Stock Trading
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Buy and sell stocks with real-time quotes
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Market Hours: 9:30 AM - 4:00 PM ET</span>
              </div>
              <Badge className={`bg-green-100 text-green-800`}>
                Market Open
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter stock symbol (e.g., AAPL, MSFT, AMZN)..."
              className="pl-8"
              value={stockSymbol}
              onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Quote Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">
                  {mockStockQuote.symbol}
                </CardTitle>
                <Badge variant="outline">{mockStockQuote.exchange}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {mockStockQuote.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold">
                  ${mockStockQuote.price}
                </div>
                <div
                  className={`flex items-center ${
                    mockStockQuote.change >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {mockStockQuote.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  <span>
                    {mockStockQuote.change >= 0 ? "+" : ""}
                    {mockStockQuote.change} (
                    {mockStockQuote.changePercent >= 0 ? "+" : ""}
                    {mockStockQuote.changePercent}%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <div className="text-xs text-muted-foreground">Bid</div>
                  <div className="text-sm font-medium">
                    ${mockStockQuote.bid}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Ask</div>
                  <div className="text-sm font-medium">
                    ${mockStockQuote.ask}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Volume</div>
                  <div className="text-sm font-medium">
                    {mockStockQuote.volume}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Avg Volume
                  </div>
                  <div className="text-sm font-medium">
                    {mockStockQuote.avgVolume}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Day Range</div>
                  <div className="text-sm font-medium">
                    {mockStockQuote.dayRange}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    52-Week Range
                  </div>
                  <div className="text-sm font-medium">
                    {mockStockQuote.yearRange}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Market Cap
                  </div>
                  <div className="text-sm font-medium">
                    {mockStockQuote.marketCap}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">P/E Ratio</div>
                  <div className="text-sm font-medium">{mockStockQuote.pe}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">EPS</div>
                  <div className="text-sm font-medium">
                    ${mockStockQuote.eps}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Dividend Yield
                  </div>
                  <div className="text-sm font-medium">
                    {mockStockQuote.dividendYield}%
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Quote
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trade Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Place an Order</CardTitle>
            </CardHeader>
            <CardContent>
              {showConfirmation ? (
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-center">
                    Order Submitted Successfully
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Your {tradeType.toUpperCase()} order for {quantity} shares
                    of {stockSymbol} has been submitted.
                  </p>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm text-sm">
                    <div className="text-muted-foreground">Order Type:</div>
                    <div className="font-medium">
                      {orderType.charAt(0).toUpperCase() + orderType.slice(1)}
                    </div>

                    <div className="text-muted-foreground">Quantity:</div>
                    <div className="font-medium">{quantity} shares</div>

                    {orderType !== "market" && (
                      <>
                        <div className="text-muted-foreground">Price:</div>
                        <div className="font-medium">
                          ${limitPrice.toFixed(2)}
                        </div>
                      </>
                    )}

                    <div className="text-muted-foreground">
                      Estimated Total:
                    </div>
                    <div className="font-medium">
                      ${estimatedCost.toFixed(2)}
                    </div>
                  </div>
                  <Button
                    className="mt-4"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Place Another Order
                  </Button>
                </div>
              ) : (
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitTrade();
                  }}
                >
                  {/* Trade Type Selection */}
                  <div className="space-y-2">
                    <Label>Action</Label>
                    <RadioGroup
                      value={tradeType}
                      onValueChange={setTradeType}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buy" id="buy" />
                        <Label
                          htmlFor="buy"
                          className="font-normal cursor-pointer"
                        >
                          Buy
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sell" id="sell" />
                        <Label
                          htmlFor="sell"
                          className="font-normal cursor-pointer"
                        >
                          Sell
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Order Type */}
                  <div className="space-y-2">
                    <Label htmlFor="order-type">Order Type</Label>
                    <Select value={orderType} onValueChange={setOrderType}>
                      <SelectTrigger id="order-type">
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market Order</SelectItem>
                        <SelectItem value="limit">Limit Order</SelectItem>
                        <SelectItem value="stop">Stop Order</SelectItem>
                        <SelectItem value="stop-limit">
                          Stop Limit Order
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <p className="text-xs text-muted-foreground">
                      {orderType === "market" &&
                        "Market orders execute immediately at the current market price."}
                      {orderType === "limit" &&
                        "Limit orders execute only at your specified price or better."}
                      {orderType === "stop" &&
                        "Stop orders convert to market orders when the stock reaches your specified price."}
                      {orderType === "stop-limit" &&
                        "Stop-limit orders convert to limit orders when the stock reaches your specified stop price."}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(parseInt(e.target.value) || 1)
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Price (for limit and stop orders) */}
                  {orderType !== "market" && (
                    <div className="space-y-2">
                      <Label htmlFor="limit-price">
                        {orderType === "limit"
                          ? "Limit Price"
                          : orderType === "stop"
                          ? "Stop Price"
                          : "Stop-Limit Price"}
                      </Label>
                      <Input
                        id="limit-price"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={limitPrice}
                        onChange={(e) =>
                          setLimitPrice(
                            parseFloat(e.target.value) || mockStockQuote.price
                          )
                        }
                      />

                      <div className="pt-2">
                        <Label className="text-sm mb-2 block">
                          Price Range
                        </Label>
                        <Slider
                          defaultValue={[limitPrice]}
                          min={mockStockQuote.price * 0.9}
                          max={mockStockQuote.price * 1.1}
                          step={0.01}
                          onValueChange={(value) => setLimitPrice(value[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>
                            ${(mockStockQuote.price * 0.9).toFixed(2)}
                          </span>
                          <span>${mockStockQuote.price.toFixed(2)}</span>
                          <span>
                            ${(mockStockQuote.price * 1.1).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium">Order Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Symbol:</div>
                      <div className="font-medium">{stockSymbol}</div>

                      <div className="text-muted-foreground">Action:</div>
                      <div className="font-medium">
                        {tradeType === "buy" ? "Buy" : "Sell"}
                      </div>

                      <div className="text-muted-foreground">Order Type:</div>
                      <div className="font-medium">
                        {orderType.charAt(0).toUpperCase() + orderType.slice(1)}
                      </div>

                      <div className="text-muted-foreground">Quantity:</div>
                      <div className="font-medium">{quantity} shares</div>

                      {orderType !== "market" && (
                        <>
                          <div className="text-muted-foreground">Price:</div>
                          <div className="font-medium">
                            ${limitPrice.toFixed(2)}
                          </div>
                        </>
                      )}

                      <div className="text-muted-foreground">
                        Current Price:
                      </div>
                      <div className="font-medium">${mockStockQuote.price}</div>

                      <div className="text-muted-foreground font-medium pt-2">
                        Estimated Total:
                      </div>
                      <div className="font-bold text-base pt-2">
                        ${estimatedCost.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Place {tradeType === "buy" ? "Buy" : "Sell"} Order
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Disclaimer */}
                  <div className="text-xs text-muted-foreground border-t pt-4">
                    <AlertTriangle className="h-3 w-3 inline-block mr-1" />
                    <span>
                      Stock trading involves risk. Past performance is not
                      indicative of future results. Market orders execute at
                      prevailing market prices, which may differ from the last
                      quoted price.
                    </span>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order History Tabs */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="recent" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Recent Trades
          </TabsTrigger>
          <TabsTrigger value="open" className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Open Orders
          </TabsTrigger>
        </TabsList>

        {/* Recent Trades Tab */}
        <TabsContent value="recent">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs">
                      <th className="text-left font-medium p-2">DATE & TIME</th>
                      <th className="text-left font-medium p-2">ORDER ID</th>
                      <th className="text-left font-medium p-2">SYMBOL</th>
                      <th className="text-center font-medium p-2">TYPE</th>
                      <th className="text-right font-medium p-2">QUANTITY</th>
                      <th className="text-right font-medium p-2">PRICE</th>
                      <th className="text-right font-medium p-2">TOTAL</th>
                      <th className="text-right font-medium p-2">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentTrades.map((trade, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="p-2">
                          <div className="text-sm">{trade.date}</div>
                          <div className="text-xs text-muted-foreground">
                            {trade.time}
                          </div>
                        </td>
                        <td className="p-2 font-mono text-xs">{trade.id}</td>
                        <td className="p-2 font-medium">{trade.symbol}</td>
                        <td className="p-2 text-center">
                          <Badge
                            className={`${
                              trade.type === "Buy"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {trade.type}
                          </Badge>
                        </td>
                        <td className="p-2 text-right">{trade.quantity}</td>
                        <td className="p-2 text-right">
                          ${trade.price.toFixed(2)}
                        </td>
                        <td className="p-2 text-right font-medium">
                          ${trade.total.toFixed(2)}
                        </td>
                        <td className="p-2 text-right">
                          <Badge
                            variant="outline"
                            className="flex items-center justify-center gap-1"
                          >
                            <Check className="h-3 w-3" />
                            <span>{trade.status}</span>
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                View All Trades
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Open Orders Tab */}
        <TabsContent value="open">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Open Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {openOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-xs">
                        <th className="text-left font-medium p-2">
                          DATE & TIME
                        </th>
                        <th className="text-left font-medium p-2">ORDER ID</th>
                        <th className="text-left font-medium p-2">SYMBOL</th>
                        <th className="text-center font-medium p-2">TYPE</th>
                        <th className="text-center font-medium p-2">
                          ORDER TYPE
                        </th>
                        <th className="text-right font-medium p-2">QUANTITY</th>
                        <th className="text-right font-medium p-2">PRICE</th>
                        <th className="text-right font-medium p-2">TOTAL</th>
                        <th className="text-right font-medium p-2">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {openOrders.map((order, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="p-2">
                            <div className="text-sm">{order.date}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.time}
                            </div>
                          </td>
                          <td className="p-2 font-mono text-xs">{order.id}</td>
                          <td className="p-2 font-medium">{order.symbol}</td>
                          <td className="p-2 text-center">
                            <Badge
                              className={`${
                                order.type === "Buy"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.type}
                            </Badge>
                          </td>
                          <td className="p-2 text-center">
                            <Badge variant="outline">{order.orderType}</Badge>
                          </td>
                          <td className="p-2 text-right">{order.quantity}</td>
                          <td className="p-2 text-right">
                            ${order.price.toFixed(2)}
                          </td>
                          <td className="p-2 text-right font-medium">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="p-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Cancel
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    You have no open orders.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
