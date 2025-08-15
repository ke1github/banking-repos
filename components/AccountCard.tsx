"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface AccountCardProps {
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
  onClick?: () => void;
  animateOnHover?: boolean;
  showTransactions?: boolean;
  lastTransaction?: {
    amount: number;
    date: string;
    description: string;
    isCredit: boolean;
  };
  highlights?: {
    text: string;
    color: string;
  }[];
}

const AccountCard = ({
  id,
  name,
  officialName,
  mask,
  type,
  subtype,
  balance,
  bankLogo,
  bankName,
  isActive = true,
  onClick,
  animateOnHover = true,
  showTransactions = false,
  lastTransaction,
  highlights = [],
}: AccountCardProps) => {
  // Get appropriate styles based on account type
  const getAccountTypeStyles = () => {
    let borderColor = "border-blue-100";
    let iconBg = "bg-blue-100";
    let iconColor = "text-blue-600";

    if (type === "depository") {
      if (subtype === "checking") {
        borderColor = "border-blue-100";
        iconBg = "bg-blue-100";
        iconColor = "text-blue-600";
      } else if (subtype === "savings") {
        borderColor = "border-green-100";
        iconBg = "bg-green-100";
        iconColor = "text-green-600";
      } else {
        borderColor = "border-purple-100";
        iconBg = "bg-purple-100";
        iconColor = "text-purple-600";
      }
    } else if (type === "investment") {
      borderColor = "border-amber-100";
      iconBg = "bg-amber-100";
      iconColor = "text-amber-600";
    } else if (type === "loan") {
      borderColor = "border-red-100";
      iconBg = "bg-red-100";
      iconColor = "text-red-600";
    } else if (type === "credit") {
      borderColor = "border-indigo-100";
      iconBg = "bg-indigo-100";
      iconColor = "text-indigo-600";
    }

    return { borderColor, iconBg, iconColor };
  };

  const { borderColor, iconBg, iconColor } = getAccountTypeStyles();

  // Wrapper component based on if onClick or href is provided
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    const hoverEffects = animateOnHover
      ? "transition-all duration-300 hover:shadow-md hover:border-blue-200 active:scale-[0.99]"
      : "transition-colors";

    if (onClick) {
      return (
        <div className={`cursor-pointer ${hoverEffects}`} onClick={onClick}>
          {children}
        </div>
      );
    } else {
      return (
        <Link href={`/accounts/${id}`} className={`block ${hoverEffects}`}>
          {children}
        </Link>
      );
    }
  };

  return (
    <CardWrapper>
      <div
        className={`account-item relative bg-white rounded-lg p-3 sm:p-4 mb-3 border ${borderColor} ${
          !isActive ? "opacity-80" : ""
        }`}
      >
        {!isActive && (
          <div className="absolute inset-0 bg-gray-100 bg-opacity-60 backdrop-blur-[1px] flex items-center justify-center rounded-lg z-10">
            <span className="absolute top-2 right-2 bg-gray-500 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-0.5 rounded-full uppercase">
              Inactive
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center max-w-[75%]">
            {bankLogo ? (
              <Image
                src={bankLogo}
                alt={bankName}
                width={24}
                height={24}
                className="mr-1.5 sm:mr-2 w-5 h-5 sm:w-6 sm:h-6"
              />
            ) : (
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 ${iconBg} rounded-full flex items-center justify-center mr-1.5 sm:mr-2 flex-shrink-0`}
              >
                <span
                  className={`${iconColor} text-[10px] sm:text-xs font-bold`}
                >
                  {bankName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h4 className="text-xs sm:text-sm font-medium truncate">
              {bankName}
            </h4>
          </div>
          {isActive && (
            <span className="bg-green-100 text-green-700 text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap font-medium">
              Active
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-gray-700 mb-0.5 sm:mb-1 truncate font-medium">
          {name}
        </p>
        <p className="text-[10px] sm:text-xs text-gray-500">••••{mask}</p>

        <div className="mt-3 sm:mt-4 flex justify-between items-center">
          <span className="text-[10px] sm:text-xs text-gray-500">Balance</span>
          <div className="text-right">
            <span className="text-sm sm:text-base font-semibold">
              ₹
              {balance.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {highlights && highlights.length > 0 && (
          <div className="mt-2 sm:mt-3 flex flex-wrap gap-1 sm:gap-1.5">
            {highlights.map((highlight, index) => (
              <span
                key={index}
                className={`text-[9px] sm:text-[11px] px-2 py-0.5 rounded-full font-medium ${highlight.color}`}
              >
                {highlight.text}
              </span>
            ))}
          </div>
        )}

        {showTransactions && lastTransaction && (
          <div className="mt-3 sm:mt-4 pt-2 border-t border-gray-100">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-1.5 font-medium">
              Last transaction
            </p>
            <div className="flex justify-between items-center">
              <span className="text-[10px] sm:text-xs truncate pr-2 text-gray-700">
                {lastTransaction.description}
              </span>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  lastTransaction.isCredit ? "text-green-600" : "text-red-600"
                }`}
              >
                {lastTransaction.isCredit ? "+" : "-"}₹
                {lastTransaction.amount.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[8px] sm:text-[10px] text-gray-400 mt-1 sm:mt-1.5">
              {lastTransaction.date}
            </p>
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500 font-medium">
            {type} • {subtype}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
};

export default AccountCard;
