"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowLeft, LineChart, Briefcase, Search } from "lucide-react";

export default function BondsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonds</h1>
          <p className="text-muted-foreground">
            Explore and manage your bond investments
          </p>
        </div>
        <div className="flex gap-3">
          <ButtonLink
            href="/investment"
            variant="ghost"
            icon={<ArrowLeft className="h-4 w-4" />}
            shape="rounded"
            size="sm"
          >
            Back
          </ButtonLink>
          <ButtonLink
            href="/investment/calculators"
            section="investment"
            variant="outline"
            icon={<LineChart className="h-4 w-4" />}
            shape="rounded"
            size="sm"
          >
            Yield Calculator
          </ButtonLink>
        </div>
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
              <p className="text-muted-foreground mb-4">
                You don&apos;t have any bonds yet
              </p>
              <ButtonLink
                href="/investment/screener"
                section="investment"
                shape="rounded"
              >
                Start Investing
              </ButtonLink>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="explore" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Explore Bonds</h3>
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">
                Bond explorer would appear here
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <ButtonLink
                href="/investment/screener"
                section="investment"
                variant="outline"
                size="sm"
                icon={<Search className="h-4 w-4" />}
              >
                Go to Advanced Screener
              </ButtonLink>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="yield-curve" className="mt-0">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Yield Curve</h3>
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">
                Yield curve visualization would appear here
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
