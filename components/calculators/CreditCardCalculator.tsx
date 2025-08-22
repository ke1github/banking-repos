import React from "react";
import { CreditCard } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalculatorLayout } from "./CalculatorLayout";
import { FormField } from "./FormField";
import { useCreditCardCalculator } from "@/lib/hooks/calculators/useCreditCardCalculator";
import { formatCurrency } from "@/lib/utils/calculators";

export const CreditCardCalculator: React.FC = () => {
  const {
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
  } = useCreditCardCalculator();

  const inputSection = (
    <div className="space-y-4">
      <FormField
        id="balance"
        label="Current Balance (₹)"
        type="number"
        placeholder="50,000"
        value={balance}
        onChange={(e) => setBalance(e.target.value)}
      />

      <FormField
        id="interest-rate"
        label="Annual Interest Rate (%)"
        type="number"
        placeholder="18"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
      />

      <div>
        <Label htmlFor="payment-strategy">Payment Strategy</Label>
        <Select
          value={paymentStrategy}
          onValueChange={(value: any) => setPaymentStrategy(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select strategy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minimum">Minimum Payment</SelectItem>
            <SelectItem value="fixed">Fixed Payment</SelectItem>
            <SelectItem value="aggressive">Aggressive Payment (10%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {paymentStrategy === "minimum" && (
        <FormField
          id="minimum-payment"
          label="Minimum Payment (₹) - Leave blank for 3% of balance"
          type="number"
          placeholder="1,500"
          value={minimumPayment}
          onChange={(e) => setMinimumPayment(e.target.value)}
        />
      )}

      {paymentStrategy === "fixed" && (
        <FormField
          id="fixed-payment"
          label="Fixed Monthly Payment (₹)"
          type="number"
          placeholder="5,000"
          value={fixedPayment}
          onChange={(e) => setFixedPayment(e.target.value)}
        />
      )}

      <div className="flex gap-2">
        <Button onClick={calculateCreditCard} className="flex-1">
          Calculate
        </Button>
        <Button variant="outline" onClick={resetForm}>
          Reset
        </Button>
      </div>
    </div>
  );

  const resultSection = result && (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Credit Card Payoff Results</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Months to Payoff</div>
            <div className="text-xl font-bold text-red-600">
              {result.monthsToPayoff === Infinity
                ? "Never"
                : `${result.monthsToPayoff} months`}
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Interest</div>
            <div className="text-xl font-bold text-orange-600">
              {result.totalInterest === Infinity
                ? "Infinite"
                : formatCurrency(result.totalInterest)}
            </div>
          </div>
        </div>

        {result.paymentStrategies && (
          <div className="space-y-3">
            <h4 className="font-medium">Payment Strategy Comparison</h4>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Minimum Payment Strategy</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Time: </span>
                  <span className="font-semibold">
                    {result.paymentStrategies.minimum.months === Infinity
                      ? "Never"
                      : `${result.paymentStrategies.minimum.months} months`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Interest: </span>
                  <span className="font-semibold">
                    {result.paymentStrategies.minimum.interest === Infinity
                      ? "Infinite"
                      : formatCurrency(
                          result.paymentStrategies.minimum.interest
                        )}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Fixed Payment Strategy</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Time: </span>
                  <span className="font-semibold">
                    {result.paymentStrategies.fixed.months === Infinity
                      ? "Never"
                      : `${result.paymentStrategies.fixed.months} months`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Interest: </span>
                  <span className="font-semibold">
                    {result.paymentStrategies.fixed.interest === Infinity
                      ? "Infinite"
                      : formatCurrency(result.paymentStrategies.fixed.interest)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Aggressive Payment Strategy</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Time: </span>
                  <span className="font-semibold">
                    {result.paymentStrategies.aggressive.months} months
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Interest: </span>
                  <span className="font-semibold">
                    {formatCurrency(
                      result.paymentStrategies.aggressive.interest
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <CalculatorLayout title="Credit Card Calculator" icon={CreditCard}>
      {inputSection}
      {resultSection}
    </CalculatorLayout>
  );
};
