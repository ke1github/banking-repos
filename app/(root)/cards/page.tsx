import CardListSection from "@/components/cards/CardListSection";
import { getServerAccount } from "@/lib/appwrite/server-config";
import { getUserBankAccounts } from "@/lib/actions/banking.actions";

type AccountDoc = {
  $id: string;
  name?: string;
  accountNumber?: string;
  accountType?: string;
  balance?: number;
  bankName?: string;
  isActive?: boolean;
  priority?: boolean;
};

export const dynamic = "force-dynamic";

export default async function CardsIndexPage() {
  let userId: string | null = null;
  let userName: string | undefined;
  try {
    const account = getServerAccount();
    const user = await account.get();
    userId = user.$id;
    userName = user.name || undefined;
  } catch (e) {
    console.error("Error fetching user account:", e);
  }

  const cards: Array<{
    id: string;
    type: "visa" | "mastercard" | "amex" | "rupay";
    lastFourDigits: string;
    expiryDate: string;
    cardholderName: string;
    bankName: string;
    availableCredit?: number;
    isActive: boolean;
    priority?: boolean;
  }> = [];

  if (userId) {
    const res = await getUserBankAccounts(userId);
    if (!("error" in res) && res.accounts) {
      const docs = res.accounts as AccountDoc[];
      const credit = docs.filter((d) => d.accountType === "credit");
      for (const doc of credit) {
        const last4 = (doc.accountNumber || "").slice(-4) || "0000";
        const label = doc.name || "Credit Card";
        const lowered = label.toLowerCase();
        const type: "visa" | "mastercard" | "amex" | "rupay" = lowered.includes(
          "master"
        )
          ? "mastercard"
          : lowered.includes("amex")
          ? "amex"
          : lowered.includes("visa")
          ? "visa"
          : "rupay";
        cards.push({
          id: doc.$id,
          type,
          lastFourDigits: last4,
          expiryDate: "—",
          cardholderName: userName || "",
          bankName: doc.bankName || label,
          availableCredit: Number(doc.balance) || 0,
          isActive: Boolean(doc.isActive),
          priority: Boolean(doc.priority),
        });
      }
    }
  }

  return (
    <section className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Your Cards</h1>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <CardListSection title="Payment Cards" cards={cards} animateCards />
        </div>
      </div>
    </section>
  );
}
