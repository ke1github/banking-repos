"use client";

import React, { useState } from "react";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { transferFunds } from "@/lib/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transferFormSchema, TransferFormValues } from "@/lib/validations";
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
  const [submissionStatus, setSubmissionStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  // Use react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      fromAccount: "",
      toAccount: "",
      amount: undefined,
      description: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: TransferFormValues) => {
    setSubmissionStatus({});

    try {
      // Convert data to FormData for server action
      const formData = new FormData();
      formData.append("fromAccount", data.fromAccount);
      formData.append("toAccount", data.toAccount);
      formData.append("amount", data.amount!.toString());
      if (data.description) {
        formData.append("description", data.description);
      }

      // Call the server action
      const result = await transferFunds(formData);

      if (result.success) {
        setSubmissionStatus({
          success: true,
          message: result.message || "Transfer completed successfully",
        });
        reset(); // Reset form on success
      } else {
        setSubmissionStatus({
          success: false,
          message: result.message || "Transfer failed",
        });
      }
    } catch (error) {
      console.error("Transfer failed:", error);
      setSubmissionStatus({
        success: false,
        message: "An unexpected error occurred",
      });
    }
  };

  return (
    <Card className="shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit(onSubmit)}>
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

        {submissionStatus.message && (
          <div
            className={`mx-6 p-2 text-sm rounded ${
              submissionStatus.success
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {submissionStatus.message}
          </div>
        )}

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
              {...register("fromAccount")}
              className="w-full rounded-lg border border-input p-2 sm:p-2.5 text-sm sm:text-base text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {errors.fromAccount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fromAccount.message}
              </p>
            )}
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
              {...register("toAccount")}
              className="w-full rounded-lg border border-input p-2 sm:p-2.5 text-sm sm:text-base text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {errors.toAccount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.toAccount.message}
              </p>
            )}
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
                {...register("amount", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full rounded-lg border border-input p-2 sm:p-2.5 pl-7 text-sm sm:text-base text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label
              className="text-xs sm:text-sm font-medium text-foreground"
              htmlFor="description"
            >
              Description (Optional)
            </label>
            <input
              id="description"
              {...register("description")}
              type="text"
              placeholder="What's this transfer for?"
              className="w-full rounded-lg border border-input p-2 sm:p-2.5 text-sm sm:text-base text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </CardContent>

        <CardFooter className="pt-2 sm:pt-4">
          <SubmitButton isSubmitting={isSubmitting} />
        </CardFooter>
      </form>
    </Card>
  );
}
