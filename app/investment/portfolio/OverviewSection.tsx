"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";
import { portfolioPerformance, assetAllocation } from "./data/mockData";

export const OverviewSection = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("3M");

  return (
    <div className="space-y-6">
      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Performance</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={
                  activeTimeframe === "1M" ? "bg-blue-50 border-blue-200" : ""
                }
                onClick={() => setActiveTimeframe("1M")}
              >
                1M
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={
                  activeTimeframe === "3M" ? "bg-blue-50 border-blue-200" : ""
                }
                onClick={() => setActiveTimeframe("3M")}
              >
                3M
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={
                  activeTimeframe === "YTD" ? "bg-blue-50 border-blue-200" : ""
                }
                onClick={() => setActiveTimeframe("YTD")}
              >
                YTD
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={
                  activeTimeframe === "1Y" ? "bg-blue-50 border-blue-200" : ""
                }
                onClick={() => setActiveTimeframe("1Y")}
              >
                1Y
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={
                  activeTimeframe === "ALL" ? "bg-blue-50 border-blue-200" : ""
                }
                onClick={() => setActiveTimeframe("ALL")}
              >
                All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={portfolioPerformance}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip
                formatter={(value) => [
                  `$${value.toLocaleString()}`,
                  "Portfolio Value",
                ]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  borderRadius: "8px",
                  padding: "10px",
                  borderColor: "#e2e8f0",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                fillOpacity={1}
                fill="url(#colorValue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Asset Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="type"
                    label={({ type, percent }) =>
                      `${type} ${percent ? (percent * 100).toFixed(0) : 0}%`
                    }
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.color.includes("blue")
                            ? "#4f46e5"
                            : entry.color.includes("indigo")
                            ? "#6366f1"
                            : entry.color.includes("purple")
                            ? "#a855f7"
                            : entry.color.includes("pink")
                            ? "#ec4899"
                            : entry.color.includes("orange")
                            ? "#f59e0b"
                            : "#9ca3af"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Value",
                    ]}
                    contentStyle={{
                      borderRadius: "8px",
                      padding: "10px",
                      borderColor: "#e2e8f0",
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {assetAllocation.map((asset, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{asset.type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {asset.percentage}%
                      </span>
                      <span className="text-sm font-medium">
                        ${asset.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${asset.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${asset.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
