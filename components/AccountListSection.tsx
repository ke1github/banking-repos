"use client";

import React from "react";
import AccountCard from "./AccountCard";
import { useRouter } from "next/navigation";

interface AccountData {
  id: string;
  name: string;
  officialName?: string;
  mask: string;
  type: string;
  subtype: string;
  balance: number;
  bankLogo?: string;
  bankName: string;
  isActive: boolean;
  lastTransaction?: {
    amount: number;
    date: string;
    description: string;
    isCredit: boolean;
  };
  highlights?: {
    text: string;
    color: string;
  }[];
}

interface AccountListSectionProps {
  accounts: AccountData[];
  onAccountClick?: (id: string) => void;
  title?: string;
  showTransactions?: boolean;
  animateCards?: boolean;
  showEmptyState?: boolean;
}

/**
 * AccountListSection - A component to display a list of bank accounts
 * This is an example of how to use the AccountCard component
 */
export default function AccountListSection({
  accounts,
  onAccountClick,
  title = "Your Accounts",
  showTransactions = false,
  animateCards = true,
  showEmptyState = true,
}: AccountListSectionProps) {
  const router = useRouter();

  // Default click handler if none provided
  const handleAccountClick = (id: string) => {
    onAccountClick ? onAccountClick(id) : router.push(`/accounts/${id}`);
  };

  if (!accounts || accounts.length === 0) {
    if (!showEmptyState) return null;

    return (
      <div className="py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
        <p className="text-gray-500 mb-2">No accounts available</p>
        <button
          onClick={() => router.push("/connect-bank")}
          className="text-blue-600 text-sm font-medium"
        >
          + Connect a bank account
        </button>
      </div>
    );
  }

  // Calculate total balance
  const totalBalance = accounts.reduce((total, account) => {
    return total + (account.isActive ? account.balance : 0);
  }, 0);

  // Count active accounts
  const activeAccountsCount = accounts.filter(
    (account) => account.isActive
  ).length;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        {title && (
          <div>
            <h2 className="font-semibold text-base sm:text-lg md:text-xl">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              {activeAccountsCount} active accounts
            </p>
          </div>
        )}
        <div className="text-left sm:text-right">
          <p className="text-xs sm:text-sm text-gray-500">Total Balance</p>
          <p className="text-base sm:text-lg md:text-xl font-semibold">
            ₹
            {totalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            id={account.id}
            name={account.name}
            officialName={account.officialName}
            mask={account.mask}
            type={account.type}
            subtype={account.subtype}
            balance={account.balance}
            bankLogo={account.bankLogo}
            bankName={account.bankName}
            isActive={account.isActive}
            animateOnHover={animateCards}
            showTransactions={showTransactions}
            lastTransaction={account.lastTransaction}
            highlights={account.highlights}
            onClick={() => handleAccountClick(account.id)}
          />
        ))}
      </div>
    </div>
  );
}
