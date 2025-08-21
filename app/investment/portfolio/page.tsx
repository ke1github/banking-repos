"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function PortfolioPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">My Portfolio</h1>
        <p className="text-muted-foreground">
          View and manage all your investments in one place
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-0">
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
                <div className="text-3xl font-bold text-green-500">+$1,204.85</div>
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
        </TabsContent>
        <TabsContent value="allocation" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Asset allocation chart would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="holdings" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Your Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Holdings table would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
