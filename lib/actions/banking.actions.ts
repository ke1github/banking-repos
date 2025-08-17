"use server";

import { revalidatePath } from "next/cache";
import { getServerDatabases } from "@/lib/appwrite/server-config";
import { ID, Query } from "appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";

export type TransactionType = "deposit" | "withdrawal" | "transfer";

export interface BankAccount {
  id: string;
  userId: string;
  accountNumber: string;
  routingNumber: string;
  accountType: "checking" | "savings" | "credit";
  balance: number;
  currency: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  toAccountId?: string;
  amount: number;
  type: TransactionType;
  description: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

/**
 * Get all bank accounts for a user
 */
export async function getUserBankAccounts(userId: string) {
  if (!userId) {
    return { error: "User not authenticated" };
  }

  try {
    const databases = getServerDatabases();
    const accounts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bankCollectionId,
      [Query.equal("userId", userId)]
    );

    return { accounts: accounts.documents };
  } catch (error) {
    console.error("Failed to fetch bank accounts:", error);
    return { error: "Failed to fetch bank accounts" };
  }
}

/**
 * Get a specific bank account
 */
export async function getBankAccount(userId: string, accountId: string) {
  if (!userId) {
    return { error: "User not authenticated" };
  }

  try {
    const databases = getServerDatabases();
    const account = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bankCollectionId,
      accountId
    );

    // Verify account belongs to user
    if (account.userId !== userId) {
      return { error: "Unauthorized access to account" };
    }

    return { account };
  } catch (error) {
    console.error("Failed to fetch bank account:", error);
    return { error: "Failed to fetch bank account" };
  }
}

/**
 * Create a new bank account
 */
export async function createBankAccount(userId: string, formData: FormData) {
  if (!userId) {
    return { error: "User not authenticated" };
  }

  const name = formData.get("name") as string;
  const accountType =
    (formData.get("accountType") as "checking" | "savings" | "credit") ||
    "checking";
  const currency = (formData.get("currency") as string) || "USD";
  const initialBalance = Number(formData.get("initialBalance") || 0);

  if (!name) {
    return { error: "Account name is required" };
  }

  try {
    const databases = getServerDatabases();
    const accountNumber = Math.floor(
      Math.random() * 9000000000 + 1000000000
    ).toString();

    const newAccount = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bankCollectionId,
      ID.unique(),
      {
        userId,
        accountNumber,
        routingNumber: "021000021", // Example routing number
        accountType,
        balance: initialBalance,
        currency,
        name,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    );

    revalidatePath("/dashboard");
    return { account: newAccount };
  } catch (error) {
    console.error("Failed to create bank account:", error);
    return { error: "Failed to create bank account" };
  }
}

/**
 * Get transactions for a specific account
 */
export async function getAccountTransactions(
  userId: string,
  accountId: string
) {
  if (!userId) {
    return { error: "User not authenticated" };
  }

  try {
    const databases = getServerDatabases();

    // Verify account belongs to user first
    const account = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bankCollectionId,
      accountId
    );

    if (account.userId !== userId) {
      return { error: "Unauthorized access to account" };
    }

    const transactions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.transactionCollectionId,
      [Query.equal("accountId", accountId)]
    );

    return { transactions: transactions.documents };
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return { error: "Failed to fetch transactions" };
  }
}

/**
 * Get all transactions for a user
 */
export async function getUserTransactions(userId: string) {
  if (!userId) {
    return { error: "User not authenticated" };
  }

  try {
    const databases = getServerDatabases();
    const transactions = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.transactionCollectionId,
      [Query.equal("userId", userId)]
    );

    return { transactions: transactions.documents };
  } catch (error) {
    console.error("Failed to fetch user transactions:", error);
    return { error: "Failed to fetch user transactions" };
  }
}

/**
 * Create a new transaction (deposit, withdrawal, transfer)
 */
export async function createTransaction(userId: string, formData: FormData) {
  if (!userId) {
    return { error: "User not authenticated" };
  }

  const accountId = formData.get("accountId") as string;
  const amount = Number(formData.get("amount"));
  const type = formData.get("type") as TransactionType;
  const description = (formData.get("description") as string) || "";
  const toAccountId = (formData.get("toAccountId") as string) || undefined;

  if (!accountId || !amount || !type) {
    return { error: "Account, amount, and transaction type are required" };
  }

  if (amount <= 0) {
    return { error: "Amount must be greater than zero" };
  }

  try {
    const databases = getServerDatabases();

    // Verify account belongs to user
    const accountResult = await getBankAccount(userId, accountId);
    if (accountResult.error) {
      return { error: accountResult.error };
    }

    // TypeScript check to ensure account exists
    if (!accountResult.account) {
      return { error: "Account not found" };
    }

    const account = accountResult.account;

    // For deposits and withdrawals
    if (type === "deposit" || type === "withdrawal") {
      // Update account balance
      let newBalance = account.balance;
      if (type === "deposit") {
        newBalance += amount;
      } else {
        // Check if sufficient funds for withdrawal
        if (account.balance < amount) {
          return { error: "Insufficient funds" };
        }
        newBalance -= amount;
      }

      // Update account balance
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.bankCollectionId,
        accountId,
        {
          balance: newBalance,
          updatedAt: new Date(),
        }
      );
    }

    // For transfers
    if (type === "transfer" && toAccountId) {
      // Get destination account
      const toAccountResult = await getBankAccount(userId, toAccountId);
      if (toAccountResult.error) {
        return { error: toAccountResult.error };
      }

      // TypeScript check to ensure destination account exists
      if (!toAccountResult.account) {
        return { error: "Destination account not found" };
      }

      const toAccount = toAccountResult.account;

      // Check if sufficient funds
      if (account.balance < amount) {
        return { error: "Insufficient funds" };
      }

      // Update from account balance
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.bankCollectionId,
        accountId,
        {
          balance: account.balance - amount,
          updatedAt: new Date(),
        }
      );

      // Update to account balance
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.bankCollectionId,
        toAccountId,
        {
          balance: toAccount.balance + amount,
          updatedAt: new Date(),
        }
      );
    }

    // Create the transaction record
    const transaction = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.transactionCollectionId,
      ID.unique(),
      {
        userId,
        accountId,
        toAccountId: toAccountId || null,
        amount,
        type,
        description: description || "",
        status: "completed",
        createdAt: new Date(),
      }
    );

    revalidatePath("/dashboard");
    return { transaction };
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to create transaction",
    };
  }
}
