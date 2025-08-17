"use client";
import { useEffect, useState } from "react";
import { Account, Client, Databases, ID, Models } from "appwrite";
import { CashDoc } from "@/types/cash";
import { DateField } from "@/components/ui/DateField";

export default function CashManagementClient() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [cash, setCash] = useState<CashDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    amount: "",
    type: "in",
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
      process.env.NEXT_PUBLIC_APPWRITE_CASH_COLLECTION_ID!,
      ["userId=" + user.$id]
    )
      .then((res) => setCash(res.documents as CashDoc[]))
      .catch(() => setCash([]))
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
        process.env.NEXT_PUBLIC_APPWRITE_CASH_COLLECTION_ID!,
        ID.unique(),
        {
          userId: user.$id,
          amount: parseFloat(form.amount),
          type: form.type,
          date: form.date,
          note: form.note,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      setForm({ amount: "", type: "in", date: "", note: "" });
    } catch (err) {
      setError("Failed to add cash record.");
    } finally {
      setSaving(false);
    }
  };

  const cashBalance = cash.reduce(
    (sum, c) => sum + (c.type === "in" ? c.amount : -c.amount),
    0
  );

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-100 p-4 grid gap-3 max-w-md"
      >
        <h2 className="text-lg font-semibold mb-2">Add Cash Movement</h2>
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
          Type
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
          >
            <option value="in">Cash In</option>
            <option value="out">Cash Out</option>
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
          {saving ? "Saving..." : "Add Record"}
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
      <div>
        <h2 className="text-lg font-semibold mb-2">Cash Balance</h2>
        <div className="text-2xl font-bold text-green-700 mb-4">
          ₹{cashBalance.toFixed(2)}
        </div>
        <h2 className="text-lg font-semibold mb-2">Cash Movements</h2>
        {loading ? (
          <div className="text-gray-500">Loading…</div>
        ) : !cash.length ? (
          <div className="text-gray-400">No cash records yet.</div>
        ) : (
          <ul className="divide-y divide-gray-100 bg-white rounded-lg border border-gray-100">
            {cash.map((c) => (
              <li key={c.$id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div
                    className={
                      c.type === "in"
                        ? "text-green-700 font-medium"
                        : "text-red-700 font-medium"
                    }
                  >
                    {c.type === "in" ? "+" : "-"}₹{c.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{c.date}</div>
                  {c.note && (
                    <div className="text-xs text-gray-400 mt-0.5">{c.note}</div>
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
