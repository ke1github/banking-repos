"use client";
import dynamic from "next/dynamic";
const ExpenseManagementClient = dynamic(
  () => import("./ExpenseManagementClient"),
  { ssr: false }
);

export default function ExpenseManagementPage() {
  return (
    <section className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Expense Management</h1>
      <ExpenseManagementClient />
    </section>
  );
}
