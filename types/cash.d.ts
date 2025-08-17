import { Models } from "appwrite";

export interface CashDoc extends Models.Document {
  userId: string;
  amount: number;
  type: "in" | "out";
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: string;
  updatedAt: string;
}
