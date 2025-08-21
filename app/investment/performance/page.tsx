"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function PerformancePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Investment Performance</h1>
        <p className="text-muted-foreground">
          Track and analyze how your investments are performing
        </p>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Performance summary chart would appear here</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="returns" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Historical Returns</h3>
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Returns visualization would appear here</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="allocation" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Asset Allocation Performance</h3>
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Asset allocation performance would appear here</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Benchmark Comparison</h3>
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Benchmark comparison would appear here</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
