"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getUserBankAccounts } from "@/lib/actions/banking.actions";
import { useAuthStore } from "./auth-store";

export interface BankAccount {
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
}

export interface Card {
  id: string;
  type: "visa" | "mastercard" | "amex" | "rupay";
  lastFourDigits: string;
  expiryDate: string;
  cardholderName: string;
  bankName: string;
  availableCredit?: number;
  isActive: boolean;
  priority?: boolean;
}

interface AccountsState {
  accounts: BankAccount[];
  cards: Card[];
  isLoading: boolean;
  error: string | null;
  selectedAccountId: string | null;

  // Actions
  fetchAccounts: () => Promise<void>;
  fetchCards: () => Promise<void>;
  selectAccount: (accountId: string | null) => void;
  clearError: () => void;
}

export const useAccountsStore = create<AccountsState>()(
  devtools((set) => ({
    accounts: [],
    cards: [],
    isLoading: false,
    error: null,
    selectedAccountId: null,

    fetchAccounts: async () => {
      const userId = useAuthStore.getState().user?.id;

      if (!userId) {
        set({ error: "User not authenticated" });
        return;
      }

      try {
        set({ isLoading: true, error: null });

        const result = await getUserBankAccounts(userId);

        if ("error" in result) {
          set({ error: result.error, isLoading: false });
          return;
        }

        if (!result.accounts) {
          set({ accounts: [], isLoading: false });
          return;
        }

        // Transform Appwrite documents to our account interface
        const accounts = result.accounts.map((doc) => {
          const accountNumber = doc.accountNumber || "";
          const mask = accountNumber.slice(-4) || "0000";
          const type = doc.accountType || "checking";
          const name =
            doc.name || `${type[0]?.toUpperCase()}${type.slice(1)} Account`;

          return {
            id: doc.$id,
            name,
            officialName: doc.officialName,
            mask,
            type,
            subtype: doc.subtype || "",
            balance: Number(doc.balance) || 0,
            bankName: doc.bankName || "Bank Account",
            isActive: Boolean(doc.isActive),
            priority: Boolean(doc.priority),
          } as BankAccount;
        });

        set({ accounts, isLoading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to fetch accounts",
          isLoading: false,
        });
      }
    },

    fetchCards: async () => {
      const userId = useAuthStore.getState().user?.id;

      if (!userId) {
        set({ error: "User not authenticated" });
        return;
      }

      try {
        set({ isLoading: true, error: null });

        const result = await getUserBankAccounts(userId);

        if ("error" in result) {
          set({ error: result.error, isLoading: false });
          return;
        }

        if (!result.accounts) {
          set({ cards: [], isLoading: false });
          return;
        }

        // Find credit accounts and transform them to cards
        const userName = useAuthStore.getState().user?.name || "";
        const creditAccounts = result.accounts.filter(
          (doc) => (doc.accountType || "") === "credit"
        );

        const cards = creditAccounts.map((doc) => {
          const accountNumber = doc.accountNumber || "";
          const mask = accountNumber.slice(-4) || "0000";
          const label = doc.name || "Credit Card";
          const lowered = (label as string).toLowerCase();

          // Infer card type from name
          const cardType: Card["type"] = lowered.includes("master")
            ? "mastercard"
            : lowered.includes("amex")
            ? "amex"
            : lowered.includes("visa")
            ? "visa"
            : "rupay";

          return {
            id: doc.$id,
            type: cardType,
            lastFourDigits: mask,
            expiryDate: "—",
            cardholderName: userName,
            bankName: doc.bankName || label,
            availableCredit: Number(doc.balance) || 0,
            isActive: Boolean(doc.isActive),
            priority: Boolean(doc.priority),
          } as Card;
        });

        set({ cards, isLoading: false });
      } catch (error) {
        set({
          error:
            error instanceof Error ? error.message : "Failed to fetch cards",
          isLoading: false,
        });
      }
    },

    selectAccount: (accountId) => {
      set({ selectedAccountId: accountId });
    },

    clearError: () => {
      set({ error: null });
    },
  }))
);
