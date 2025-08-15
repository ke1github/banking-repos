"use client";

import React from "react";
import BankCard from "./BankCard";
import { useRouter } from "next/navigation";

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
  priority?: boolean;
  customColors?: {
    background: string;
    text: string;
    accent: string;
  };
}

interface CardListSectionProps {
  cards: CardData[];
  onCardClick?: (id: string) => void;
  title?: string;
  showPriority?: boolean;
  animateCards?: boolean;
  showEmptyState?: boolean;
}

/**
 * CardListSection - A component to display a list of bank cards with different styling based on card type
 * This is an example of how to use the BankCard component with different variants
 */
export default function CardListSection({
  cards,
  onCardClick,
  title = "Your Cards",
  showPriority = true,
  animateCards = true,
  showEmptyState = true,
}: CardListSectionProps) {
  const router = useRouter();

  // Default click handler if none provided
  const handleCardClick = (id: string) => {
    onCardClick ? onCardClick(id) : router.push(`/cards/${id}`);
  };

  // Get appropriate variant based on card type
  const getCardVariant = (cardType: string): "dark" | "light" | "gradient" => {
    switch (cardType.toLowerCase()) {
      case "visa":
        return "gradient";
      case "mastercard":
        return "dark";
      case "amex":
        return "light";
      default:
        return "gradient";
    }
  };

  // Calculate total available credit across all cards
  const totalAvailableCredit = cards
    .filter((card) => card.isActive && card.availableCredit !== undefined)
    .reduce((total, card) => total + (card.availableCredit || 0), 0);

  // Calculate total balance across all cards
  const totalBalance = cards
    .filter((card) => card.isActive && card.balance !== undefined)
    .reduce((total, card) => total + (card.balance || 0), 0);

  if (!cards || cards.length === 0) {
    if (!showEmptyState) return null;

    return (
      <div className="py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-center">
        <p className="text-gray-500 mb-2">No cards available</p>
        <button
          onClick={() => router.push("/add-card")}
          className="text-blue-600 text-sm font-medium"
        >
          + Add a card
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        {title && (
          <h2 className="font-semibold text-base sm:text-lg md:text-xl">
            {title}
          </h2>
        )}
        {(totalAvailableCredit > 0 || totalBalance > 0) && (
          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm text-gray-500">
              {totalAvailableCredit > 0 ? "Available Credit" : "Total Balance"}
            </p>
            <p className="text-base sm:text-lg md:text-xl font-semibold">
              ₹
              {(totalAvailableCredit > 0
                ? totalAvailableCredit
                : totalBalance
              ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {cards.map((card) => (
          <BankCard
            key={card.id}
            id={card.id}
            type={card.type}
            lastFourDigits={card.lastFourDigits}
            expiryDate={card.expiryDate}
            cardholderName={card.cardholderName}
            bankName={card.bankName}
            availableCredit={card.availableCredit}
            balance={card.balance}
            isActive={card.isActive}
            variant={getCardVariant(card.type)}
            priority={showPriority && card.priority}
            customColors={card.customColors}
            animateOnHover={animateCards}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
}
