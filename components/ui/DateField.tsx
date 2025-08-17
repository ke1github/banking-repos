"use client";
import * as React from "react";
import { DatePicker } from "@/components/ui/DatePicker";

interface DateFieldProps {
  value?: string;
  onChange?: (date: string | undefined) => void;
  label?: string;
  className?: string;
  name?: string;
}

export function DateField({
  value,
  onChange,
  label = "Date",
  className,
  name = "date",
}: DateFieldProps) {
  // Accept value as string (YYYY-MM-DD) and convert to Date for DatePicker
  const dateValue = value ? new Date(value) : undefined;
  const handleChange = (date: Date | undefined) => {
    if (onChange) {
      onChange(date ? date.toISOString().slice(0, 10) : undefined);
    }
  };
  return (
    <div className={className}>
      <label className="text-sm text-gray-700">
        {label}
        <DatePicker
          value={dateValue}
          onChange={handleChange}
          placeholder="Select date"
        />
      </label>
      <input
        type="hidden"
        name={name}
        value={dateValue ? dateValue.toISOString().slice(0, 10) : ""}
      />
    </div>
  );
}
