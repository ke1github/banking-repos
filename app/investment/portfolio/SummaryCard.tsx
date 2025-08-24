"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  change?: number;
  changePercent?: number;
  subtitle?: string;
  icon?: React.ReactNode;
  valuePrefix?: string;
  changePrefix?: string;
  className?: string;
}

export const SummaryCard = ({
  title,
  value,
  change,
  changePercent,
  subtitle,
  icon,
  valuePrefix = "$",
  changePrefix = "$",
  className,
}: SummaryCardProps) => {
  const isPositive = change !== undefined ? change >= 0 : true;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-gray-500">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          <div className="text-3xl font-bold">
            {valuePrefix}
            {value.toLocaleString()}
          </div>

          {changePercent !== undefined && (
            <div
              className={`ml-2 flex items-center text-sm font-medium ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {isPositive ? "+" : ""}
              {changePercent}%
            </div>
          )}
        </div>

        {subtitle && (
          <p className="text-sm text-muted-foreground mt-2">
            {change !== undefined && (
              <>
                {isPositive ? "+" : ""}
                {changePrefix}
                {Math.abs(change).toLocaleString()}{" "}
              </>
            )}
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
