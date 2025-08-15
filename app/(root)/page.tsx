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
      {/* Mobile Navigation - only visible on mobile */}
      <MobileNavbar user={user} />

      <section className="home">
        {/* Left Sidebar */}
        <Sidebar user={user} />

        {/* Main content */}
        <div className="home-content">
          <header className="home-header">
            <HeaderBox
              type="greeting"
              title="Welcome"
              user={user.firstName || "Guest"}
              subtext={
                "Access your banking dashboard and manage your finances effortlessly."
              }
            />

            {/* Balance Card - adapts to screen size */}
            <BalanceCard
              accounts={accounts}
              totalBanks={totalBanks}
              totalCurrentBalance={totalBalance}
            />
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="recent-transactions">
              <div className="flex items-center justify-between">
                <h2 className="recent-transactions-label">
                  Recent Transactions
                </h2>
                <button className="view-all-btn">View All</button>
              </div>
              {/* Transaction list would go here */}
              <div className="mt-4 text-gray-500">No recent transactions</div>
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
