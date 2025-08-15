"use client";

import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import Image from "next/image";

interface Account {
  id: string;
  name: string;
  // Add other properties as needed
}

interface BalanceCardProps {
  accounts?: Array<Account>;
  totalBanks: number;
  totalCurrentBalance: number;
}

// Shared CountUp configuration to reduce redundancy
const countUpProps = {
  start: 0,
  duration: 2.5,
  decimals: 2,
  prefix: "$",
  separator: ",",
  preserveValue: true,
  redraw: false,
};

const BalanceCard = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: BalanceCardProps) => {
  const [isMobileView, setIsMobileView] = useState(false);

  // Set up the responsive detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Mobile view
  if (isMobileView) {
    return (
      <div className="mobile-balance-card">
        <div className="mobile-balance-header">
          <h3 className="text-16 font-medium text-white">Total Balance</h3>
          <span className="text-12 text-white/80">
            {accounts.length} accounts across {totalBanks} banks
          </span>
        </div>

        <div className="mobile-balance-amount">
          <CountUp {...countUpProps} end={totalCurrentBalance} />
        </div>

        <div className="mobile-balance-actions">
          <button className="mobile-balance-action-button">
            <Image
              src="/icons/deposit.svg"
              alt="Deposit"
              width={20}
              height={20}
            />
            <span>Deposit</span>
          </button>

          <button className="mobile-balance-action-button">
            <Image
              src="/icons/money-send.svg"
              alt="Send"
              width={20}
              height={20}
            />
            <span>Transfer</span>
          </button>

          <button className="mobile-balance-action-button">
            <Image
              src="/icons/payment-transfer.svg"
              alt="Pay"
              width={20}
              height={20}
            />
            <span>Pay</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop view
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
          <CountUp {...countUpProps} end={totalCurrentBalance} />
        </p>
        <p className="text-14 text-gray-600">
          Total Banks: {totalBanks} | Total Accounts: {accounts.length}
        </p>
      </div>
    </section>
  );
};

export default BalanceCard;
