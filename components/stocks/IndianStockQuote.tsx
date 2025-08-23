"use client";

import React from "react";
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IndianStockData,
  isNSEStock,
  isBSEStock,
  formatIndianCurrency,
  formatIndianNumber,
  formatVolume,
} from "@/lib/types/indianStocks";
import { useSafeTimeFormat } from "@/lib/hooks/useSafeTimeFormat";

interface IndianStockQuoteProps {
  stock: IndianStockData;
  className?: string;
}

export default function IndianStockQuote({
  stock,
  className = "",
}: IndianStockQuoteProps) {
  const formattedTime = useSafeTimeFormat(new Date(stock.lastUpdate), "en-IN");

  const getPrice = () => {
    if (isNSEStock(stock)) {
      return stock.priceInfo.lastPrice;
    } else {
      return stock.currentPrice;
    }
  };

  const getChange = () => {
    if (isNSEStock(stock)) {
      return {
        absolute: stock.priceInfo.change,
        percentage: stock.priceInfo.pChange,
      };
    } else {
      return {
        absolute: stock.change,
        percentage: stock.percentChange,
      };
    }
  };

  const getOHLC = () => {
    if (isNSEStock(stock)) {
      return {
        open: stock.priceInfo.open,
        high: stock.priceInfo.intraDayHighLow.max,
        low: stock.priceInfo.intraDayHighLow.min,
        close: stock.priceInfo.close,
        previousClose: stock.priceInfo.previousClose,
      };
    } else {
      return {
        open: stock.open,
        high: stock.high,
        low: stock.low,
        close: stock.currentPrice,
        previousClose: stock.previousClose,
      };
    }
  };

  const getVolume = () => {
    if (isBSEStock(stock)) {
      return stock.volume;
    }
    return null;
  };

  const getCompanyName = () => {
    if (isNSEStock(stock)) {
      return stock.info.companyName;
    } else {
      return stock.companyName;
    }
  };

  const getSymbol = () => {
    if (isNSEStock(stock)) {
      return stock.info.symbol;
    } else {
      return stock.symbol;
    }
  };

  const price = getPrice();
  const change = getChange();
  const ohlc = getOHLC();
  const volume = getVolume();
  const isPositive = change.absolute >= 0;

  return (
    <Card className={`${className} hover:shadow-lg transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">
              {getSymbol()}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {getCompanyName()}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge
              className={`${
                stock.exchange === "NSE"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {stock.exchange}
            </Badge>
            {isBSEStock(stock) && stock.securityCode && (
              <Badge variant="outline" className="text-xs">
                {stock.securityCode}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatIndianCurrency(price)}
            </div>
            <div
              className={`flex items-center space-x-1 text-sm ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {formatIndianCurrency(change.absolute)}
              </span>
              <span>
                ({isPositive ? "+" : ""}
                {change.percentage.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formattedTime || "Loading..."}
            </div>
            <div className="text-xs text-gray-500 mt-1">{stock.source}</div>
          </div>
        </div>

        {/* OHLC Data */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Open:</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(ohlc.open)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">High:</span>
              <span className="text-sm font-medium text-green-600">
                {formatIndianCurrency(ohlc.high)}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Low:</span>
              <span className="text-sm font-medium text-red-600">
                {formatIndianCurrency(ohlc.low)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Prev Close:</span>
              <span className="text-sm font-medium">
                {formatIndianCurrency(ohlc.previousClose)}
              </span>
            </div>
          </div>
        </div>

        {/* Volume (BSE only for now) */}
        {volume && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Volume:</span>
              </div>
              <span className="text-sm font-medium">
                {formatVolume(volume)}
              </span>
            </div>
            {isBSEStock(stock) && stock.value && (
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-600">Value:</span>
                <span className="text-sm font-medium">
                  {formatIndianCurrency(stock.value)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Industry (NSE) */}
        {isNSEStock(stock) && stock.info.industry && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Industry:</span>
              <span className="text-sm font-medium">{stock.info.industry}</span>
            </div>
            {stock.metadata.isin && (
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-600">ISIN:</span>
                <span className="text-sm font-medium font-mono">
                  {stock.metadata.isin}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Week High/Low (NSE) */}
        {isNSEStock(stock) && stock.priceInfo.weekHighLow && (
          <div className="pt-3 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              52-Week Range
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">52W High:</span>
                <span className="text-sm font-medium text-green-600">
                  {formatIndianCurrency(stock.priceInfo.weekHighLow.max)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">52W Low:</span>
                <span className="text-sm font-medium text-red-600">
                  {formatIndianCurrency(stock.priceInfo.weekHighLow.min)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
