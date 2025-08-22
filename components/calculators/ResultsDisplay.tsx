import React from "react";
import { Info } from "lucide-react";

interface ResultItem {
  label: string;
  value: string;
  bgColor?: string;
}

interface ResultsDisplayProps {
  title: string;
  results: ResultItem[];
  infoMessage?: string;
  className?: string;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  title,
  results,
  infoMessage,
  className = "",
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={index}
            className={`flex justify-between p-3 rounded-lg ${
              result.bgColor || "bg-gray-50"
            }`}
          >
            <span>{result.label}:</span>
            <span className="font-semibold">{result.value}</span>
          </div>
        ))}
      </div>
      {infoMessage && (
        <div className="p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800">
            <Info className="h-4 w-4 inline mr-1" />
            {infoMessage}
          </p>
        </div>
      )}
    </div>
  );
};
