"use client";

import { HeaderBox } from "@/components/HeaderBox";
import TransferForm from "@/components/TransferForm";
import RightSidebar from "@/components/RightSidebar";
import BalanceCard from "@/components/cards/BalanceCard";

export default function BankingHome() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      <div className="lg:col-span-2 space-y-6">
        <HeaderBox
          type="default"
          title="Banking Dashboard"
          subtitle="Manage your accounts, cards and transactions"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BalanceCard
            title="Total Balance"
            amount={42567.89}
            currency="USD"
            trend="up"
            percentage={3.2}
            totalBanks={3}
            totalCurrentBalance={42567.89}
          />
          <BalanceCard
            title="This Month"
            amount={8234.56}
            currency="USD"
            trend="down"
            percentage={1.5}
            totalBanks={3}
            totalCurrentBalance={8234.56}
          />
        </div>

        <TransferForm accounts={[]} />
      </div>
      <div className="lg:col-span-1">
        <RightSidebar />
      </div>
    </div>
  );
}
