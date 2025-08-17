"use client";
import ConnectBankClient from "./ConnectBankClient";

export default function ConnectBankPage() {
  return (
    <section className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Connect Bank</h1>
        <p className="text-gray-600">Securely connect a new bank account.</p>
      </div>
      <ConnectBankClient />
    </section>
  );
}
