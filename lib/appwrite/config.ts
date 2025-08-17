import { Client, Account, Databases, ID, Query } from "appwrite";

export const appwriteConfig = {
  endpoint:
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "",
  databaseId: process.env.APPWRITE_DATABASE_ID || "",
  userCollectionId: process.env.APPWRITE_USER_COLLECTION_ID || "",
  bankCollectionId: process.env.APPWRITE_BANK_COLLECTION_ID || "",
  transactionCollectionId: process.env.APPWRITE_TRANSACTION_COLLECTION_ID || "",
};

// Initialize the Appwrite client
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);

// Utility function to check if running on server side
export const isServer = () => typeof window === "undefined";

export { ID, Query };
