"use client";
import { useEffect, useState } from "react";
import { Account, Client, Databases, ID, Models } from "appwrite";
import { ExpenseDoc, ExpenseCategory } from "@/types/expense";
import { DateField } from "@/components/ui/DateField";

const CATEGORIES: ExpenseCategory[] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Travel",
  "Other",
];

export default function ExpenseManagementClient() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [expenses, setExpenses] = useState<ExpenseDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    date: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const client = new Client()
      .setEndpoint(
        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
          "https://cloud.appwrite.io/v1"
      )
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "");
    const account = new Account(client);
    account
      .get()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const client = new Client()
      .setEndpoint(
        process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
          "https://cloud.appwrite.io/v1"
      )
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "");
    const db = new Databases(client);
    db.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_EXPENSE_COLLECTION_ID!,
      ["userId=" + user.$id]
    )
      .then((res) => setExpenses(res.documents as ExpenseDoc[]))
      .catch(() => setExpenses([]))
      .finally(() => setLoading(false));
  }, [user, saving]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (date: string | undefined) => {
    setForm((f) => ({ ...f, date: date || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      const client = new Client()
        .setEndpoint(
          process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
            "https://cloud.appwrite.io/v1"
        )
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "");
      const db = new Databases(client);
      await db.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_EXPENSE_COLLECTION_ID!,
        ID.unique(),
        {
          userId: user.$id,
          amount: parseFloat(form.amount),
          category: form.category,
          date: form.date,
          note: form.note,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      setForm({ amount: "", category: "Food", date: "", note: "" });
    } catch {
      setError("Failed to add expense.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-100 p-4 grid gap-3 max-w-md"
      >
        <h2 className="text-lg font-semibold mb-2">Add Expense</h2>
        <label className="text-sm text-gray-700">
          Amount
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            required
            value={form.amount}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
          />
        </label>
        <label className="text-sm text-gray-700">
          Category
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <DateField
          label="Date"
          value={form.date}
          onChange={handleDateChange}
          className="w-full"
        />
        <label className="text-sm text-gray-700">
          Note
          <input
            name="note"
            value={form.note}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
            placeholder="Optional"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium"
          disabled={saving}
        >
          {saving ? "Saving..." : "Add Expense"}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
      <div>
        <h2 className="text-lg font-semibold mb-2">Your Expenses</h2>
        {loading ? (
          <div className="text-gray-500">Loading…</div>
        ) : !expenses.length ? (
          <div className="text-gray-400">No expenses yet.</div>
        ) : (
          <ul className="divide-y divide-gray-100 bg-white rounded-lg border border-gray-100">
            {expenses.map((exp) => (
              <li key={exp.$id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">
                    ₹{exp.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {exp.category} • {exp.date}
                  </div>
                  {exp.note && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      {exp.note}
                    </div>
                  )}
                </div>
                {/* TODO: Add edit/delete actions */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
