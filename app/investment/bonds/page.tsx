"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function BondsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Bonds</h1>
        <p className="text-muted-foreground">
          Explore and manage your bond investments
        </p>
      </div>

      <Tabs defaultValue="my-bonds" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="my-bonds">My Bonds</TabsTrigger>
          <TabsTrigger value="explore">Explore Bonds</TabsTrigger>
          <TabsTrigger value="yield-curve">Yield Curve</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-bonds" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Your Bond Portfolio</h3>
            <div className="h-80 flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-4">You don't have any bonds yet</p>
              <Button>Start Investing</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="explore" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Explore Bonds</h3>
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Bond explorer would appear here</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="yield-curve" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Yield Curve</h3>
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Yield curve visualization would appear here</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
