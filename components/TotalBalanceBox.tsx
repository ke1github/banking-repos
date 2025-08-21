import React, { useState, useEffect } from "react";
import CountUp from "react-countup";

interface Account {
  id: string;
  name: string;
  // Add other properties as needed
}

interface TotalBalanceBoxProps {
  accounts?: Array<Account>;
  totalBanks: number;
  totalCurrentBalance: number;
}

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: TotalBalanceBoxProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true once component mounts (client-side)
    setIsClient(true);
  }, []);
  return (
    <section className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 p-4 sm:p-6 rounded-xl bg-white shadow-sm border border-gray-100">
      <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center">
        <span className="text-sm sm:text-base font-medium">{totalBanks}</span>
      </div>

      <div className="flex flex-col gap-1 sm:gap-2 text-center sm:text-left">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
          Bank Accounts: {totalBanks}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Total Current Balance
        </p>
      </div>

      <div className="flex flex-col items-center sm:items-end ml-auto mt-2 sm:mt-0">
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          {isClient ? (
            <CountUp
              start={0}
              end={totalCurrentBalance}
              duration={2.5}
              decimals={2}
              prefix="₹"
              separator=","
              preserveValue
              redraw={false}
            />
          ) : (
            `₹${totalCurrentBalance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          )}
        </p>
        <p className="text-xs sm:text-sm text-gray-600">
          Total Banks: {totalBanks} | Total Accounts: {accounts.length}
        </p>
      </div>
    </section>
  );
};

export default TotalBalanceBox;
