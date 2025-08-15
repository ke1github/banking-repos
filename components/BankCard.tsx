"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

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
  variant?: "dark" | "light" | "gradient" | "custom";
  customColors?: {
    background: string;
    text: string;
    accent: string;
  };
  animateOnHover?: boolean;
  priority?: boolean; // Highlights important cards
  onClick?: () => void;
}

const BankCard = ({
  id,
  type,
  lastFourDigits,
  expiryDate,
  cardholderName,
  bankName,
  balance,
  availableCredit,
  isActive = true,
  variant = "gradient",
  customColors,
  animateOnHover = true,
  priority = false,
  onClick,
}: CardData) => {
  // Get appropriate card background styles based on variant and type
  const getCardStyles = () => {
    // Handle custom colors
    if (variant === "custom" && customColors) {
      return {
        backgroundStyle: customColors.background,
        textColorClass: customColors.text,
      };
    }

    // Default gradient style
    let backgroundStyle = "bg-gradient-to-r from-blue-600 to-blue-800";
    let textColorClass = "text-white";

    if (type === "visa") {
      if (variant === "light") {
        backgroundStyle = "bg-white border border-blue-100";
        textColorClass = "text-gray-800";
      } else if (variant === "dark") {
        backgroundStyle = "bg-gray-900";
      } else if (variant === "gradient") {
        backgroundStyle = "bg-gradient-to-r from-blue-500 to-blue-700";
      }
    } else if (type === "mastercard") {
      if (variant === "light") {
        backgroundStyle = "bg-white border border-orange-100";
        textColorClass = "text-gray-800";
      } else if (variant === "dark") {
        backgroundStyle = "bg-gray-900";
      } else {
        backgroundStyle = "bg-gradient-to-r from-orange-600 to-red-600";
      }
    } else if (type === "amex") {
      if (variant === "light") {
        backgroundStyle = "bg-white border border-blue-100";
        textColorClass = "text-gray-800";
      } else if (variant === "dark") {
        backgroundStyle = "bg-blue-900";
      } else {
        backgroundStyle = "bg-gradient-to-r from-blue-700 to-blue-900";
      }
    } else if (type === "rupay") {
      if (variant === "light") {
        backgroundStyle = "bg-white border border-green-100";
        textColorClass = "text-gray-800";
      } else if (variant === "dark") {
        backgroundStyle = "bg-gray-900";
      } else {
        backgroundStyle = "bg-gradient-to-r from-green-600 to-green-800";
      }
    }

    return { backgroundStyle, textColorClass };
  };

  const { backgroundStyle, textColorClass } = getCardStyles();

  // Wrapper component based on if onClick or href is provided
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    const hoverEffects = animateOnHover
      ? "transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] hover:shadow-lg"
      : "";

    if (onClick) {
      return (
        <div className={`cursor-pointer ${hoverEffects}`} onClick={onClick}>
          {children}
        </div>
      );
    } else {
      return (
        <Link href={`/cards/${id}`} className={`block ${hoverEffects}`}>
          {children}
        </Link>
      );
    }
  };

  return (
    <CardWrapper>
      <div
        className={`card-item relative ${backgroundStyle} rounded-xl p-3 sm:p-4 md:p-5 mb-3 ${textColorClass} shadow-sm 
          ${!isActive ? "opacity-70" : ""} 
          ${
            priority
              ? "ring-2 ring-yellow-400 ring-offset-1 sm:ring-offset-2"
              : ""
          }`}
      >
        {priority && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-xs font-bold text-white px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs whitespace-nowrap">
            PRIORITY
          </div>
        )}

        {!isActive && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 rounded-full uppercase">
              Inactive
            </span>
          </div>
        )}

        <div className="flex justify-between items-start mb-3 sm:mb-4 md:mb-6 relative">
          <div className="max-w-[70%]">
            <p
              className={`text-[10px] sm:text-xs md:text-sm truncate ${
                variant === "light" ? "text-gray-600" : "text-white/80"
              }`}
            >
              {bankName}
            </p>
            <p className="text-xs sm:text-sm md:text-base font-medium mt-0.5 sm:mt-1">
              ••••••{lastFourDigits}
            </p>
          </div>
          <Image
            src={`/icons/${type.toLowerCase()}.svg`}
            alt={type}
            width={36}
            height={24}
            className="opacity-90 w-[24px] sm:w-[30px] md:w-[36px] h-auto"
          />
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p
              className={
                variant === "light"
                  ? "text-[8px] sm:text-[10px] text-gray-500"
                  : "text-[8px] sm:text-[10px] text-white/70"
              }
            >
              Valid thru
            </p>
            <p className="text-[10px] sm:text-xs">{expiryDate}</p>
          </div>
          <div className="text-right">
            <p
              className={
                variant === "light"
                  ? "text-[8px] sm:text-[10px] text-gray-500"
                  : "text-[8px] sm:text-[10px] text-white/70"
              }
            >
              Cardholder
            </p>
            <p className="text-[10px] sm:text-xs truncate max-w-[120px] sm:max-w-none">
              {cardholderName}
            </p>
          </div>
        </div>

        {(balance !== undefined || availableCredit !== undefined) && (
          <div
            className={`mt-2 sm:mt-3 pt-2 sm:pt-3 border-t ${
              variant === "light" ? "border-gray-200" : "border-white/20"
            }`}
          >
            <div className="flex justify-between items-center">
              <span
                className={
                  variant === "light"
                    ? "text-[10px] sm:text-xs text-gray-500"
                    : "text-[10px] sm:text-xs text-white/70"
                }
              >
                {balance !== undefined ? "Balance" : "Available credit"}
              </span>
              <div className="flex flex-col items-end">
                <span className="text-xs sm:text-sm font-semibold">
                  ₹
                  {(balance !== undefined
                    ? balance
                    : availableCredit !== undefined
                    ? availableCredit
                    : 0
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export default BankCard;
