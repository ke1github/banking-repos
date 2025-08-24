"use client";

import React from "react";
import TabList, { TabItem } from "@/components/ui/TabList";

export default function PerformancePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">
          Investment Performance
        </h1>
        <p className="text-muted-foreground">
          Track and analyze how your investments are performing
        </p>
      </div>

      <TabList
        defaultValue="summary"
        className="w-full"
        variant="underline"
        pageStyle="default"
        tabsListClassName="grid w-full grid-cols-4 mb-8"
        items={[
          {
            value: "summary",
            label: "Summary",
            content: (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Performance Summary
                </h3>
                <div className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Performance summary chart would appear here
                  </p>
                </div>
              </div>
            ),
          },
          {
            value: "returns",
            label: "Returns",
            content: (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Historical Returns
                </h3>
                <div className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Returns visualization would appear here
                  </p>
                </div>
              </div>
            ),
          },
          {
            value: "allocation",
            label: "Allocation",
            content: (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Asset Allocation Performance
                </h3>
                <div className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Asset allocation performance would appear here
                  </p>
                </div>
              </div>
            ),
          },
          {
            value: "comparison",
            label: "Comparison",
            content: (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Benchmark Comparison
                </h3>
                <div className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Benchmark comparison would appear here
                  </p>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
