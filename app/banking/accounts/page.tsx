"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/route";
import AccountListSection from "@/components/AccountListSection";
import { HeaderBox } from "@/components/HeaderBox";
import { getUserBankAccounts } from "@/lib/actions/banking.actions";
import { getServerAccount } from "@/lib/appwrite/server-config";

// Define types based on the actual structure
interface AccountType {
  $id: string;
  id: string;
  name: string;
  type: string;
  subtype: string;
  balance: number;
  isActive: boolean;
  bankName: string;
  mask: string;
  [key: string]: any; // For other properties
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        // Get the current user ID
        const account = await getServerAccount().get();
        const userId = account.$id;

        // Fetch accounts for this user
        const result = await getUserBankAccounts(userId);
        if (result.error) {
          console.error(result.error);
          setAccounts([]);
        } else {
          // Filter only banking accounts (non-investment)
          const bankingAccounts = (result.accounts || []).filter(
            (account: AccountType) =>
              account.type !== "investment" && account.subtype !== "investment"
          );
          setAccounts(bankingAccounts);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Transform accounts to match the expected AccountListSection format
  const formattedAccounts = accounts.map((account) => ({
    id: account.$id || account.id,
    name: account.name,
    mask: account.mask || "****",
    type: account.type,
    subtype: account.subtype,
    balance: account.balance,
    bankName: account.bankName || "Bank",
    isActive: account.isActive,
  }));

  return (
    <div className="p-6 space-y-6">
      <HeaderBox
        type="default"
        title="Your Accounts"
        subtitle="View and manage all your linked bank accounts"
      />

      {loading ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">Loading accounts...</p>
        </div>
      ) : (
        <AccountListSection
          accounts={formattedAccounts}
          showTransactions={true}
        />
      )}

      <div className="mt-6 flex justify-end">
        <Link
          href={ROUTES.CONNECT_BANK}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <span className="mr-2">+</span>
          Connect New Account
        </Link>
      </div>
    </div>
  );
}
