"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function MutualFundsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Mutual Funds</h1>
        <p className="text-muted-foreground">
          Explore and manage your mutual fund investments
        </p>
      </div>

      <Tabs defaultValue="my-funds" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="my-funds">My Funds</TabsTrigger>
          <TabsTrigger value="explore">Explore Funds</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-funds" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Your Mutual Fund Portfolio</h3>
            <div className="h-80 flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-4">You don't have any mutual funds yet</p>
              <Button>Start Investing</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="explore" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Explore Mutual Funds</h3>
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Fund explorer would appear here</p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Fund Performance</h3>
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Performance comparison would appear here</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
