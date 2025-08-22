import { useState } from "react";
import { CreditCardResult, PaymentStrategy } from "@/types/calculators";

export const useCreditCardCalculator = () => {
  const [balance, setBalance] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [minimumPayment, setMinimumPayment] = useState("");
  const [fixedPayment, setFixedPayment] = useState("");
  const [paymentStrategy, setPaymentStrategy] =
    useState<PaymentStrategy>("minimum");
  const [result, setResult] = useState<CreditCardResult | null>(null);

  const calculateCreditCard = () => {
    const currentBalance = parseFloat(balance);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const minPayment = parseFloat(minimumPayment) || currentBalance * 0.03; // 3% default
    const fixedPay = parseFloat(fixedPayment) || 0;

    if (currentBalance && monthlyRate) {
      const strategies = {
        minimum: calculatePayoffTime(currentBalance, monthlyRate, minPayment),
        fixed:
          fixedPay > 0
            ? calculatePayoffTime(currentBalance, monthlyRate, fixedPay)
            : null,
        aggressive: calculatePayoffTime(
          currentBalance,
          monthlyRate,
          currentBalance * 0.1
        ), // 10% of balance
      };

      const selectedStrategy = strategies[paymentStrategy];

      setResult({
        monthsToPayoff: selectedStrategy?.months || 0,
        totalInterest: selectedStrategy?.interest || 0,
        paymentStrategies: {
          minimum: strategies.minimum,
          fixed: strategies.fixed || strategies.minimum,
          aggressive: strategies.aggressive,
        },
      });
    }
  };

  const calculatePayoffTime = (
    balance: number,
    monthlyRate: number,
    payment: number
  ) => {
    let currentBalance = balance;
    let months = 0;
    let totalInterest = 0;
    const maxMonths = 600; // 50 years max to prevent infinite loops

    while (currentBalance > 0.01 && months < maxMonths) {
      const interestPayment = currentBalance * monthlyRate;
      const principalPayment = Math.min(
        payment - interestPayment,
        currentBalance
      );

      if (principalPayment <= 0) {
        // Payment is less than interest, balance will never be paid off
        return { months: Infinity, interest: Infinity };
      }

      totalInterest += interestPayment;
      currentBalance -= principalPayment;
      months++;
    }

    return { months, interest: totalInterest };
  };

  const resetForm = () => {
    setBalance("");
    setInterestRate("");
    setMinimumPayment("");
    setFixedPayment("");
    setPaymentStrategy("minimum");
    setResult(null);
  };

  return {
    balance,
    interestRate,
    minimumPayment,
    fixedPayment,
    paymentStrategy,
    result,
    setBalance,
    setInterestRate,
    setMinimumPayment,
    setFixedPayment,
    setPaymentStrategy,
    calculateCreditCard,
    resetForm,
  };
};
