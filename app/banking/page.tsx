"use client";

import { HeaderBox } from "@/components/HeaderBox";
import TransferForm from "@/components/TransferForm";
import BalanceCard from "@/components/cards/BalanceCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Smartphone,
  Shield,
  PiggyBank,
  CreditCard as CreditCardIcon,
  Wallet,
  ArrowRightLeft,
} from "lucide-react";

export default function BankingHome() {
  // Mock data - in a real app this would come from your data source
  const mockAccounts = [
    {
      id: "1",
      name: "Checking Account",
      balance: 15420.5,
      type: "checking",
      number: "***1234",
    },
    {
      id: "2",
      name: "Savings Account",
      balance: 25147.39,
      type: "savings",
      number: "***5678",
    },
    {
      id: "3",
      name: "Credit Card",
      balance: -2000.0,
      type: "credit",
      number: "***9012",
      limit: 10000,
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      description: "Starbucks Coffee",
      amount: -4.95,
      date: "Today",
      category: "Food & Drink",
    },
    {
      id: 2,
      description: "Salary Deposit",
      amount: 3500.0,
      date: "Yesterday",
      category: "Income",
    },
    {
      id: 3,
      description: "Netflix Subscription",
      amount: -15.99,
      date: "2 days ago",
      category: "Entertainment",
    },
    {
      id: 4,
      description: "Gas Station",
      amount: -45.2,
      date: "3 days ago",
      category: "Transportation",
    },
  ];

  const quickActions = [
    {
      icon: ArrowUpRight,
      label: "Send Money",
      color: "text-gray-700",
      bgColor: "bg-gray-50",
      href: "/send-money",
    },
    {
      icon: ArrowDownLeft,
      label: "Request Money",
      color: "text-gray-700",
      bgColor: "bg-gray-50",
      href: "/request-money",
    },
    {
      icon: Smartphone,
      label: "Mobile Deposit",
      color: "text-gray-700",
      bgColor: "bg-gray-50",
      href: "/mobile-deposit",
    },
    {
      icon: CreditCard,
      label: "Pay Bills",
      color: "text-gray-700",
      bgColor: "bg-gray-50",
      href: "/pay-bills",
    },
  ];

  const totalBalance = mockAccounts.reduce(
    (sum, account) => (account.type === "credit" ? sum : sum + account.balance),
    0
  );

  return (
    <div className="container mx-auto space-y-6 p-6">
      <HeaderBox
        type="default"
        title="Banking Dashboard"
        subtitle="Manage your accounts, cards and transactions"
      />

      {/* Quick Action Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {quickActions.map((action, i) => (
          <ButtonLink
            key={i}
            href={action.href}
            variant="outline"
            fullWidth
            className={`flex-col h-24 py-4 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 ${action.bgColor}`}
            icon={<action.icon className={`h-5 w-5 ${action.color}`} />}
            iconPosition="top"
          >
            {action.label}
          </ButtonLink>
        ))}
      </div>

      {/* Balance Overview */}
      <BalanceCard
        accounts={mockAccounts}
        totalBanks={3}
        totalCurrentBalance={totalBalance}
        variant="full"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Accounts List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5" />
                Your Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        account.type === "checking"
                          ? "bg-blue-100"
                          : account.type === "savings"
                          ? "bg-blue-100"
                          : "bg-red-100"
                      }`}
                    >
                      <CreditCard
                        className={`h-6 w-6 ${
                          account.type === "checking"
                            ? "text-blue-600"
                            : account.type === "savings"
                            ? "text-blue-700"
                            : "text-red-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{account.name}</h3>
                      <p className="text-sm text-gray-500">{account.number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        account.balance < 0 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      ${Math.abs(account.balance).toLocaleString()}
                    </p>
                    {account.type === "credit" && (
                      <p className="text-sm text-gray-500">
                        of ${account.limit?.toLocaleString()} limit
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 ? "bg-green-50" : "bg-gray-50"
                        }`}
                      >
                        {transaction.amount > 0 ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500">
                            {transaction.date}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <p
                      className={`font-semibold ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <ButtonLink
                href="/transactions"
                variant="outline"
                className="w-full mt-4 text-gray-700 hover:bg-gray-50 border-gray-200"
                icon={<ArrowRightLeft className="h-4 w-4" />}
              >
                View All Transactions
              </ButtonLink>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Transfer */}
        <div className="space-y-6">
          {/* Features */}
          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-800">Banking Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <ButtonLink
                  href="/accounts"
                  variant="outline"
                  className="h-20 flex flex-col gap-2 bg-white shadow-sm hover:shadow border border-gray-100 hover:border-blue-200"
                  icon={
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-blue-600" />
                    </div>
                  }
                  iconPosition="top"
                >
                  <span className="text-xs font-medium text-gray-800">
                    Accounts
                  </span>
                </ButtonLink>
                <ButtonLink
                  href="/cards"
                  variant="outline"
                  className="h-20 flex flex-col gap-2 bg-white shadow-sm hover:shadow border border-gray-100 hover:border-blue-200"
                  icon={
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                      <CreditCardIcon className="h-4 w-4 text-blue-600" />
                    </div>
                  }
                  iconPosition="top"
                >
                  <span className="text-xs font-medium text-gray-800">
                    Cards
                  </span>
                </ButtonLink>
                <ButtonLink
                  href="/savings"
                  variant="outline"
                  className="h-20 flex flex-col gap-2 bg-white shadow-sm hover:shadow border border-gray-100 hover:border-blue-200"
                  icon={
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                      <PiggyBank className="h-4 w-4 text-blue-600" />
                    </div>
                  }
                  iconPosition="top"
                >
                  <span className="text-xs font-medium text-gray-800">
                    Savings
                  </span>
                </ButtonLink>
                <ButtonLink
                  href="/transfers"
                  variant="outline"
                  className="h-20 flex flex-col gap-2 bg-white shadow-sm hover:shadow border border-gray-100 hover:border-blue-200"
                  icon={
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                      <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                    </div>
                  }
                  iconPosition="top"
                >
                  <span className="text-xs font-medium text-gray-800">
                    Transfers
                  </span>
                </ButtonLink>
              </div>
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-700" />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-Factor Auth</span>
                <Badge className="text-xs bg-green-100 text-green-700 border-0">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Account Alerts</span>
                <Badge className="text-xs bg-green-100 text-green-700 border-0">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Fraud Protection</span>
                <Badge className="text-xs bg-green-100 text-green-700 border-0">
                  Protected
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 text-gray-700 hover:bg-gray-50 border-gray-200"
              >
                Security Settings
              </Button>
            </CardContent>
          </Card>

          {/* Transfer Form */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <TransferForm accounts={mockAccounts} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
