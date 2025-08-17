import "server-only";
// Web SDK (for Account/session-related operations)
import { Client as WebClient, Account, ID, Query } from "appwrite";
// Node SDK (for privileged Databases/Storage operations via API key)
import type { Client as NodeClient } from "node-appwrite";
import {
  Client as NodeSdkClient,
  Databases as NodeDatabases,
  Teams as NodeTeams,
  Permission,
  Role,
} from "node-appwrite";

export const appwriteConfig = {
  endpoint:
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "",
  databaseId: process.env.APPWRITE_DATABASE_ID || "",
  userCollectionId: process.env.APPWRITE_USER_COLLECTION_ID || "",
  bankCollectionId: process.env.APPWRITE_BANK_COLLECTION_ID || "",
  transactionCollectionId: process.env.APPWRITE_TRANSACTION_COLLECTION_ID || "",
};

// Server-side only client
let serverClient: WebClient | null = null; // web client for Account APIs
let adminClient: NodeClient | null = null; // node client with API key for DB
let adminDatabases: NodeDatabases | null = null;
let serverAccount: Account | null = null;
let serverTeams: NodeTeams | null = null;

// Initialize server-side Appwrite client
function getServerClient() {
  if (serverClient) return serverClient;

  serverClient = new WebClient();
  serverClient
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  return serverClient;
}

// Admin (Node SDK) client for privileged operations
function getAdminClient() {
  if (adminClient) return adminClient;
  const apiKey = process.env.APPWRITE_API_KEY;
  if (!apiKey) {
    throw new Error("APPWRITE_API_KEY is not set for admin operations");
  }
  adminClient = new NodeSdkClient()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(apiKey);
  return adminClient;
}

// Get admin databases instance (uses API key)
export function getAdminDatabases() {
  if (adminDatabases) return adminDatabases;
  adminDatabases = new NodeDatabases(getAdminClient());
  return adminDatabases;
}

// Get server-side account instance
export function getServerAccount() {
  if (serverAccount) return serverAccount;
  serverAccount = new Account(getServerClient());
  return serverAccount;
}

// Get server-side teams instance
export function getServerTeams() {
  if (serverTeams) return serverTeams;
  serverTeams = new NodeTeams(getAdminClient());
  return serverTeams;
}

export { ID, Query, Permission, Role };
