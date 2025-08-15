"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { transferFunds } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface TransferFormProps {
  accounts: Array<{
    id: string;
    name: string;
  }>;
}

// Submit button that shows loading state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="bank"
      size="lg"
      className="w-full"
      disabled={pending}
    >
      {pending ? "Processing..." : "Transfer Funds"}
    </Button>
  );
}

export default function TransferForm({ accounts }: TransferFormProps) {
  return (
    <Card>
      <form action={transferFunds}>
        <CardHeader>
          <CardTitle>Transfer Money</CardTitle>
          <CardDescription>
            Move money between your accounts safely and instantly.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="fromAccount"
            >
              From Account
            </label>
            <select
              id="fromAccount"
              name="fromAccount"
              className="w-full rounded-lg border border-input p-2 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            >
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="toAccount"
            >
              To Account
            </label>
            <select
              id="toAccount"
              name="toAccount"
              className="w-full rounded-lg border border-input p-2 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            >
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="amount"
            >
              Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                $
              </span>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                className="w-full rounded-lg border border-input p-2 pl-7 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
