"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function CalculatorsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Investment Calculators</h1>
        <p className="text-muted-foreground">
          Tools to help you make informed investment decisions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Compound Interest</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Calculate how your investments will grow over time with compound interest.
          </p>
          <Button className="w-full">Open Calculator</Button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Retirement Calculator</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Plan for retirement by estimating how much you need to save.
          </p>
          <Button className="w-full">Open Calculator</Button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">ROI Calculator</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Calculate the return on investment for your financial decisions.
          </p>
          <Button className="w-full">Open Calculator</Button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Mortgage Calculator</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Estimate monthly mortgage payments and total interest paid.
          </p>
          <Button className="w-full">Open Calculator</Button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Tax-Equivalent Yield</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Compare taxable and tax-free investment returns.
          </p>
          <Button className="w-full">Open Calculator</Button>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Determine the right mix of investments based on your risk tolerance.
          </p>
          <Button className="w-full">Open Calculator</Button>
        </div>
      </div>
    </div>
  );
}
