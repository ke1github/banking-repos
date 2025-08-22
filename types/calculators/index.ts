// Shared calculator types and interfaces

export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  amortizationSchedule?: AmortizationEntry[];
  prepaymentSavings?: number;
}

export interface SavingsResult {
  futureValue: number;
  totalDeposits: number;
  totalInterest: number;
  realValue?: number;
  monthlyRequiredForGoal?: number;
  yearsToReachGoal?: number;
}

export interface FDResult {
  maturityAmount: number;
  interestEarned: number;
  taxableInterest: number;
  taxAmount: number;
  postTaxReturns: number;
  effectiveRate: number;
}

export interface CreditCardResult {
  monthsToPayoff: number;
  totalInterest: number;
  paymentStrategies?: {
    minimum: { months: number; interest: number };
    fixed: { months: number; interest: number };
    aggressive: { months: number; interest: number };
  };
}

export interface PPFResult {
  maturityAmount: number;
  totalInvestment: number;
  totalInterest: number;
  taxSavings: number;
}

export interface SIPResult {
  maturityAmount: number;
  totalInvestment: number;
  wealthGained: number;
  stepUpBenefit?: number;
}

export interface EligibilityResult {
  maxLoanAmount: number;
  maxEmi: number;
  recommendedLoanAmount: number;
}

export interface CalculatorInputProps {
  onCalculate: () => void;
  disabled?: boolean;
}

export interface CalculatorResultProps {
  className?: string;
}

export type CompoundFrequency = "yearly" | "quarterly" | "monthly";
export type CalculationType = "future-value" | "goal-planning" | "time-to-goal";
export type LoanType = "home" | "car" | "personal";
export type PaymentStrategy = "minimum" | "fixed" | "aggressive";
