import {
  TrendingUp,
  Target,
  DollarSign,
  PieChart,
  Calculator,
  BarChart3,
  Wallet,
  Building,
} from "lucide-react";

export const INVESTMENT_CALCULATOR_TABS = [
  {
    id: "compound",
    label: "Compound Interest",
    description:
      "Calculate how your investments grow with compound returns over time",
    icon: TrendingUp,
    color: "blue",
  },
  {
    id: "retirement",
    label: "Retirement Planner",
    description: "Plan and estimate your retirement savings and income needs",
    icon: Target,
    color: "green",
  },
  {
    id: "roi",
    label: "ROI Calculator",
    description: "Calculate return on investment and analyze profitability",
    icon: DollarSign,
    color: "yellow",
  },
  {
    id: "allocation",
    label: "Asset Allocation",
    description:
      "Optimize your portfolio mix based on risk tolerance and goals",
    icon: PieChart,
    color: "purple",
  },
  {
    id: "monte-carlo",
    label: "Monte Carlo",
    description:
      "Simulate portfolio performance under various market scenarios",
    icon: BarChart3,
    color: "red",
  },
  {
    id: "rebalancing",
    label: "Rebalancing",
    description:
      "Calculate when and how to rebalance your investment portfolio",
    icon: Calculator,
    color: "indigo",
  },
  {
    id: "dividend",
    label: "Dividend Growth",
    description: "Analyze dividend-paying stocks and projected income growth",
    icon: Wallet,
    color: "orange",
  },
  {
    id: "real-estate",
    label: "Real Estate ROI",
    description:
      "Calculate returns on real estate investments and rental properties",
    icon: Building,
    color: "teal",
  },
];

export const INVESTMENT_CALCULATOR_COLORS = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  yellow: "bg-yellow-100 text-yellow-600",
  purple: "bg-purple-100 text-purple-600",
  red: "bg-red-100 text-red-600",
  indigo: "bg-indigo-100 text-indigo-600",
  orange: "bg-orange-100 text-orange-600",
  teal: "bg-teal-100 text-teal-600",
};
