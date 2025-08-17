import { Models } from "appwrite";

export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Health"
  | "Entertainment"
  | "Travel"
  | "Other";

export interface ExpenseDoc extends Models.Document {
  userId: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: string;
  updatedAt: string;
}
