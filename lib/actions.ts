"use server";

// This is a server action that can be used to make a transfer between accounts
export async function transferFunds(formData: FormData) {
  // Validate the request
  const fromAccount = formData.get("fromAccount") as string;
  const toAccount = formData.get("toAccount") as string;
  const amount = parseFloat(formData.get("amount") as string);

  // Validation
  if (!fromAccount || !toAccount) {
    console.error("Both accounts are required");
    return; // Return void to satisfy the type
  }

  if (isNaN(amount) || amount <= 0) {
    console.error("Please enter a valid amount");
    return; // Return void to satisfy the type
  }

  try {
    // Here you would make a database call or API request
    // This is just a simulation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(
      `Successfully transferred $${amount} from ${fromAccount} to ${toAccount}`
    );
    // In a real app, you'd redirect or update UI state here
  } catch (err) {
    console.error("Transfer failed", err);
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
