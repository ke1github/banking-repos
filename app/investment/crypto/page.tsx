"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowLeft, Coins, BarChart } from "lucide-react";

export default function CryptoPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cryptocurrency</h1>
          <p className="text-muted-foreground">
            Explore and manage your crypto investments
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
            href="/investment/screener"
            section="investment"
            variant="outline"
            icon={<BarChart className="h-4 w-4" />}
            shape="rounded"
            size="sm"
          >
            Market Data
          </ButtonLink>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Your Crypto Portfolio</h3>
        <div className="h-80 flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-4">
            You don't have any cryptocurrencies yet
          </p>
          <ButtonLink
            href="/investment/screener"
            section="investment"
            shape="rounded"
            icon={<Coins className="h-4 w-4" />}
          >
            Start Investing
          </ButtonLink>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">
            Crypto market data would appear here
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <ButtonLink
            href="/investment/screener?filter=crypto"
            section="investment"
            variant="outline"
            size="sm"
            icon={<BarChart className="h-4 w-4" />}
          >
            View Market Data
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
