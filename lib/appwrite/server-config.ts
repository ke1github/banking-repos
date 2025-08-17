import { Client, Account, Databases, ID, Query, Teams } from "appwrite";

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
let serverClient: Client | null = null;
let serverDatabases: Databases | null = null;
let serverAccount: Account | null = null;
let serverTeams: Teams | null = null;

// Initialize server-side Appwrite client
function getServerClient() {
  if (serverClient) return serverClient;

  serverClient = new Client();
  serverClient
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  // Add API key for server-side operations
  if (process.env.APPWRITE_API_KEY) {
    // Use API key-based authentication for server-side
    serverClient.setJWT(process.env.APPWRITE_API_KEY);
  }

  return serverClient;
}

// Get server-side databases instance
export function getServerDatabases() {
  if (serverDatabases) return serverDatabases;
  serverDatabases = new Databases(getServerClient());
  return serverDatabases;
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
  serverTeams = new Teams(getServerClient());
  return serverTeams;
}

export { ID, Query };
