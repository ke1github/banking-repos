"use client";

import React, { useState } from "react";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { transferFunds } from "@/lib/actions";
// Removing the useFormStatus hook that's causing the issue
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

// Submit button with controlled loading state
function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button
      type="submit"
      variant="default"
      size="lg"
      className="w-full text-sm sm:text-base py-2 sm:py-2.5"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Processing..." : "Transfer Funds"}
    </Button>
  );
}

export default function TransferForm({ accounts }: TransferFormProps) {
  // Use local state to track form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission manually
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Get form data
    const formData = new FormData(event.currentTarget);

    try {
      // Call the server action
      await transferFunds(formData);
    } catch (error) {
      console.error("Transfer failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit}>
        <CardHeader className="pb-2 sm:pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Logo variant="small" showText={false} />
            <CardTitle className="text-lg sm:text-xl font-semibold">
              Transfer Money
            </CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base">
            Move money between your accounts safely and instantly.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-5">
          <div className="space-y-1.5 sm:space-y-2">
            <label
              className="text-xs sm:text-sm font-medium text-foreground"
              htmlFor="fromAccount"
            >
              From Account
            </label>
            <select
              id="fromAccount"
              name="fromAccount"
              className="w-full rounded-lg border border-input p-2 sm:p-2.5 text-sm sm:text-base text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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

          <div className="space-y-1.5 sm:space-y-2">
            <label
              className="text-xs sm:text-sm font-medium text-foreground"
              htmlFor="toAccount"
            >
              To Account
            </label>
            <select
              id="toAccount"
              name="toAccount"
              className="w-full rounded-lg border border-input p-2 sm:p-2.5 text-sm sm:text-base text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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

          <div className="space-y-1.5 sm:space-y-2">
            <label
              className="text-xs sm:text-sm font-medium text-foreground"
              htmlFor="amount"
            >
              Amount
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                ₹
              </span>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                className="w-full rounded-lg border border-input p-2 sm:p-2.5 pl-7 text-sm sm:text-base text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2 sm:pt-4">
          <SubmitButton isSubmitting={isSubmitting} />
        </CardFooter>
      </form>
    </Card>
  );
}
