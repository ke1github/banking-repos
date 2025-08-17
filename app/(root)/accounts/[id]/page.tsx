import React from "react";
import Link from "next/link";
import { getServerAccount } from "@/lib/appwrite/server-config";
import {
  getBankAccount,
  getAccountTransactions,
} from "@/lib/actions/banking.actions";
import TransactionsList, {
  type Transaction as UiTx,
} from "@/components/transactions/TransactionsList";

export const dynamic = "force-dynamic";

interface AccountDoc {
  $id: string;
  name?: string;
  accountNumber?: string;
  accountType?: string;
  balance?: number;
  bankName?: string;
  isActive?: boolean;
  officialName?: string;
  subtype?: string;
}

interface TxDoc {
  $id: string;
  amount?: number;
  description?: string;
  type?: string;
  createdAt?: string | Date;
  $createdAt?: string;
}

function isErrorRes(x: unknown): x is { error: string } {
  if (!x || typeof x !== "object") return false;
  const rec = x as Record<string, unknown>;
  return typeof rec.error === "string";
}

function hasAccount(x: unknown): x is { account: AccountDoc } {
  if (!x || typeof x !== "object") return false;
  const rec = x as Record<string, unknown>;
  return typeof rec.account === "object" && rec.account !== null;
}

function hasTransactions(x: unknown): x is { transactions: TxDoc[] } {
  if (!x || typeof x !== "object") return false;
  const rec = x as Record<string, unknown>;
  return Array.isArray(rec.transactions);
}

export default async function AccountDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Resolve user
  let userId: string | null = null;
  try {
    const account = getServerAccount();
    const user = await account.get();
    userId = user.$id;
  } catch {}

  if (!userId) {
    return (
      <section className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Account Details</h1>
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          You need to sign in to view this account.
        </div>
      </section>
    );
  }

  const details = await getBankAccount(userId, id);
  if (isErrorRes(details)) {
    return (
      <section className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Account Details</h1>
        <div className="bg-white border border-gray-100 rounded-lg p-4 text-red-600">
          {details.error}
        </div>
      </section>
    );
  }

  const acc: AccountDoc = hasAccount(details) ? details.account : { $id: id };

  const name = acc.name || acc.officialName || "Bank Account";
  const mask = (acc.accountNumber || "").slice(-4) || "0000";
  const type = acc.accountType || "checking";
  const balance =
    typeof acc.balance === "number" ? acc.balance : Number(acc.balance ?? 0);
  const bankName = acc.bankName || "—";

  const txRes = await getAccountTransactions(userId, id);
  const txDocs: TxDoc[] = hasTransactions(txRes) ? txRes.transactions : [];
  const items: UiTx[] = txDocs.map((t) => ({
    id: t.$id,
    date:
      t.$createdAt ||
      (t.createdAt instanceof Date
        ? t.createdAt.toISOString()
        : String(t.createdAt || new Date().toISOString())),
    description: t.description || "",
    category: t.type || "Transaction",
    amount: typeof t.amount === "number" ? t.amount : Number(t.amount ?? 0),
  }));

  return (
    <section className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Account Details</h1>
        <Link
          href="/transactions"
          className="text-blue-600 text-sm font-medium"
        >
          View Transactions
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-lg p-4 grid gap-2">
        <div className="text-sm text-gray-600">Account ID: {acc.$id}</div>
        <div className="text-lg font-medium">{name}</div>
        <div className="text-sm text-gray-700">
          Type: <span className="font-medium">{type}</span>
        </div>
        <div className="text-sm text-gray-700">
          Bank: <span className="font-medium">{bankName}</span>
        </div>
        <div className="text-sm text-gray-700">
          Mask: <span className="font-medium">•••• {mask}</span>
        </div>
        <div className="text-sm text-gray-700">
          Status:{" "}
          <span className="font-medium">
            {acc.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="text-base font-semibold mt-1">
          Balance: ₹
          {balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
        <TransactionsList items={items} />
      </div>
    </section>
  );
}
