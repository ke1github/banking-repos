import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CalculatorLayoutProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  description?: string;
}

export const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({
  title,
  icon: Icon,
  children,
  description,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
      </CardContent>
    </Card>
  );
};
