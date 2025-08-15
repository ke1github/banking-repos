import React from "react";
import Logo from "@/components/ui/logo";

interface HeaderBoxProps {
  type: string;
  title: string;
  user?: string;
  subtext: string;
  showLogo?: boolean;
}

export const HeaderBox: React.FC<HeaderBoxProps> = ({
  type,
  title,
  user,
  subtext,
  showLogo = false,
}) => (
  <div className="mb-2">
    <div className="flex items-center gap-3 mb-1">
      {showLogo && <Logo variant="small" showText={false} />}
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
        {title}
        {type === "greeting" && (
          <span className="text-blue-600 font-bold"> {user}</span>
        )}
      </h1>
    </div>
    <p className="text-sm text-gray-600 max-w-2xl">{subtext}</p>
  </div>
);
