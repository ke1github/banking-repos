"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TabList, { TabItem } from "@/components/ui/TabList";

export default function PortfolioPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">My Portfolio</h1>
        <p className="text-muted-foreground">
          View and manage all your investments in one place
        </p>
      </div>

      <TabList
        defaultValue="overview"
        variant="underline"
        pageStyle="default"
        className="w-full"
        tabsListClassName="grid w-full grid-cols-3 mb-8"
        items={[
          {
            value: "overview",
            label: "Overview",
            content: (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$128,430.00</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      +$24,908 (24.1%) all time
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Change</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500">
                      +$1,204.85
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      +0.94% today
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Buying Power</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">$12,234.56</div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Available to invest
                    </p>
                  </CardContent>
                </Card>
              </div>
            ),
          },
          {
            value: "allocation",
            label: "Asset Allocation",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Asset allocation chart would appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            ),
          },
          {
            value: "holdings",
            label: "Holdings",
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Your Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Holdings table would appear here
                    </p>
                  </div>
                </CardContent>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
