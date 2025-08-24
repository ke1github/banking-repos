"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Filter,
  ChevronDown,
  Calendar,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { activityData } from "./data/mockData";

export const ActivitySection = () => {
  const [activityFilter, setActivityFilter] = useState("all");
  const [activityDateRange, setActivityDateRange] = useState("all");

  // Filter activity based on type and date range
  const filteredActivity = activityData.filter((activity) => {
    const matchesType =
      activityFilter === "all" ||
      activity.type.toLowerCase() === activityFilter.toLowerCase();

    // For simplicity, we're not implementing actual date filtering here
    return matchesType;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <CardTitle>Recent Activity</CardTitle>
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {activityFilter === "all"
                    ? "All Activities"
                    : `${activityFilter} Only`}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter By Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActivityFilter("all")}>
                  All Activities
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivityFilter("buy")}>
                  Buy Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivityFilter("sell")}>
                  Sell Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivityFilter("dividend")}>
                  Dividends
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivityFilter("deposit")}>
                  Deposits
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActivityFilter("withdrawal")}
                >
                  Withdrawals
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {activityDateRange === "all" ? "All Time" : activityDateRange}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter By Date</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActivityDateRange("all")}>
                  All Time
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActivityDateRange("Today")}>
                  Today
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActivityDateRange("This Week")}
                >
                  This Week
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActivityDateRange("This Month")}
                >
                  This Month
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActivityDateRange("Last 3 Months")}
                >
                  Last 3 Months
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Group activities by date */}
          {(() => {
            const groupedActivities: Record<string, typeof activityData> = {};
            filteredActivity.forEach((activity) => {
              if (!groupedActivities[activity.date]) {
                groupedActivities[activity.date] = [];
              }
              groupedActivities[activity.date].push(activity);
            });

            return Object.entries(groupedActivities).map(
              ([date, activities], groupIndex) => (
                <div
                  key={date}
                  className={groupIndex !== 0 ? "border-t pt-4" : ""}
                >
                  <p className="font-medium mb-4">
                    {date === new Date().toISOString().split("T")[0]
                      ? "Today"
                      : date ===
                        new Date(Date.now() - 86400000)
                          .toISOString()
                          .split("T")[0]
                      ? "Yesterday"
                      : date}
                  </p>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mt-1
                              ${
                                activity.type === "Buy"
                                  ? "bg-green-100"
                                  : activity.type === "Sell"
                                  ? "bg-red-100"
                                  : activity.type === "Dividend"
                                  ? "bg-blue-100"
                                  : activity.type === "Deposit"
                                  ? "bg-indigo-100"
                                  : activity.type === "Withdrawal"
                                  ? "bg-orange-100"
                                  : "bg-gray-100"
                              }`}
                          >
                            {activity.type === "Buy" ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : activity.type === "Sell" ? (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            ) : activity.type === "Dividend" ? (
                              <DollarSign className="h-5 w-5 text-blue-600" />
                            ) : activity.type === "Deposit" ? (
                              <ArrowUpRight className="h-5 w-5 text-indigo-600" />
                            ) : activity.type === "Withdrawal" ? (
                              <ArrowDownRight className="h-5 w-5 text-orange-600" />
                            ) : (
                              <Activity className="h-5 w-5 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {activity.type === "Buy"
                                ? `Bought ${activity.symbol}`
                                : activity.type === "Sell"
                                ? `Sold ${activity.symbol}`
                                : activity.type === "Dividend"
                                ? `${activity.symbol} Dividend`
                                : activity.type === "Deposit"
                                ? "Deposit"
                                : activity.type === "Withdrawal"
                                ? "Withdrawal"
                                : activity.type}
                            </p>
                            {(activity.type === "Buy" ||
                              activity.type === "Sell") &&
                              activity.shares &&
                              activity.price && (
                                <p className="text-sm text-muted-foreground">
                                  {activity.shares} shares at ${activity.price}
                                </p>
                              )}
                            {activity.type === "Dividend" && (
                              <p className="text-sm text-muted-foreground">
                                {activity.name} Quarterly Dividend
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {activity.date}, {activity.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              activity.type === "Buy" ||
                              activity.type === "Withdrawal"
                                ? ""
                                : activity.type === "Sell" ||
                                  activity.type === "Dividend" ||
                                  activity.type === "Deposit"
                                ? "text-green-600"
                                : ""
                            }`}
                          >
                            {activity.type === "Buy" ||
                            activity.type === "Withdrawal"
                              ? `-$${activity.value.toLocaleString()}`
                              : `+$${activity.value.toLocaleString()}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            );
          })()}

          <div className="flex justify-center mt-6">
            <Button variant="outline">
              View All Activity
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
