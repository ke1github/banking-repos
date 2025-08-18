import React from "react";
import Link from "next/link";
import { getServerAccount } from "@/lib/appwrite/server-config";
import {
  getBankAccount,
  getAccountTransactions,
  setBankAccountActive,
  setBankAccountPriority,
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
  priority?: boolean;
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

export default async function CardDetailsPage({
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
  } catch (e) {
    console.error("Error fetching user account:", e);
  }

  if (!userId) {
    return (
      <section className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Card Details</h1>
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          You need to sign in to view this card.
        </div>
      </section>
    );
  }

  const details = await getBankAccount(userId, id);
  if (isErrorRes(details)) {
    return (
      <section className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Card Details</h1>
        <div className="bg-white border border-gray-100 rounded-lg p-4 text-red-600">
          {details.error}
        </div>
      </section>
    );
  }

  const acc: AccountDoc = hasAccount(details) ? details.account : { $id: id };

  const label = acc.name || "Credit Card";
  const mask = (acc.accountNumber || "").slice(-4) || "0000";
  const available =
    typeof acc.balance === "number" ? acc.balance : Number(acc.balance ?? 0);
  const bankName = acc.bankName || label;
  const priority = Boolean(acc.priority);

  const tx = await getAccountTransactions(userId, id);
  const txDocs: TxDoc[] = hasTransactions(tx) ? tx.transactions : [];
  const items: UiTx[] = txDocs.slice(0, 6).map((t) => ({
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
        <h1 className="text-2xl font-semibold">Card Details</h1>
        <Link
          href="/cards-accounts"
          className="text-blue-600 text-sm font-medium"
        >
          Back to Cards
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-lg p-4 grid gap-3">
        <div className="text-sm text-gray-600">Card ID: {acc.$id}</div>
        <div className="text-lg font-medium">{label}</div>
        <div className="text-sm text-gray-700">
          Bank: <span className="font-medium">{bankName}</span>
        </div>
        <div className="text-sm text-gray-700">
          Number: <span className="font-medium">•••• {mask}</span>
        </div>
        <div className="text-base font-semibold mt-1">
          Available: ₹{available.toLocaleString("en-IN")}
        </div>
        <div className="text-sm text-gray-700">
          Status: {acc.isActive ? "Active" : "Inactive"}{" "}
          {priority && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-100 text-yellow-800">
              Priority
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 flex flex-wrap gap-2">
          {/* Toggle Active */}
          <form
            action={async () => {
              "use server";
              const account = getServerAccount();
              const user = await account.get();
              // Confirmation for deactivation
              // Note: window.confirm isn't available server-side; this is a server action.
              // For simplicity we just perform the toggle here; client page can use the grid quick actions with confirm.
              await setBankAccountActive(user.$id, id, !Boolean(acc.isActive));
            }}
          >
            <button
              type="submit"
              className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                acc.isActive
                  ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              }`}
            >
              {acc.isActive ? "Deactivate" : "Activate"}
            </button>
          </form>

          {/* Toggle Priority */}
          <form
            action={async () => {
              "use server";
              const account = getServerAccount();
              const user = await account.get();
              await setBankAccountPriority(user.$id, id, !priority);
            }}
          >
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md text-sm font-medium border bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
            >
              {priority ? "Unset Priority" : "Mark Priority"}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Recent Transactions</h2>
        <TransactionsList items={items} />
      </div>
    </section>
  );
}
