"use client";
import dynamic from "next/dynamic";
const CashManagementClient = dynamic(() => import("./CashManagementClient"), {
  ssr: false,
});

export default function CashManagementPage() {
  return (
    <section className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Cash Management</h1>
      <CashManagementClient />
    </section>
  );
}
