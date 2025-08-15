import React from "react";
import { HeaderBox } from "@/components/HeaderBox";
import BalanceCard from "@/components/BalanceCard";
import TransferForm from "@/components/TransferForm";
import MobileNavbar from "@/components/MobileNavbar";
import Image from "next/image";

// This function would normally be a fetch to your API or database
async function getAccountData() {
  // Simulated data
  return {
    user: { firstName: "Pawan" },
    accounts: [
      { id: "checking", name: "Checking Account" },
      { id: "savings", name: "Savings Account" },
      { id: "investment", name: "Investment Account" },
    ],
    totalBanks: 2,
    totalBalance: 25000,
  };
}

// Making this a Server Component by using the async function
const HOME = async () => {
  const data = await getAccountData();
  const { user, accounts, totalBanks, totalBalance } = data;
  return (
    <>
      {/* Mobile Navigation - only visible on mobile */}
      <MobileNavbar user={user} />

      <section className="home">
        {/* Sidebar - hidden on mobile */}
        <aside className="sidebar">
          <div>
            <div className="mb-10 flex items-center justify-start px-4">
              <h2 className="sidebar-logo">SP BANKING</h2>
            </div>

            <div className="flex flex-col gap-2 px-2">
              {/* Nav items */}
              <a href="#" className="sidebar-link bg-blue-25">
                <Image
                  src="/icons/home.svg"
                  alt="Dashboard"
                  width={20}
                  height={20}
                />
                <span className="sidebar-label">Dashboard</span>
              </a>

              <a href="#" className="sidebar-link hover:bg-blue-25">
                <Image
                  src="/icons/transaction.svg"
                  alt="Transactions"
                  width={20}
                  height={20}
                />
                <span className="sidebar-label">Transactions</span>
              </a>

              <a href="#" className="sidebar-link hover:bg-blue-25">
                <Image
                  src="/icons/payment-transfer.svg"
                  alt="Transfers"
                  width={20}
                  height={20}
                />
                <span className="sidebar-label">Transfers</span>
              </a>
            </div>
          </div>

          <div className="p-4">
            <a href="#" className="sidebar-link hover:bg-blue-25">
              <Image
                src="/icons/logout.svg"
                alt="Logout"
                width={20}
                height={20}
              />
              <span className="sidebar-label">Logout</span>
            </a>
          </div>
        </aside>

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
      </section>
    </>
  );
};

export default HOME;
