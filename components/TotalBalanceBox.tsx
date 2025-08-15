import React from "react";
interface TotalBalanceBoxProps {
  accounts?: Array<any>;
  totalBanks: number;
  totalCurrentBalance: number;
}

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) => {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        {/* Placeholder for a Doughnut chart component if needed */}
        <div className="w-full h-full rounded-full bg-blue-100 flex-center">
          <span className="text-14 font-medium">{totalBanks}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-18 font-semibold text-gray-900">
          Bank Accounts: {totalBanks}
        </h2>
        <p className="total-balance-label">Total Current Balance</p>
      </div>

      <div className="flex flex-col items-end ml-auto">
        <p className="total-balance-amount">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(totalCurrentBalance)}
        </p>
        <p className="text-14 text-gray-600">
          Total Banks: {totalBanks} | Total Accounts: {accounts.length}
        </p>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
