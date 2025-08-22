import React from "react";
import { LucideIcon } from "lucide-react";
import { CalculatorLayout } from "./CalculatorLayout";

interface PlaceholderCalculatorProps {
  title: string;
  icon: LucideIcon;
  message?: string;
}

export const PlaceholderCalculator: React.FC<PlaceholderCalculatorProps> = ({
  title,
  icon: Icon,
  message = "implementation coming soon...",
}) => (
  <CalculatorLayout title={title} icon={Icon}>
    <div className="text-center p-8 text-gray-500">
      <Icon className="h-12 w-12 mx-auto mb-4" />
      <p>
        {title} {message}
      </p>
    </div>
  </CalculatorLayout>
);
