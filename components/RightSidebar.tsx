"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/route";
import BankCard from "./cards/BankCard";
import AccountCard from "./AccountCard";

interface CardData {
  id: string;
  type: "visa" | "mastercard" | "amex" | "rupay";
  lastFourDigits: string;
  expiryDate: string;
  cardholderName: string;
  bankName: string;
  balance?: number;
  availableCredit?: number;
  isActive: boolean;
}

interface BankAccountData {
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
}

interface RightSidebarProps {
  user: {
    firstName: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  };
  bankAccounts?: BankAccountData[];
  cards?: CardData[];
}

const RightSidebar = ({
  user,
  bankAccounts = [],
  cards = [],
}: RightSidebarProps) => {
  const [activeTab, setActiveTab] = useState<"accounts" | "cards">("accounts");

  // Handlers for component interactions
  const handleAccountClick = (accountId: string) => {
    console.log(`Navigate to account details: ${accountId}`);
    // Future implementation: router.push(`/accounts/${accountId}`);
  };

  const handleCardClick = (cardId: string) => {
    console.log(`Navigate to card details: ${cardId}`);
    // Future implementation: router.push(`/cards/${cardId}`);
  };

  // Calculate total balance from all accounts
  const totalBalance = bankAccounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  return (
    <aside className="right-sidebar">
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-banner"></div>
        <div className="profile">
          <div className="profile-avatar">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full border-4 border-white bg-white"
              />
            ) : (
              <div className="w-16 h-16 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white text-24 font-semibold">
                {user.firstName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-info mt-4 text-center">
            <h3 className="text-16 font-semibold">
              {user.firstName} {user.lastName}
            </h3>
            {user.email && (
              <p className="text-12 text-gray-500">{user.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Total Balance Section */}
      <div className="px-4 py-3 border-y border-gray-100">
        <p className="text-12 text-gray-500 mb-1">Total Balance</p>
        <h3 className="text-18 font-semibold text-blue-700">
          ₹{totalBalance.toLocaleString("en-IN")}
        </h3>
        <p className="text-12 text-gray-500 mt-1">
          {bankAccounts.length}{" "}
          {bankAccounts.length === 1 ? "account" : "accounts"}
        </p>
      </div>

      {/* Tabs for switching between accounts and cards */}
      <div className="px-4 mt-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 text-14 font-medium ${
              activeTab === "accounts"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("accounts")}
          >
            Bank Accounts
          </button>
          <button
            className={`py-2 px-4 text-14 font-medium ${
              activeTab === "cards"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("cards")}
          >
            Cards
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 py-4 flex-1 overflow-y-auto">
        {activeTab === "accounts" ? (
          <div className="accounts-list">
            {bankAccounts.length > 0 ? (
              bankAccounts.map((account) => (
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
                  onClick={() => handleAccountClick(account.id)}
                />
              ))
            ) : (
              <div className="empty-state text-center py-8">
                <Image
                  src="/icons/connect-bank.svg"
                  alt="No accounts"
                  width={48}
                  height={48}
                  className="mx-auto mb-4 opacity-60"
                />
                <p className="text-14 text-gray-500 mb-2">
                  No bank accounts connected
                </p>
                <Link
                  href={ROUTES.CONNECT_BANK}
                  className="text-14 text-blue-600 font-medium"
                >
                  + Connect a bank
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="cards-list">
            {cards.length > 0 ? (
              cards.map((card) => (
                <BankCard
                  key={card.id}
                  id={card.id}
                  type={card.type}
                  lastFourDigits={card.lastFourDigits}
                  expiryDate={card.expiryDate}
                  cardholderName={card.cardholderName}
                  bankName={card.bankName}
                  balance={card.balance}
                  availableCredit={card.availableCredit}
                  isActive={card.isActive}
                  variant="gradient"
                  onClick={() => handleCardClick(card.id)}
                />
              ))
            ) : (
              <div className="empty-state text-center py-8">
                <Image
                  src="/icons/credit-card.svg"
                  alt="No cards"
                  width={48}
                  height={48}
                  className="mx-auto mb-4 opacity-60"
                />
                <p className="text-14 text-gray-500 mb-2">No cards added yet</p>
                <Link
                  href={ROUTES.ADD_CARD}
                  className="text-14 text-blue-600 font-medium"
                >
                  + Add a card
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <h4 className="text-14 font-medium mb-2">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={ROUTES.CONNECT_BANK}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Image
              src="/icons/connect-bank.svg"
              alt="Connect Bank"
              width={20}
              height={20}
            />
            <span className="text-12">Connect Bank</span>
          </Link>
          <Link
            href={ROUTES.ADD_CARD}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Image
              src="/icons/credit-card.svg"
              alt="Add Card"
              width={20}
              height={20}
            />
            <span className="text-12">Add Card</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
