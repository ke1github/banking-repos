type AccountDoc = {
  $id: string;
  name?: string;
  accountType?: string;
};
import BeneficiaryBankFields from "@/components/BeneficiaryBankFields";
import { DateField } from "@/components/ui/DateField";
import { getServerAccount } from "@/lib/appwrite/server-config";
import { getUserBankAccounts } from "@/lib/actions/banking.actions";
import { createTransactionAction } from "@/lib/actions/banking.actions";

export const dynamic = "force-dynamic";

export default async function SendMoneyPage() {
  let userId: string | null = null;
  try {
    const account = getServerAccount();
    const user = await account.get();
    userId = user.$id;
  } catch (e) {
    console.error("Error getting server account:", e);
  }

  let accounts: Array<{ id: string; name: string }> = [];
  if (userId) {
    const res = await getUserBankAccounts(userId);
    if (!("error" in res) && res.accounts) {
      accounts = res.accounts.map((doc: AccountDoc) => ({
        id: doc.$id,
        name:
          doc.name ||
          `${(doc.accountType || "")[0] || "A"}${(
            doc.accountType || "account"
          ).slice(1)} Account`,
      }));
    }
  }

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Send Money</h1>
      <p className="text-gray-600">
        Send money to contacts quickly and securely.
      </p>
      {!userId ? (
        <p className="text-sm text-gray-600">Please sign in to send money.</p>
      ) : accounts.length === 0 ? (
        <p className="text-sm text-gray-600">
          No accounts found. Connect a bank first.
        </p>
      ) : (
        <form
          action={async (formData) => {
            "use server";
            await createTransactionAction(null, formData);
          }}
          className="bg-white rounded-lg border border-gray-100 p-4 grid gap-3 max-w-md"
        >
          <DateField />
          <input type="hidden" name="type" value="transfer" />
          <label className="text-sm text-gray-700">
            From Account
            <select
              name="accountId"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-gray-700">
            Recipient
            <input
              name="recipient"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
              placeholder="Name or email"
            />
          </label>
          <BeneficiaryBankFields className="pt-1" />
          <label className="text-sm text-gray-700">
            Amount
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-4 py-2 font-medium"
          >
            Send
          </button>
        </form>
      )}
    </section>
  );
}
