import {
  Home,
  PiggyBank,
  TrendingUp,
  CreditCard,
  LineChart,
  Shield,
  Building,
  BarChart3,
  LucideIcon,
} from "lucide-react";

export interface CalculatorTab {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  color: string;
}

export const CALCULATOR_TABS: CalculatorTab[] = [
  {
    id: "loan",
    label: "Loan EMI",
    icon: Home,
    description:
      "Calculate monthly payments with advanced features like prepayment analysis",
    color: "blue",
  },
  {
    id: "savings",
    label: "Savings",
    icon: PiggyBank,
    description:
      "Plan your savings with compound interest and goal-based calculations",
    color: "green",
  },
  {
    id: "fd",
    label: "Fixed Deposit",
    icon: TrendingUp,
    description: "Calculate FD returns with compound interest",
    color: "yellow",
  },
  {
    id: "creditcard",
    label: "Credit Card",
    icon: CreditCard,
    description: "Calculate credit card payments and interest",
    color: "red",
  },
  {
    id: "sip",
    label: "SIP",
    icon: LineChart,
    description:
      "Calculate SIP maturity with step-up features for wealth building",
    color: "purple",
  },
  {
    id: "ppf",
    label: "PPF",
    icon: Shield,
    description: "Calculate PPF returns and tax benefits",
    color: "indigo",
  },
  {
    id: "eligibility",
    label: "Loan Eligibility",
    icon: Building,
    description: "Check loan eligibility based on income and expenses",
    color: "orange",
  },
  {
    id: "compare",
    label: "Compare",
    icon: BarChart3,
    description: "Compare different financial products and options",
    color: "gray",
  },
];

export const CALCULATOR_COLORS = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  yellow: "bg-yellow-50 text-yellow-600",
  red: "bg-red-50 text-red-600",
  purple: "bg-purple-50 text-purple-600",
  indigo: "bg-indigo-50 text-indigo-600",
  orange: "bg-orange-50 text-orange-600",
  gray: "bg-gray-50 text-gray-600",
};
