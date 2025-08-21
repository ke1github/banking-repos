"use client";
import { useEffect, useState } from "react";
import { Account, Client, Databases, ID, Models } from "appwrite";
import BankDetails from "@/components/BankDetails";
import { DateField } from "@/components/ui/DateField";

function ConnectBankClient() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
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
      .then((u) => {
        setUser(u);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching user account:", e);
        setUser(null);
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    try {
      if (!user) throw new Error("User not loaded");
      const client = new Client()
        .setEndpoint(
          process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
            "https://cloud.appwrite.io/v1"
        )
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "");
      const databases = new Databases(client);
      const userId = user.$id;
      const name = formData.get("name") as string;
      const accountType = (formData.get("accountType") as string) || "checking";
      const currency = (formData.get("currency") as string) || "INR";
      const initialBalance = Number(formData.get("initialBalance") || 0);
      const bankName = (formData.get("bankName") as string) || undefined;
      const bankBranch = (formData.get("bankBranch") as string) || undefined;
      const accountNumber = Math.floor(
        Math.random() * 9000000000 + 1000000000
      ).toString();
      const data = {
        userId,
        accountNumber,
        routingNumber: "021000021",
        accountType,
        balance: initialBalance,
        currency,
        name,
        isActive: true,
        bankName,
        branch: bankBranch,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_BANK_COLLECTION_ID!,
        ID.unique(),
        data
      );
      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError("Failed to create bank account. " + message);
    }
  }

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (!user)
    return (
      <p className="text-sm text-gray-600">Please sign in to connect a bank.</p>
    );
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg border border-gray-100 p-4 grid gap-3 max-w-lg"
    >
      <DateField />
      <label className="text-sm text-gray-700">
        Account Name
        <input
          name="name"
          placeholder="e.g., HDFC Savings"
          className="mt-1 w-full rounded-lg border border-gray-300 p-2"
          required
        />
      </label>
      <label className="text-sm text-gray-700">
        Account Type
        <select
          name="accountType"
          className="mt-1 w-full rounded-lg border border-gray-300 p-2"
        >
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="credit">Credit</option>
        </select>
      </label>
      <label className="text-sm text-gray-700">
        Currency
        <input
          name="currency"
          defaultValue="INR"
          className="mt-1 w-full rounded-lg border border-gray-300 p-2"
        />
      </label>
      <label className="text-sm text-gray-700">
        Initial Balance
        <input
          name="initialBalance"
          type="number"
          step="0.01"
          min="0"
          defaultValue="0"
          className="mt-1 w-full rounded-lg border border-gray-300 p-2"
        />
      </label>
      <div>
        <h2 className="text-lg font-medium">Find bank by IFSC</h2>
        <p className="text-gray-600 text-sm">
          Use lookup to auto-fill bank details.
        </p>
        <div className="mt-3">
          <BankDetails />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="text-sm text-gray-700">
          Bank Name
          <input
            name="bankName"
            placeholder="Auto-fill from IFSC"
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
          />
        </label>
        <label className="text-sm text-gray-700">
          Branch
          <input
            name="bankBranch"
            placeholder="Auto-fill from IFSC"
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
          />
        </label>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium"
      >
        Create Account
      </button>
      {success && (
        <p className="text-green-600">Bank account created successfully!</p>
      )}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}

export default ConnectBankClient;
// ...existing code...
