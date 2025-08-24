"use client";

import React from "react";
import TabList from "@/components/ui/TabList";
import { CreditCard, Wallet, Clock, ShieldCheck } from "lucide-react";

export default function CardsPage() {
  // Normally this would come from API, here we're using dummy data
  const cards = [
    {
      id: "1",
      type: "visa" as const,
      lastFourDigits: "4242",
      expiryDate: "04/26",
      cardholderName: "John Doe",
      bankName: "Global Bank",
      availableCredit: 10000,
      isActive: true,
      priority: true,
    },
    {
      id: "2",
      type: "mastercard" as const,
      lastFourDigits: "5678",
      expiryDate: "08/25",
      cardholderName: "John Doe",
      bankName: "Savings Trust",
      availableCredit: 5000,
      isActive: true,
      priority: false,
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Your Cards</h1>
        </div>

        <TabList
          defaultValue="all-cards"
          variant="pills"
          className="mb-6"
          items={[
            {
              value: "all-cards",
              label: "All Cards",
              icon: <CreditCard className="h-4 w-4" />,
              content: (
                <div className="bg-white border border-gray-100 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">
                    All Payment Cards
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50"
                      >
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">{card.bankName}</span>
                          <span className="text-blue-600 uppercase">
                            {card.type}
                          </span>
                        </div>
                        <div className="mb-4">
                          <span className="text-gray-500">•••• •••• •••• </span>
                          <span className="font-medium">
                            {card.lastFourDigits}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <div>
                            <div className="text-gray-500">Card Holder</div>
                            <div>{card.cardholderName}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Expires</div>
                            <div>{card.expiryDate}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              value: "physical",
              label: "Physical Cards",
              icon: <Wallet className="h-4 w-4" />,
              content: (
                <div className="bg-white border border-gray-100 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Physical Cards</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {cards
                      .filter((card) => card.id === "1")
                      .map((card) => (
                        <div
                          key={card.id}
                          className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50"
                        >
                          <div className="flex justify-between mb-4">
                            <span className="font-medium">{card.bankName}</span>
                            <span className="text-blue-600 uppercase">
                              {card.type}
                            </span>
                          </div>
                          <div className="mb-4">
                            <span className="text-gray-500">
                              •••• •••• ••••{" "}
                            </span>
                            <span className="font-medium">
                              {card.lastFourDigits}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <div>
                              <div className="text-gray-500">Card Holder</div>
                              <div>{card.cardholderName}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Expires</div>
                              <div>{card.expiryDate}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ),
            },
            {
              value: "recent",
              label: "Recent Activity",
              icon: <Clock className="h-4 w-4" />,
              content: (
                <div className="bg-white border border-gray-100 rounded-lg p-4 min-h-[300px]">
                  <h3 className="text-lg font-medium mb-4">
                    Recent Card Activity
                  </h3>
                  <p className="text-gray-500">
                    Your recent card transactions will appear here.
                  </p>
                </div>
              ),
            },
            {
              value: "security",
              label: "Security",
              icon: <ShieldCheck className="h-4 w-4" />,
              content: (
                <div className="bg-white border border-gray-100 rounded-lg p-4 min-h-[300px]">
                  <h3 className="text-lg font-medium mb-4">
                    Card Security Settings
                  </h3>
                  <p className="text-gray-500">
                    Manage your card security preferences and settings.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
