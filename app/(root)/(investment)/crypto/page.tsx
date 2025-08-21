"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function CryptoPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency</h1>
        <p className="text-muted-foreground">
          Explore and manage your crypto investments
        </p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Your Crypto Portfolio</h3>
        <div className="h-80 flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-4">You don't have any cryptocurrencies yet</p>
          <Button>Start Investing</Button>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">Crypto market data would appear here</p>
        </div>
      </div>
    </div>
  );
}
