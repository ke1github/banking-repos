import React from "react";
import { HeaderBox } from "@/components/HeaderBox";
import BalanceCard from "@/components/BalanceCard";
import TransferForm from "@/components/TransferForm";
import MobileNavbar from "@/components/MobileNavbar";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";

// This function would normally be a fetch to your API or database
async function getAccountData() {
  // Simulated data
  return {
    user: {
      firstName: "Pawan",
      lastName: "Kumar",
      email: "pawan@example.com",
    },
    accounts: [
      { id: "checking", name: "Checking Account" },
      { id: "savings", name: "Savings Account" },
      { id: "investment", name: "Investment Account" },
    ],
    totalBanks: 2,
    totalBalance: 25000,
    bankAccounts: [
      {
        id: "acc1",
        name: "Checking Account",
        mask: "4567",
        type: "depository",
        subtype: "checking",
        balance: 12500,
        bankName: "Chase Bank",
        isActive: true,
      },
      {
        id: "acc2",
        name: "Savings Account",
        mask: "8901",
        type: "depository",
        subtype: "savings",
        balance: 9500,
        bankName: "Bank of America",
        isActive: true,
      },
      {
        id: "acc3",
        name: "Investment Account",
        mask: "2345",
        type: "investment",
        subtype: "brokerage",
        balance: 3000,
        bankName: "Fidelity",
        isActive: true,
      },
    ],
    cards: [
      {
        id: "card1",
        type: "visa" as const,
        lastFourDigits: "4567",
        expiryDate: "05/28",
        cardholderName: "PAWAN KUMAR",
        bankName: "Chase Bank",
        availableCredit: 5000,
        isActive: true,
      },
      {
        id: "card2",
        type: "mastercard" as const,
        lastFourDigits: "8901",
        expiryDate: "12/26",
        cardholderName: "PAWAN KUMAR",
        bankName: "Bank of America",
        availableCredit: 3500,
        isActive: true,
      },
    ],
  };
}

// Making this a Server Component by using the async function
const HOME = async () => {
  const data = await getAccountData();
  const { user, accounts, totalBanks, totalBalance, bankAccounts, cards } =
    data;
  return (
    <>
      <section className="home">
        {/* Main content */}
        <div className="home-content px-6 pt-2 md:pt-0">
          <header className="home-header">
            <HeaderBox
              type="greeting"
              title="Welcome"
              user={user.firstName || "Guest"}
              subtext={
                "Access your banking dashboard and manage your finances effortlessly."
              }
              showLogo={true}
            />

            {/* Balance Card - adapts to screen size */}
            <BalanceCard
              accounts={accounts}
              totalBanks={totalBanks}
              totalCurrentBalance={totalBalance}
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
              {/* Transaction list would go here */}
              <div className="mt-4 text-gray-500 bg-white p-4 sm:p-6 rounded-lg border border-gray-100 text-sm sm:text-base">
                No recent transactions
              </div>
            </section>

            <section>
              {/* Using our new Server Actions powered component */}
              <TransferForm accounts={accounts} />
            </section>
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar user={user} bankAccounts={bankAccounts} cards={cards} />
      </section>
    </>
  );
};

export default HOME;
