"use server";

import { revalidatePath } from "next/cache";
import {
  getAdminDatabases,
  getServerAccount,
} from "@/lib/appwrite/server-config";
import { ID, Query } from "appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import type { Models } from "node-appwrite";
import { validateWithZod } from "@/lib/helpers/validation-utils";
import { transferFormSchema } from "@/lib/validations";

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

type TransactionDocType = Models.Document & {
  description?: string;
  name?: string;
  type?: string;
  category?: string;
  amount?: number | string;
};

// Helper to ensure user is authenticated in Server Actions
async function requireUserId(): Promise<
  { ok: true; userId: string } | { error: "Please sign in" }
> {
  try {
    const account = getServerAccount();
    const user = await account.get();
    return { ok: true, userId: user.$id } as const;
  } catch {
    return { error: "Please sign in" } as const;
  }
}

/**
 * Get all bank accounts for a user
 */
export async function getUserBankAccounts(userId: string) {
  if (!userId) {
    return { error: "User not authenticated" };
  }

  try {
    const databases = getAdminDatabases();
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
    const databases = getAdminDatabases();
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
  const bankName = (formData.get("bankName") as string) || undefined;
  const bankBranch = (formData.get("bankBranch") as string) || undefined;

  if (!name) {
    return { error: "Account name is required" };
  }

  try {
    const databases = getAdminDatabases();
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
        bankName,
        branch: bankBranch,
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
    const databases = getAdminDatabases();

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
    const databases = getAdminDatabases();
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
    const databases = getAdminDatabases();

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

// Server Action wrapper: create a bank account for the authenticated user
export async function createBankAccountAction(
  _prev: unknown,
  formData: FormData
) {
  try {
    const auth = await requireUserId();
    if ("error" in auth) return auth;
    const res = await createBankAccount(auth.userId, formData);
    if ("error" in res) return res;
    return { ok: true as const, accountId: res.account.$id };
  } catch (err) {
    console.error("createBankAccountAction error", err);
    return { error: "Failed to create bank account" } as const;
  }
}

// Server Action wrapper: create a transaction for the authenticated user
export async function createTransactionAction(
  _prev: unknown,
  formData: FormData
) {
  try {
    const auth = await requireUserId();
    if ("error" in auth) return auth;

    // Convert FormData to object
    const formDataObj = Object.fromEntries(formData.entries());

    // Validate using our schema
    try {
      validateWithZod(transferFormSchema, {
        fromAccount: formDataObj.fromAccountId,
        toAccount: formDataObj.toAccountId,
        amount: formDataObj.amount,
        description: formDataObj.description || "",
      });
    } catch (validationError) {
      return {
        error:
          "Invalid transaction data: " + (validationError as Error).message,
      };
    }

    const res = await createTransaction(auth.userId, formData);
    if ("error" in res) return res;
    return { ok: true as const, transactionId: res.transaction.$id };
  } catch (err) {
    console.error("createTransactionAction error", err);
    return { error: "Failed to create transaction" } as const;
  }
}

/**
 * Set a bank account's active status (useful for cards)
 */
export async function setBankAccountActive(
  userId: string,
  accountId: string,
  isActive: boolean
) {
  if (!userId) return { error: "User not authenticated" };
  if (!accountId) return { error: "Account ID required" };
  try {
    const check = (await getBankAccount(userId, accountId)) as
      | { account: Record<string, unknown> }
      | { error: string };
    if ("error" in check) return check;
    const databases = getAdminDatabases();
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bankCollectionId,
      accountId,
      { isActive, updatedAt: new Date() }
    );
    revalidatePath(`/cards/${accountId}`);
    revalidatePath(`/cards-accounts`);
    return { ok: true } as const;
  } catch (error) {
    console.error("Failed to update account active status:", error);
    return { error: "Failed to update status" };
  }
}

/**
 * Set a bank account's priority flag (for highlighting a card)
 */
export async function setBankAccountPriority(
  userId: string,
  accountId: string,
  priority: boolean
) {
  if (!userId) return { error: "User not authenticated" };
  if (!accountId) return { error: "Account ID required" };
  try {
    const check = (await getBankAccount(userId, accountId)) as
      | { account: Record<string, unknown> }
      | { error: string };
    if ("error" in check) return check;
    const databases = getAdminDatabases();
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bankCollectionId,
      accountId,
      { priority, updatedAt: new Date() }
    );
    revalidatePath(`/cards/${accountId}`);
    revalidatePath(`/cards-accounts`);
    return { ok: true } as const;
  } catch (error) {
    console.error("Failed to update account priority:", error);
    return { error: "Failed to update priority" };
  }
}

// Server Actions (form-data based) for use from Client Components via props
export async function toggleCardActiveAction(_: unknown, formData: FormData) {
  // This file runs on the server; can resolve user here
  try {
    const auth = await requireUserId();
    if ("error" in auth) return auth;
    const accountId = String(formData.get("accountId") || "");
    const isActive = String(formData.get("isActive") || "false") === "true";
    if (!accountId) return { error: "Account ID required" } as const;
    const res = await setBankAccountActive(auth.userId, accountId, isActive);
    if ("error" in res) return res;
    return {
      ok: true as const,
      action: "active" as const,
      id: accountId,
      isActive,
    };
  } catch (err) {
    console.error("toggleCardActiveAction error", err);
    return { error: "Failed to toggle active" } as const;
  }
}

export async function toggleCardPriorityAction(_: unknown, formData: FormData) {
  try {
    const auth = await requireUserId();
    if ("error" in auth) return auth;
    const accountId = String(formData.get("accountId") || "");
    const priority = String(formData.get("priority") || "false") === "true";
    if (!accountId) return { error: "Account ID required" } as const;
    const res = await setBankAccountPriority(auth.userId, accountId, priority);
    if ("error" in res) return res;
    return {
      ok: true as const,
      action: "priority" as const,
      id: accountId,
      priority,
    };
  } catch (err) {
    console.error("toggleCardPriorityAction error", err);
    return { error: "Failed to toggle priority" } as const;
  }
}

// Server Action: fetch filtered transactions for the authenticated user
export async function fetchTransactionsAction(
  _prev: unknown,
  formData: FormData
) {
  try {
    const auth = await requireUserId();
    if ("error" in auth) return auth;

    const q = String(formData.get("q") || "").trim();
    const type =
      (formData.get("type") as "all" | "income" | "expense" | null) || "all";
    const from = (formData.get("from") as string | null) || null;
    const to = (formData.get("to") as string | null) || null;
    const sort =
      (formData.get("sort") as
        | "date-desc"
        | "date-asc"
        | "amount-desc"
        | "amount-asc") || "date-desc";
    const page = Math.max(1, Number(formData.get("page") || 1));
    const pageSize = Math.min(
      100,
      Math.max(1, Number(formData.get("pageSize") || 10))
    );

    const queries: string[] = [
      Query.equal("userId", auth.userId),
      Query.limit(pageSize),
      Query.offset((page - 1) * pageSize),
    ];

    if (type && type !== "all") {
      if (type === "income") queries.push(Query.greaterThanEqual("amount", 0));
      if (type === "expense") queries.push(Query.lessThan("amount", 0));
    }
    if (q) {
      queries.push(Query.search("description", q));
    }
    if (from) {
      const fromIso = new Date(from).toISOString();
      queries.push(Query.greaterThanEqual("$createdAt", fromIso));
    }
    if (to) {
      const toIso = new Date(to).toISOString();
      queries.push(Query.lessThanEqual("$createdAt", toIso));
    }

    switch (sort) {
      case "date-asc":
        queries.push(Query.orderAsc("$createdAt"));
        break;
      case "amount-desc":
        queries.push(Query.orderDesc("amount"));
        break;
      case "amount-asc":
        queries.push(Query.orderAsc("amount"));
        break;
      case "date-desc":
      default:
        queries.push(Query.orderDesc("$createdAt"));
    }

    const databases = getAdminDatabases();
    const res = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.transactionCollectionId,
      queries
    );

    const items = res.documents.map((doc: TransactionDocType) => ({
      id: doc.$id as string,
      date: (doc.$createdAt as string) || new Date().toISOString(),
      description: (doc.description as string) ?? (doc.name as string) ?? "",
      category:
        (doc.type as string) ?? (doc.category as string) ?? "Transaction",
      amount:
        typeof doc.amount === "number"
          ? (doc.amount as number)
          : Number(doc.amount ?? 0),
    }));

    return { ok: true as const, items, total: res.total as number };
  } catch (err) {
    console.error("fetchTransactionsAction error", err);
    return { error: "Failed to fetch transactions" } as const;
  }
}
