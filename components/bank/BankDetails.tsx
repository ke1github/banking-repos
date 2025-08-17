"use client";

import * as React from "react";
import { useActionState, useTransition } from "react";
import {
  lookupIfscAction,
  type IfscDetails,
} from "@/lib/actions/bankinfo.actions";

export type BankDetailsProps = {
  initialIfsc?: string;
  onResolved?: (data: IfscDetails) => void;
  className?: string;
};

export default function BankDetails({
  initialIfsc = "",
  onResolved,
  className,
}: BankDetailsProps) {
  const [state, act, pending] = useActionState(
    lookupIfscAction as unknown as (
      prev: unknown,
      formData: FormData
    ) => Promise<{ ok: true; data: IfscDetails } | { error: string }>,
    null as unknown
  );
  const [ifsc, setIfsc] = React.useState(initialIfsc);
  const [result, setResult] = React.useState<IfscDetails | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isTrans, startTrans] = useTransition();

  React.useEffect(() => {
    if (!state) return;
    if (typeof state === "object" && state && "error" in state) {
      setError(state.error as string);
      setResult(null);
    } else if (typeof state === "object" && state && "ok" in state) {
      const data = (state as { ok: true; data: IfscDetails }).data;
      setError(null);
      setResult(data);
      onResolved?.(data);
    }
  }, [state, onResolved]);

  const submitLookup = () => {
    const fd = new FormData();
    fd.set("ifsc", ifsc.trim());
    startTrans(() => act(fd));
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              submitLookup();
            }
          }}
          placeholder="Enter IFSC (e.g., HDFC0000123)"
          className="border rounded px-3 py-2 text-sm flex-1 min-w-[220px]"
          aria-label="IFSC code"
        />
        <button
          type="button"
          onClick={submitLookup}
          disabled={pending || isTrans}
          className="px-3 py-2 text-sm rounded bg-gray-900 text-white disabled:opacity-60"
        >
          {pending || isTrans ? "Looking up…" : "Lookup"}
        </button>
      </div>

      {error ? (
        <div className="mt-3 text-red-600 text-sm">{error}</div>
      ) : result ? (
        <div className="mt-4 bg-white rounded-lg border border-gray-100 p-4 text-sm">
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
            <div>
              <span className="text-gray-500">Bank</span>
              <div className="font-medium">{result.BANK || "—"}</div>
            </div>
            <div>
              <span className="text-gray-500">IFSC</span>
              <div className="font-medium">{result.IFSC || "—"}</div>
            </div>
            <div>
              <span className="text-gray-500">Branch</span>
              <div className="font-medium">{result.BRANCH || "—"}</div>
            </div>
            <div>
              <span className="text-gray-500">City</span>
              <div className="font-medium">{result.CITY || "—"}</div>
            </div>
            <div>
              <span className="text-gray-500">District</span>
              <div className="font-medium">{result.DISTRICT || "—"}</div>
            </div>
            <div>
              <span className="text-gray-500">State</span>
              <div className="font-medium">{result.STATE || "—"}</div>
            </div>
            <div className="sm:col-span-2">
              <span className="text-gray-500">Address</span>
              <div className="font-medium">{result.ADDRESS || "—"}</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Services: {result.UPI ? "UPI" : ""} {result.NEFT ? "NEFT" : ""}{" "}
            {result.RTGS ? "RTGS" : ""} {result.IMPS ? "IMPS" : ""}
          </div>
        </div>
      ) : null}
    </div>
  );
}
