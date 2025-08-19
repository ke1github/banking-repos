"use client";

import { useEffect } from "react";
import CardListSection from "@/components/CardListSection";
import AccountListSection from "@/components/AccountListSection";
import { useDataStates } from "@/lib/hooks/useDataStates";
import { DataStateRenderer } from "@/components/DataStateRenderer";

type CardItem = {
  id: string;
  type: "visa" | "mastercard" | "amex" | "rupay";
  lastFourDigits: string;
  expiryDate: string;
  cardholderName: string;
  bankName: string;
  balance?: number;
  availableCredit?: number;
  isActive: boolean;
  priority?: boolean;
  customColors?: { background: string; text: string; accent: string };
};

type AccountItem = {
  id: string;
  name: string;
  officialName?: string;
  mask: string;
  type: string;
  subtype: string;
  balance: number;
  bankName: string;
  isActive: boolean;
  bankLogo?: string;
  lastTransaction?: {
    amount: number;
    date: string;
    description: string;
    isCredit: boolean;
  };
  priority?: boolean;
  highlights?: {
    text: string;
    color: string;
  }[];
};

export default function CardsAccountsClientPage() {
  // State for cards
  const {
    data: cards,
    isLoading: isCardsLoading,
    error: cardsError,
    setData: setCards,
    setIsLoading: setCardsLoading,
    setError: setCardsError,
  } = useDataStates<CardItem[]>();

  // State for accounts
  const {
    data: accounts,
    isLoading: isAccountsLoading,
    error: accountsError,
    setData: setAccounts,
    setIsLoading: setAccountsLoading,
    setError: setAccountsError,
  } = useDataStates<AccountItem[]>();

  // Load data on component mount
  useEffect(() => {
    // Simulate loading cards
    setCardsLoading(true);
    setTimeout(() => {
      try {
        // Mock data - replace with actual API call in production
        const mockCards: CardItem[] = [
          {
            id: "1",
            type: "visa",
            lastFourDigits: "1234",
            expiryDate: "12/25",
            cardholderName: "John Doe",
            bankName: "Chase Bank",
            availableCredit: 5000,
            isActive: true,
            priority: true,
          },
          {
            id: "2",
            type: "mastercard",
            lastFourDigits: "5678",
            expiryDate: "03/26",
            cardholderName: "John Doe",
            bankName: "Bank of America",
            availableCredit: 3500,
            isActive: true,
            priority: false,
          },
        ];
        setCards(mockCards);
      } catch (err) {
        setCardsError(
          err instanceof Error ? err : new Error("Failed to fetch cards")
        );
      } finally {
        setCardsLoading(false);
      }
    }, 1500);

    // Simulate loading accounts
    setAccountsLoading(true);
    setTimeout(() => {
      try {
        // Mock data - replace with actual API call in production
        const mockAccounts: AccountItem[] = [
          {
            id: "1",
            name: "Primary Checking",
            officialName: "Everyday Checking",
            mask: "1234",
            type: "checking",
            subtype: "personal",
            balance: 4285.67,
            bankName: "Chase Bank",
            isActive: true,
            priority: true,
            lastTransaction: {
              amount: 125.5,
              date: "2023-07-15",
              description: "Payment received",
              isCredit: true,
            },
          },
          {
            id: "2",
            name: "Savings Account",
            officialName: "High Yield Savings",
            mask: "5678",
            type: "savings",
            subtype: "personal",
            balance: 12580.42,
            bankName: "Chase Bank",
            isActive: true,
            priority: false,
            lastTransaction: {
              amount: 1000.0,
              date: "2023-07-10",
              description: "Transfer from checking",
              isCredit: true,
            },
          },
          {
            id: "3",
            name: "Joint Checking",
            officialName: "Preferred Checking",
            mask: "9012",
            type: "checking",
            subtype: "joint",
            balance: 7890.15,
            bankName: "Bank of America",
            isActive: true,
            priority: false,
            lastTransaction: {
              amount: 45.99,
              date: "2023-07-12",
              description: "Grocery Store",
              isCredit: false,
            },
          },
        ];
        setAccounts(mockAccounts);
      } catch (err) {
        setAccountsError(
          err instanceof Error ? err : new Error("Failed to fetch accounts")
        );
      } finally {
        setAccountsLoading(false);
      }
    }, 2000);
  }, [
    setCards,
    setCardsLoading,
    setCardsError,
    setAccounts,
    setAccountsLoading,
    setAccountsError,
  ]);

  // Server actions for retry functionality
  async function retryFetchCardsAction() {
    "use server";
    // This is a server action but we can't do anything here
    // The actual retry happens client-side
  }

  async function retryFetchAccountsAction() {
    "use server";
    // This is a server action but we can't do anything here
    // The actual retry happens client-side
  }

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Cards & Accounts</h1>

      <div className="grid gap-6">
        {/* Cards Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <DataStateRenderer
            data={cards}
            isLoading={isCardsLoading}
            error={cardsError}
            onRetryAction={retryFetchCardsAction}
            errorTitle="Could not load your cards"
            emptyMessage="You don't have any cards yet."
            loadingHeight="h-64"
          >
            {(cardItems) => (
              <CardListSection
                title="Payment Cards"
                cards={cardItems}
                animateCards
              />
            )}
          </DataStateRenderer>
        </div>

        {/* Accounts Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <DataStateRenderer
            data={accounts}
            isLoading={isAccountsLoading}
            error={accountsError}
            onRetryAction={retryFetchAccountsAction}
            errorTitle="Could not load your accounts"
            emptyMessage="You don't have any accounts yet."
            loadingHeight="h-80"
          >
            {(accountItems) => (
              <AccountListSection
                title="Bank Accounts"
                accounts={accountItems}
              />
            )}
          </DataStateRenderer>
        </div>
      </div>
    </div>
  );
}
