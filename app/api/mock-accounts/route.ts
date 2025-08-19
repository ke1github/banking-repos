import { NextRequest, NextResponse } from "next/server";

// This is a simplified mock API route for testing purposes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  return NextResponse.json({
    accounts: [
      {
        id: "acc_1",
        name: "Main Checking",
        type: "checking",
        balance: 5000,
        isActive: true,
        mask: "1234",
        bankName: "Demo Bank",
      },
      {
        id: "acc_2",
        name: "Savings",
        type: "savings",
        balance: 12000,
        isActive: true,
        mask: "5678",
        bankName: "Demo Bank",
      },
    ],
  });
}
