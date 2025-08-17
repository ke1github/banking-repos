import { redirect } from "next/navigation";
import { getServerAccount } from "@/lib/appwrite/server-config";
import { createBankAccount } from "@/lib/actions/banking.actions";

export const dynamic = "force-dynamic";

export default function AddCardPage() {
  async function createCardAction(formData: FormData) {
    "use server";

    // Resolve current user
    const account = getServerAccount();
    let userId: string | null = null;
    try {
      const user = await account.get();
      userId = user.$id;
    } catch {
      redirect("/sign-in");
    }

    if (!userId) redirect("/sign-in");

    const bankName = String(formData.get("bankName") || "").trim();
    const network = String(formData.get("network") || "").trim();
    const last4Raw = String(formData.get("last4") || "");
    const creditLimit = Number(formData.get("creditLimit") || 0);
    const currency = String(formData.get("currency") || "INR").trim();

    const last4 = last4Raw.replace(/\D/g, "").slice(-4);
    if (!bankName || !network || last4.length !== 4) {
      throw new Error("Bank, network, and last 4 digits are required");
    }

    const displayName = `${bankName} ${network.toUpperCase()} ••••${last4}`;

    const fd = new FormData();
    fd.append("name", displayName);
    fd.append("accountType", "credit");
    fd.append("currency", currency);
    fd.append(
      "initialBalance",
      String(Number.isFinite(creditLimit) ? creditLimit : 0)
    );

    const res = await createBankAccount(userId, fd);
    if ((res as { error?: string }).error) {
      throw new Error((res as { error: string }).error);
    }

    redirect("/cards-accounts");
  }

  return (
    <section className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Add Card</h1>
      <p className="text-gray-600">Add a new credit card to your wallet.</p>

      <form
        action={createCardAction}
        className="bg-white rounded-lg border border-gray-100 p-4 grid gap-3 max-w-lg"
      >
        <label className="text-sm text-gray-700">
          Bank Name
          <input
            name="bankName"
            required
            placeholder="e.g., HDFC Bank"
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
          />
        </label>

        <label className="text-sm text-gray-700">
          Card Network
          <select
            name="network"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
          >
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="amex">Amex</option>
            <option value="rupay">RuPay</option>
          </select>
        </label>

        <label className="text-sm text-gray-700">
          Last 4 digits
          <input
            name="last4"
            inputMode="numeric"
            pattern="\\d{4}"
            maxLength={4}
            required
            placeholder="1234"
            className="mt-1 w-full rounded-lg border border-gray-300 p-2"
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm text-gray-700">
            Credit limit
            <input
              name="creditLimit"
              type="number"
              step="0.01"
              min={0}
              placeholder="0.00"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
            />
          </label>
          <label className="text-sm text-gray-700">
            Currency
            <select
              name="currency"
              defaultValue="INR"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium"
        >
          Create Card
        </button>
      </form>
    </section>
  );
}
