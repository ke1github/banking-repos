"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/route";
import {
  CreditCard,
  Banknote,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Shield,
  Bell,
  TrendingUp,
  Plus,
  Smartphone,
} from "lucide-react";

interface CardData {
  id: string;
  type: "visa" | "mastercard" | "amex" | "rupay";
  lastFourDigits: string;
  expiryDate: string;
  cardholderName: string;
  bankName: string;
  balance?: number;
  availableCredit?: number;
  isActive: boolean;
}

interface BankAccountData {
  id: string;
  name: string;
  officialName?: string;
  mask: string;
  type: string;
  subtype: string;
  balance: number;
  bankLogo?: string;
  bankName: string;
  isActive: boolean;
}

interface RightSidebarProps {
  user?: {
    firstName: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  };
  bankAccounts?: BankAccountData[];
  cards?: CardData[];
}

const RightSidebar = ({
  user = { firstName: "Guest" },
  bankAccounts = [],
  cards = [],
}: RightSidebarProps) => {
  const [activeTab, setActiveTab] = useState<"overview" | "activity">(
    "overview"
  );

  // Mock data for banking-specific content
  const recentTransactions = [
    {
      id: 1,
      description: "Starbucks Coffee",
      amount: -4.95,
      time: "2 min ago",
      type: "debit",
    },
    {
      id: 2,
      description: "Salary Deposit",
      amount: 3500.0,
      time: "1 hour ago",
      type: "credit",
    },
    {
      id: 3,
      description: "Netflix",
      amount: -15.99,
      time: "3 hours ago",
      type: "debit",
    },
    {
      id: 4,
      description: "ATM Withdrawal",
      amount: -100.0,
      time: "5 hours ago",
      type: "debit",
    },
  ];

  const bankingAlerts = [
    {
      id: 1,
      type: "security",
      message: "Login from new device detected",
      time: "1 hour ago",
    },
    {
      id: 2,
      type: "payment",
      message: "Bill payment due tomorrow",
      time: "3 hours ago",
    },
    {
      id: 3,
      type: "account",
      message: "Low balance alert on Checking",
      time: "1 day ago",
    },
  ];

  const quickActions = [
    { icon: ArrowUpRight, label: "Transfer", href: ROUTES.TRANSFERS },
    { icon: Smartphone, label: "Deposit", href: ROUTES.DEPOSITS },
    { icon: CreditCard, label: "Pay Bills", href: ROUTES.CARDS },
    { icon: Plus, label: "Add Card", href: ROUTES.ADD_CARD },
  ];

  // Calculate total balance from all accounts
  const totalBalance = bankAccounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  return (
    <aside className="w-80 bg-white border-l border-gray-200 h-screen fixed right-0 top-0 overflow-y-auto hidden lg:block">
      {/* Profile Section */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt="Profile"
              width={48}
              height={48}
              className="rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-white text-18 font-semibold">
              {user.firstName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-16 font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-12 text-blue-600">Banking Dashboard</p>
          </div>
        </div>
      </div>

      {/* Total Balance Section */}
      <div className="p-4 border-b bg-blue-50">
        <div className="text-center">
          <p className="text-12 text-blue-600 mb-1">Total Balance</p>
          <h3 className="text-24 font-bold text-blue-700">
            ${totalBalance.toLocaleString()}
          </h3>
          <p className="text-12 text-gray-600 mt-1">
            {bankAccounts.length}{" "}
            {bankAccounts.length === 1 ? "account" : "accounts"} •{cards.length}{" "}
            {cards.length === 1 ? "card" : "cards"}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab("overview")}
          >
            <Banknote className="w-4 h-4 mr-1" />
            Overview
          </Button>
          <Button
            variant={activeTab === "activity" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab("activity")}
          >
            <Clock className="w-4 h-4 mr-1" />
            Activity
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === "overview" ? (
          <>
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-14">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      href={action.href}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <action.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-11 font-medium text-gray-700">
                        {action.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Accounts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-14 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    Your Accounts
                  </span>
                  <Link
                    href={ROUTES.ACCOUNTS}
                    className="text-12 text-blue-600 hover:underline"
                  >
                    View All
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bankAccounts.length > 0 ? (
                  bankAccounts.slice(0, 3).map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Banknote className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-12 font-medium text-gray-900">
                            {account.name}
                          </p>
                          <p className="text-10 text-gray-500">
                            {account.mask}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-12 font-medium text-gray-900">
                          ${account.balance.toLocaleString()}
                        </p>
                        <p className="text-10 text-gray-500 capitalize">
                          {account.type}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Banknote className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-12 text-gray-500 mb-2">
                      No accounts connected
                    </p>
                    <Link
                      href={ROUTES.CONNECT_BANK}
                      className="text-12 text-blue-600 hover:underline"
                    >
                      Connect a bank
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-14 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-12 text-gray-700">Two-Factor Auth</span>
                  <Badge className="bg-green-100 text-green-800 text-10">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-12 text-gray-700">Account Alerts</span>
                  <Badge className="bg-green-100 text-green-800 text-10">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-12 text-gray-700">Last Login</span>
                  <span className="text-11 text-gray-500">2 hours ago</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Shield className="w-3 h-3 mr-2" />
                  Security Settings
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Recent Transactions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-14 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === "credit"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "credit" ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-12 font-medium text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-10 text-gray-500">
                          {transaction.time}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`text-12 font-medium ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : ""}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View All Transactions
                </Button>
              </CardContent>
            </Card>

            {/* Banking Alerts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-14 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bankingAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.type === "security"
                        ? "bg-red-50 border-red-200"
                        : alert.type === "payment"
                        ? "bg-orange-50 border-orange-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                          alert.type === "security"
                            ? "bg-red-100"
                            : alert.type === "payment"
                            ? "bg-orange-100"
                            : "bg-blue-100"
                        }`}
                      >
                        <Bell
                          className={`w-2 h-2 ${
                            alert.type === "security"
                              ? "text-red-600"
                              : alert.type === "payment"
                              ? "text-orange-600"
                              : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-11 font-medium text-gray-900">
                          {alert.message}
                        </p>
                        <p className="text-10 text-gray-500 mt-1">
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t bg-gray-50 mt-auto">
        <div className="space-y-2">
          <Button className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Connect New Bank
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Spending Insights
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
