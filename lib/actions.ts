"use server";

import { transferFormSchema } from "./validations";

// This is a server action that can be used to make a transfer between accounts
export async function transferFunds(formData: FormData) {
  // Parse and validate form data
  try {
    const rawData = {
      fromAccount: formData.get("fromAccount") as string,
      toAccount: formData.get("toAccount") as string,
      amount: parseFloat(formData.get("amount") as string),
      description: (formData.get("description") as string) || undefined,
    };

    // Validate with Zod schema
    const validatedData = transferFormSchema.parse(rawData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(
      `Successfully transferred $${validatedData.amount} from ${validatedData.fromAccount} to ${validatedData.toAccount}`
    );

    return { success: true, message: "Transfer completed successfully" };
  } catch (err) {
    console.error("Transfer failed", err);
    return { success: false, message: "Transfer failed. Please try again." };
  }
}

// Server action to get account balance
export async function getAccountBalance(accountId: string) {
  // Simulate a delay like a real API call would have
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data - in a real app this would come from a database
  const accounts: Record<string, number> = {
    checking: 2500.75,
    savings: 15000.5,
    investment: 7500.25,
  };

  // Return the account balance or a default value
  return {
    balance: accounts[accountId] || 0,
    lastUpdated: new Date().toISOString(),
  };
}
