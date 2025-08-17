"use client";
import * as React from "react";
import { DatePicker } from "@/components/ui/DatePicker";

export function DateField() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  return (
    <div>
      <label className="text-sm text-gray-700">
        Date
        <DatePicker value={date} onChange={setDate} placeholder="Select date" />
      </label>
      <input type="hidden" name="date" value={date ? date.toISOString() : ""} />
    </div>
  );
}
