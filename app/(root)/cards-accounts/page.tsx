import Image from "next/image";
import Logo from "@/components/ui/logo";
import CardListSection from "@/components/cards/CardListSection";
import AccountListSection from "@/components/AccountListSection";
import { getServerAccount } from "@/lib/appwrite/server-config";
import { getUserBankAccounts } from "@/lib/actions/banking.actions";

type AccountDoc = {
  $id: string;
  accountNumber?: string;
  accountType?: string;
  balance?: number;
  currency?: string;
  name?: string;
  isActive?: boolean;
  bankName?: string;
  officialName?: string;
  subtype?: string;
  priority?: boolean;
};

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
  highlights?: { text: string; color: string }[];
};

export const dynamic = "force-dynamic";

export default async function CardsAndAccountsPage() {
  // Try to resolve current user from server-side session
  let userId: string | null = null;
  let userName: string | undefined;
  try {
    const account = getServerAccount();
    const user = await account.get();
    userId = user.$id;
    userName = user.name || undefined;
  } catch (e) {
    console.error("Error fetching user account:", e);
    // No session; render an unauthenticated-friendly view
  }

  let accounts: AccountItem[] = [];
  let cards: CardItem[] = [];

  if (userId) {
    const res = await getUserBankAccounts(userId);
    if (!("error" in res) && res.accounts) {
      const docs = res.accounts as AccountDoc[];
      // Map bank account documents to UI shapes
      accounts = docs.map((doc) => {
        const accountNumber: string = doc.accountNumber || "";
        const mask = accountNumber.slice(-4) || "0000";
        const type: string = doc.accountType || "checking";
        const name: string =
          doc.name || `${type[0]?.toUpperCase()}${type.slice(1)} Account`;
        return {
          id: doc.$id as string,
          name,
          officialName: doc.officialName || undefined,
          mask,
          type,
          subtype: doc.subtype || "",
          balance: Number(doc.balance) || 0,
          bankName: doc.bankName || "Bank Account",
          isActive: Boolean(doc.isActive),
        } satisfies AccountItem;
      });

      // Derive cards from credit-type accounts if present
      const creditAccounts = docs.filter(
        (d) => (d.accountType || "") === "credit"
      );
      cards = creditAccounts.map((doc, idx) => {
        const accountNumber: string = doc.accountNumber || "";
        const mask = accountNumber.slice(-4) || "0000";
        const label: string = doc.name || "Credit Card";
        // naive network inference from name
        const lowered = (label as string).toLowerCase();
        const cardType: CardItem["type"] = lowered.includes("master")
          ? "mastercard"
          : lowered.includes("amex")
          ? "amex"
          : lowered.includes("visa")
          ? "visa"
          : "rupay";
        return {
          id: doc.$id as string,
          type: cardType,
          lastFourDigits: mask,
          expiryDate: "—",
          cardholderName: userName || "",
          bankName: doc.bankName || label,
          availableCredit: Number(doc.balance) || 0,
          isActive: Boolean(doc.isActive),
          priority:
            typeof doc.priority === "boolean" ? doc.priority : idx === 0,
        } satisfies CardItem;
      });
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10 max-w-7xl">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Logo variant="large" />
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          Banking Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
        <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm border border-gray-100">
          <CardListSection
            title="Your Payment Cards"
            cards={cards}
            animateCards={true}
            showPriority={true}
          />
        </div>

        <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm border border-gray-100 mt-6 sm:mt-8">
          <AccountListSection
            title="Your Bank Accounts"
            accounts={accounts}
            showTransactions={true}
            animateCards={true}
          />
        </div>
      </div>

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
            <CardListSection cards={cards} title="" showPriority={false} />
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 md:mb-6 text-gray-800">
              Savings Accounts
            </h3>
            <AccountListSection
              accounts={accounts.filter((a) => a.type === "savings")}
              title=""
              showTransactions={true}
            />
          </div>

          <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm border border-gray-100 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 md:mb-6 text-gray-800">
              Checking Accounts
            </h3>
            <AccountListSection
              accounts={accounts.filter((a) => a.type === "checking")}
              title=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
