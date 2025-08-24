"use client";

import React from "react";
import Image from "next/image";
import ErrorBoundary from "./ErrorBoundary";
import {
  BarChart2,
  CreditCard,
  Home,
  ShoppingBag,
  User,
  Wallet,
  DollarSign,
  Calendar,
  BarChart,
  Briefcase,
  Search,
  TrendingUp,
  PieChart,
  Activity,
  FileText,
  Brain,
  Package,
  Send,
  CircleDashed,
  ArrowUpCircle,
  Banknote,
  Building,
  ExternalLink,
  Shield,
  LogOut,
  Edit,
  Settings,
  Menu,
  Bitcoin,
  Calculator,
  Monitor,
  RefreshCw,
  ArrowLeftRight,
  Landmark,
  Link,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  isActive?: boolean;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  className = "",
  isActive = false,
}) => {
  // Process the icon name for consistency
  const cleanIconName = name
    .toLowerCase()
    .replace("/icons/", "")
    .replace(".svg", "");

  // First try to render a Lucide icon (preferred method)
  const lucideIcon = renderLucideIcon();
  if (lucideIcon !== null) {
    return <div className="flex items-center justify-center">{lucideIcon}</div>;
  }

  // Fall back to public directory icons if Lucide doesn't have it
  return <div className="flex items-center justify-center">{tryIconSrc()}</div>;

  // Try to load the icon from the public directory
  function tryIconSrc() {
    const iconPath = name.includes(".svg")
      ? name
      : name.startsWith("/")
      ? `${name}.svg`
      : `/icons/${name}.svg`;

    console.log(`Trying to load icon: ${iconPath}`);

    return (
      <div className="relative">
        <ErrorBoundary
          fallback={<CircleDashed size={size} className={className} />}
          onError={(error) => {
            console.error(`Icon error: ${error.message}`, iconPath);
          }}
        >
          <Image
            src={iconPath}
            alt=""
            width={size}
            height={size}
            className={className}
            style={{
              filter: isActive
                ? "brightness(0) saturate(100%) invert(29%) sepia(98%) saturate(1654%) hue-rotate(205deg) brightness(96%) contrast(106%)"
                : "brightness(0) saturate(100%) invert(35%) sepia(11%) saturate(519%) hue-rotate(179deg) brightness(96%) contrast(87%)",
            }}
            onError={() => {
              throw new Error(`Failed to load icon: ${iconPath}`);
            }}
          />
        </ErrorBoundary>
      </div>
    );
  }

  // Try to load the icon from Lucide first
  function renderLucideIcon() {
    // Map specific icon names first (exact matches)
    const exactMatches: Record<string, React.ReactNode> = {
      home: <Home size={size} className={className} />,
      dashboard: <BarChart2 size={size} className={className} />,
      "credit-card": <CreditCard size={size} className={className} />,
      profile: <User size={size} className={className} />,
      user: <User size={size} className={className} />,
      "shopping-bag": <ShoppingBag size={size} className={className} />,
      wallet: <Wallet size={size} className={className} />,
      "money-send": <Send size={size} className={className} />,
      calendar: <Calendar size={size} className={className} />,
      "chart-line": <BarChart size={size} className={className} />,
      briefcase: <Briefcase size={size} className={className} />,
      search: <Search size={size} className={className} />,
      "trending-up": <TrendingUp size={size} className={className} />,
      "pie-chart": <PieChart size={size} className={className} />,
      activity: <Activity size={size} className={className} />,
      "file-text": <FileText size={size} className={className} />,
      brain: <Brain size={size} className={className} />,
      package: <Package size={size} className={className} />,
      send: <Send size={size} className={className} />,
      deposit: <ArrowUpCircle size={size} className={className} />,
      bank: <Building size={size} className={className} />,
      "bank-transfer": <Landmark size={size} className={className} />,
      "connect-bank": <Link size={size} className={className} />,
      coins: <Banknote size={size} className={className} />,
      transaction: <RefreshCw size={size} className={className} />,
      "payment-transfer": <ArrowLeftRight size={size} className={className} />,
      shield: <Shield size={size} className={className} />,
      logout: <LogOut size={size} className={className} />,
      edit: <Edit size={size} className={className} />,
      settings: <Settings size={size} className={className} />,
      menu: <Menu size={size} className={className} />,
      bitcoin: <Bitcoin size={size} className={className} />,
      calculator: <Calculator size={size} className={className} />,
      monitor: <Monitor size={size} className={className} />,
      "chevron-right": <ChevronRight size={size} className={className} />,
      "chevron-left": <ChevronLeft size={size} className={className} />,
      "chevron-up": <ChevronUp size={size} className={className} />,
      "chevron-down": <ChevronDown size={size} className={className} />,
    };

    // Check for exact match first
    if (exactMatches[cleanIconName]) {
      return exactMatches[cleanIconName];
    }

    // Then do partial matching for flexibility
    if (cleanIconName.includes("home"))
      return <Home size={size} className={className} />;
    if (cleanIconName.includes("dashboard"))
      return <BarChart2 size={size} className={className} />;
    if (cleanIconName.includes("card") || cleanIconName.includes("credit"))
      return <CreditCard size={size} className={className} />;
    if (cleanIconName.includes("profile") || cleanIconName.includes("user"))
      return <User size={size} className={className} />;
    if (cleanIconName.includes("expense") || cleanIconName.includes("shopping"))
      return <ShoppingBag size={size} className={className} />;
    if (cleanIconName.includes("wallet"))
      return <Wallet size={size} className={className} />;
    if (cleanIconName.includes("dollar") || cleanIconName.includes("money"))
      return <DollarSign size={size} className={className} />;
    if (cleanIconName.includes("calendar"))
      return <Calendar size={size} className={className} />;
    if (cleanIconName.includes("chart"))
      return <BarChart size={size} className={className} />;
    if (cleanIconName.includes("brief"))
      return <Briefcase size={size} className={className} />;
    if (cleanIconName.includes("search"))
      return <Search size={size} className={className} />;
    if (cleanIconName.includes("trend"))
      return <TrendingUp size={size} className={className} />;
    if (cleanIconName.includes("pie"))
      return <PieChart size={size} className={className} />;
    if (cleanIconName.includes("activ"))
      return <Activity size={size} className={className} />;
    if (cleanIconName.includes("file") || cleanIconName.includes("text"))
      return <FileText size={size} className={className} />;
    if (cleanIconName.includes("brain"))
      return <Brain size={size} className={className} />;
    if (cleanIconName.includes("package"))
      return <Package size={size} className={className} />;
    if (cleanIconName.includes("send"))
      return <Send size={size} className={className} />;
    if (cleanIconName.includes("deposit"))
      return <ArrowUpCircle size={size} className={className} />;
    if (cleanIconName.includes("bank"))
      return <Landmark size={size} className={className} />;
    if (cleanIconName.includes("connect"))
      return <Link size={size} className={className} />;
    if (cleanIconName.includes("coins") || cleanIconName.includes("cash"))
      return <Banknote size={size} className={className} />;
    if (cleanIconName.includes("transfer") || cleanIconName.includes("payment"))
      return <ArrowLeftRight size={size} className={className} />;
    if (cleanIconName.includes("transaction"))
      return <RefreshCw size={size} className={className} />;
    if (cleanIconName.includes("bitcoin") || cleanIconName.includes("crypto"))
      return <Bitcoin size={size} className={className} />;
    if (cleanIconName.includes("calculat"))
      return <Calculator size={size} className={className} />;

    // Return null if no match found, allowing fallback to file-based icon
    return null;
  }

  return <div className="flex items-center justify-center">{tryIconSrc()}</div>;
};

export default Icon;
