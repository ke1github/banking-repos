"use client";

import React from "react";
import Image from "next/image";
import Logo from "@/components/ui/logo";
import CardListSection from "@/components/CardListSection";
import AccountListSection from "@/components/AccountListSection";

// Sample data for demonstration
const sampleCards = [
  {
    id: "card1",
    type: "visa" as const,
    lastFourDigits: "4242",
    expiryDate: "12/25",
    cardholderName: "JOHN DOE",
    bankName: "ICICI Bank",
    availableCredit: 245000,
    isActive: true,
    priority: true,
  },
  {
    id: "card2",
    type: "mastercard" as const,
    lastFourDigits: "5555",
    expiryDate: "10/26",
    cardholderName: "JOHN DOE",
    bankName: "HDFC Bank",
    availableCredit: 175000,
    isActive: true,
  },
  {
    id: "card3",
    type: "amex" as const,
    lastFourDigits: "8888",
    expiryDate: "06/24",
    cardholderName: "JOHN DOE",
    bankName: "American Express",
    availableCredit: 500000,
    isActive: false,
  },
  {
    id: "card4",
    type: "rupay" as const,
    lastFourDigits: "9999",
    expiryDate: "08/27",
    cardholderName: "JOHN DOE",
    bankName: "SBI Card",
    availableCredit: 100000,
    isActive: true,
    customColors: {
      background: "bg-gradient-to-r from-purple-600 to-indigo-600",
      text: "text-white",
      accent: "text-purple-200",
    },
  },
];

const sampleAccounts = [
  {
    id: "acc1",
    name: "Salary Account",
    officialName: "Premium Savings",
    mask: "6789",
    type: "savings",
    subtype: "premium",
    balance: 78500,
    bankName: "ICICI Bank",
    isActive: true,
    lastTransaction: {
      amount: 42000,
      date: "14 Aug 2025",
      description: "Salary Credit - TechCorp",
      isCredit: true,
    },
    highlights: [
      { text: "Primary", color: "bg-blue-100 text-blue-700" },
      { text: "High Interest", color: "bg-green-100 text-green-700" },
    ],
  },
  {
    id: "acc2",
    name: "Personal Account",
    mask: "1234",
    type: "checking",
    subtype: "standard",
    balance: 35250,
    bankName: "HDFC Bank",
    isActive: true,
    lastTransaction: {
      amount: 5000,
      date: "13 Aug 2025",
      description: "ATM Withdrawal - MG Road",
      isCredit: false,
    },
  },
  {
    id: "acc3",
    name: "Fixed Deposit",
    mask: "5678",
    type: "fixed",
    subtype: "deposit",
    balance: 250000,
    bankName: "SBI",
    isActive: true,
    highlights: [
      { text: "Locked", color: "bg-yellow-100 text-yellow-700" },
      { text: "7.5% p.a.", color: "bg-green-100 text-green-700" },
    ],
  },
  {
    id: "acc4",
    name: "Joint Account",
    mask: "7890",
    type: "savings",
    subtype: "joint",
    balance: 125000,
    bankName: "Axis Bank",
    isActive: false,
  },
];

export default function CardsAndAccountsPage() {
  // Handlers for click events
  const handleCardClick = (id: string) => {
    console.log(`Card clicked: ${id}`);
    // In a real app, navigate to card details
  };

  const handleAccountClick = (id: string) => {
    console.log(`Account clicked: ${id}`);
    // In a real app, navigate to account details
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 max-w-7xl">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Logo variant="large" />
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          Banking Dashboard
        </h1>
      </div>

      {/* Main sections with cards and accounts */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm border border-gray-100">
          <CardListSection
            title="Your Payment Cards"
            cards={sampleCards}
            onCardClick={handleCardClick}
            animateCards={true}
            showPriority={true}
          />
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm border border-gray-100 mt-6 sm:mt-8">
          <AccountListSection
            title="Your Bank Accounts"
            accounts={sampleAccounts}
            onAccountClick={handleAccountClick}
            showTransactions={true}
            animateCards={true}
          />
        </div>
      </div>

      {/* Additional sections demonstrating other display modes */}
      <div className="mt-10 sm:mt-12 md:mt-16">
        <div className="flex items-center gap-3 mb-4 sm:mb-6 md:mb-8">
          <Image
            src="/icons/filter-lines.svg"
            alt="Categories"
            width={24}
            height={24}
            className="w-5 h-5 sm:w-6 sm:h-6"
          />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Account Categories
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 xl:gap-8">
          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
              <Image
                src="/icons/credit-card.svg"
                alt="Credit Cards"
                width={20}
                height={20}
              />
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Credit Cards
              </h3>
            </div>
            <CardListSection
              cards={sampleCards.filter(
                (card) => card.availableCredit !== undefined
              )}
              title=""
              showPriority={false}
            />
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 md:mb-6 text-gray-800">
              Savings Accounts
            </h3>
            <AccountListSection
              accounts={sampleAccounts.filter((acc) => acc.type === "savings")}
              title=""
              showTransactions={true}
            />
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 md:mb-6 text-gray-800">
              Fixed Deposits
            </h3>
            <AccountListSection
              accounts={sampleAccounts.filter((acc) => acc.type === "fixed")}
              title=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
