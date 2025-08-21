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
          />
          <BalanceCard
            title="This Month"
            amount={8234.56}
            currency="USD"
            trend="down"
            percentage={1.5}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <TransferForm accounts={[]} />
        </div>
      </div>

      <div className="hidden lg:block">
        <RightSidebar
          user={{
            firstName: "",
            lastName: undefined,
            email: undefined,
            avatar: undefined,
          }}
        />
      </div>
    </div>
  );
}
