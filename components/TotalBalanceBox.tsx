import React from "react";
interface TotlaBalanceBoxProps {
  accounts?: Account[];
  totalBanks: number;
  totalCurrentBalance: number;
}

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotlaBalanceBoxProps) => {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        {/* Placeholder for a Doughnut chart component if needed */}
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="header-2">Bank Accounts : {totalBanks}</h2>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">Total Current Balance</p>
        </div>
      </div>
      <p className="total-balance-amount">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(totalCurrentBalance)}
      </p>
      <p className="total-balance-info">
        Total Banks: | Total Accounts: {accounts.length}
      </p>
    </section>
  );
};

export default TotalBalanceBox;
