"use client";

import * as React from "react";
import BankDetails from "@/components/BankDetails";

export type BeneficiaryValues = {
  ifsc: string;
  bank: string;
  branch: string;
};

export default function BeneficiaryBankFields({
  initialIfsc = "",
  onChangeAction,
  className,
  ifscFieldName = "beneficiary_ifsc",
  bankFieldName = "beneficiary_bank",
  branchFieldName = "beneficiary_branch",
}: {
  initialIfsc?: string;
  onChangeAction?: (v: BeneficiaryValues) => void;
  className?: string;
  ifscFieldName?: string;
  bankFieldName?: string;
  branchFieldName?: string;
}) {
  const [ifsc, setIfsc] = React.useState(initialIfsc);
  const [bank, setBank] = React.useState("");
  const [branch, setBranch] = React.useState("");

  React.useEffect(() => {
    onChangeAction?.({ ifsc, bank, branch });
  }, [ifsc, bank, branch, onChangeAction]);

  return (
    <div className={className}>
      <div className="grid grid-cols-1 gap-3">
        <div className="text-sm text-gray-700">Beneficiary bank</div>
        <div className="grid sm:grid-cols-3 gap-3">
          <label className="text-sm text-gray-700">
            IFSC
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              placeholder="IFSC (11 chars)"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
            />
          </label>
          <label className="text-sm text-gray-700">
            Bank
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              placeholder="Bank"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
            />
          </label>
          <label className="text-sm text-gray-700">
            Branch
            <input
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              placeholder="Branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="mt-3">
        <BankDetails
          initialIfsc={ifsc}
          onResolved={(d) => {
            if (d.IFSC) setIfsc(d.IFSC);
            if (d.BANK) setBank(d.BANK);
            if (d.BRANCH) setBranch(d.BRANCH);
          }}
        />
      </div>

      {/* Hidden inputs so parent <form> captures these values */}
      <input type="hidden" name={ifscFieldName} value={ifsc} />
      <input type="hidden" name={bankFieldName} value={bank} />
      <input type="hidden" name={branchFieldName} value={branch} />
    </div>
  );
}
