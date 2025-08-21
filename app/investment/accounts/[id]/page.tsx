import { HeaderBox } from "@/components/HeaderBox";
import {
  getUserBankAccounts,
  getAccountTransactions,
} from "@/lib/actions/banking.actions";
import { getServerAccount } from "@/lib/appwrite/server-config";
import { notFound } from "next/navigation";

// Define types for accounts and transactions
interface AccountType {
  $id?: string;
  id?: string;
  name: string;
  type: string;
  subtype: string;
  balance: number;
  isActive: boolean;
  bankName: string;
  mask: string;
  [key: string]: any; // For other properties
}

interface TransactionType {
  $id?: string;
  id?: string;
  $createdAt?: string;
  createdAt?: string;
  description: string;
  type: string;
  amount: number;
  [key: string]: any; // For other properties
}

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    // Await params in Next.js 15
    const { id } = await params;

    // Get the current user ID
    const account = await getServerAccount().get();
    const userId = account.$id;

    // Fetch user's accounts
    const accountsResult = await getUserBankAccounts(userId);
    if (accountsResult.error) {
      console.error("Error fetching accounts:", accountsResult.error);
      return notFound();
    }

    // Find the specific account
    const accounts = accountsResult.accounts || [];
    const accountDetail = accounts.find(
      (acc: any) => acc.$id === id || acc.id === id
    ) as AccountType | undefined;

    if (!accountDetail) {
      console.error("Account not found");
      return notFound();
    }

    // Check if this is an investment account
    const isInvestment =
      accountDetail.type === "investment" ||
      accountDetail.subtype === "investment";

    if (!isInvestment) {
      console.error("This is not an investment account");
      return notFound();
    }

    // Fetch transactions for this account
    const transactionsResult = await getAccountTransactions(userId, id);
    const transactions = transactionsResult.error
      ? []
      : ((transactionsResult.transactions || []) as TransactionType[]);

    return (
      <div className="p-6 space-y-8">
        <HeaderBox
          type="default"
          title={accountDetail.name}
          subtitle={`${accountDetail.type} - ${accountDetail.subtype}`}
        />

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Account Information
              </h3>
              <div className="mt-4 space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Account Number</span>
                  <p className="text-gray-700">
                    **** **** **** {accountDetail.mask}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Bank</span>
                  <p className="text-gray-700">{accountDetail.bankName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Current Balance</span>
                  <p className="text-xl font-semibold text-gray-900">
                    $
                    {accountDetail.balance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <p
                    className={`text-sm font-medium ${
                      accountDetail.isActive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {accountDetail.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Performance Summary
              </h3>
              <div className="mt-4 space-y-3">
                <div>
                  <span className="text-sm text-gray-500">YTD Return</span>
                  <p className="text-green-600 font-medium">+8.2%</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">1-Year Return</span>
                  <p className="text-green-600 font-medium">+12.5%</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Since Inception</span>
                  <p className="text-green-600 font-medium">+22.3%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Transactions
          </h3>

          {transactions.length === 0 ? (
            <p className="text-gray-500 py-4">
              No transactions found for this account.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction: TransactionType) => (
                    <tr
                      key={
                        transaction.$id ||
                        transaction.id ||
                        Math.random().toString()
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          transaction.$createdAt ||
                            transaction.createdAt ||
                            new Date()
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.type}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}$
                        {Math.abs(transaction.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in account detail page:", error);
    return notFound();
  }
}
