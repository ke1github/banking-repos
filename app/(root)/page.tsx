import { HeaderBox } from "@/components/HeaderBox";
import BalanceCard from "@/components/cards/BalanceCard";
import TransferForm from "@/components/TransferForm";
import RightSidebar from "@/components/RightSidebar";
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
};

export const dynamic = "force-dynamic";

export default async function HOME() {
  // Resolve user from server-side session
  let userId: string | null = null;
  let userName: string | undefined;
  let userEmail: string | undefined;
  try {
    const account = getServerAccount();
    const user = await account.get();
    userId = user.$id;
    userName = user.name || undefined;
    userEmail = user.email || undefined;
  } catch (e) {
    console.error("Error getting server account:", e);
  }

  // Fetch accounts from Appwrite
  let bankDocs: AccountDoc[] = [];
  if (userId) {
    const res = await getUserBankAccounts(userId);
    if (!("error" in res) && res.accounts) {
      bankDocs = res.accounts as AccountDoc[];
    }
  }

  // Derive UI shapes
  const accounts = bankDocs.map((doc) => ({
    id: doc.$id,
    name:
      doc.name ||
      `${(doc.accountType || "Account")[0]?.toUpperCase()}${(
        doc.accountType || "account"
      ).slice(1)} Account`,
  }));
  const totalBanks = new Set(
    bankDocs.map((d) => (d.bankName || "").trim()).filter(Boolean)
  ).size;
  const totalBalance = bankDocs.reduce(
    (sum, d) => sum + Number(d.balance || 0),
    0
  );
  const bankAccounts = bankDocs.map((doc) => {
    const accountNumber: string = doc.accountNumber || "";
    const mask = accountNumber.slice(-4) || "0000";
    const type: string = doc.accountType || "checking";
    const name: string =
      doc.name || `${type[0]?.toUpperCase()}${type.slice(1)} Account`;
    return {
      id: doc.$id,
      name,
      officialName: doc.officialName || undefined,
      mask,
      type,
      subtype: doc.subtype || "",
      balance: Number(doc.balance) || 0,
      bankName: doc.bankName || "Bank Account",
      isActive: Boolean(doc.isActive),
    };
  });
  const creditDocs = bankDocs.filter((d) => (d.accountType || "") === "credit");
  const cards = creditDocs.map((doc) => {
    const accountNumber: string = doc.accountNumber || "";
    const mask = accountNumber.slice(-4) || "0000";
    const label: string = doc.name || "Credit Card";
    const lowered = label.toLowerCase();
    const type: "mastercard" | "amex" | "visa" | "rupay" = lowered.includes(
      "master"
    )
      ? "mastercard"
      : lowered.includes("amex")
      ? "amex"
      : lowered.includes("visa")
      ? "visa"
      : "rupay";
    return {
      id: doc.$id,
      type,
      lastFourDigits: mask,
      expiryDate: "—",
      cardholderName: userName || "",
      bankName: doc.bankName || label,
      availableCredit: Number(doc.balance) || 0,
      isActive: Boolean(doc.isActive),
    };
  });

  const firstName = userName?.split(" ")?.[0] || "Guest";

  return (
    <>
      <section className="home">
        <div className="home-content px-6 pt-2 md:pt-0">
          <header className="home-header flex justify-between items-start md:items-center">
            <HeaderBox
              type="greeting"
              title="Welcome"
              user={firstName}
              subtext={
                "Access your banking dashboard and manage your finances effortlessly."
              }
              showLogo={true}
            />
            <BalanceCard
              accounts={accounts}
              totalBanks={totalBanks}
              totalCurrentBalance={totalBalance}
              variant="compact"
            />
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <section className="recent-transactions">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                  Recent Transactions
                </h2>
                <button className="text-xs sm:text-sm rounded-lg border border-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  View All
                </button>
              </div>
              <div className="mt-4 text-gray-500 bg-white p-4 sm:p-6 rounded-lg border border-gray-100 text-sm sm:text-base">
                No recent transactions
              </div>
            </section>

            <section>
              <TransferForm accounts={accounts} />
            </section>
          </div>
        </div>

        <RightSidebar
          user={{
            firstName: firstName,
            lastName: userName?.split(" ")?.slice(1).join(" ") ?? "",
            email: userEmail,
          }}
          bankAccounts={bankAccounts}
          cards={cards}
        />
      </section>
    </>
  );
}
