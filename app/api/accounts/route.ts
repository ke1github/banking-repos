import { NextRequest, NextResponse } from "next/server";

// Simplified API route for retrieving accounts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  try {
    // In a real app, we would authenticate the user and retrieve their accounts
    // For demo purposes, we're returning mock data
    const mockAccounts = [
      {
        id: "acc_1",
        name: "Main Checking",
        type: "checking",
        subtype: "personal",
        balance: 5240.75,
        mask: "1234",
        bankName: "Demo Bank",
        isActive: true,
        bankLogo: "/icons/bank-logo.svg",
        lastTransaction: {
          amount: 750,
          date: "2025-08-15",
          description: "Payroll deposit",
          isCredit: true,
        },
      },
      {
        id: "acc_2",
        name: "Savings",
        type: "savings",
        subtype: "personal",
        balance: 12450.5,
        mask: "5678",
        bankName: "Demo Bank",
        isActive: true,
        bankLogo: "/icons/bank-logo.svg",
      },
      {
        id: "acc_3",
        name: "Credit Card",
        type: "credit",
        subtype: "credit_card",
        balance: -1240.3,
        mask: "9012",
        bankName: "Demo Bank",
        isActive: true,
        bankLogo: "/icons/bank-logo.svg",
        lastTransaction: {
          amount: -125.4,
          date: "2025-08-14",
          description: "Restaurant purchase",
          isCredit: false,
        },
      },
    ];

    return NextResponse.json({
      accounts: mockAccounts,
    });
  } catch (error) {
    console.error("Error in GET /api/accounts:", error);
    return NextResponse.json(
      { message: "Failed to retrieve accounts", statusCode: 500 },
      { status: 500 }
    );
  }
}
