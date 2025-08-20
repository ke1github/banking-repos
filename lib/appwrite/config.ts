import { logAuthError } from "@/lib/utils/mock-logger";
import { isSessionExpiredError } from "@/lib/handlers/appwrite-errors";

// Mock configuration values
export const appwriteConfig = {
  endpoint:
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "mock-project",
  databaseId: process.env.APPWRITE_DATABASE_ID || "mock-database",
  userCollectionId: process.env.APPWRITE_USER_COLLECTION_ID || "mock-users",
  bankCollectionId: process.env.APPWRITE_BANK_COLLECTION_ID || "mock-banks",
  transactionCollectionId:
    process.env.APPWRITE_TRANSACTION_COLLECTION_ID || "mock-transactions",
};

/**
 * Mock implementations of Appwrite classes and utilities
 */

// Mock Client class
class MockClient {
  setEndpoint() {
    return this;
  }
  setProject() {
    return this;
  }
  setPlatform() {
    return this;
  }
}

// Mock Account class with basic functionality
class MockAccount {
  // Mock user data
  mockUser = {
    $id: "mock-user-id",
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    name: "Mock User",
    email: "user@example.com",
    emailVerification: false,
    phoneVerification: false,
    prefs: {},
  };

  // Session management
  createSession() {
    return Promise.resolve({ $id: "mock-session-id" });
  }

  getSession() {
    return Promise.resolve({ $id: "mock-session-id" });
  }

  deleteSessions() {
    return Promise.resolve();
  }

  deleteSession() {
    return Promise.resolve();
  }

  get() {
    // Return mock user data
    return Promise.resolve(this.mockUser);
  }

  create() {
    return Promise.resolve(this.mockUser);
  }

  createRecovery() {
    return Promise.resolve();
  }

  updateRecovery() {
    return Promise.resolve();
  }

  // Add missing methods
  createOAuth2Session() {
    return Promise.resolve();
  }

  createEmailPasswordSession() {
    return Promise.resolve({ $id: "mock-session-id" });
  }
}

// Mock Databases class with data
class MockDatabases {
  // Sample data for the database
  mockData = {
    users: [
      {
        $id: "user1",
        name: "John Doe",
        email: "john@example.com",
      },
    ],
    banks: [
      {
        $id: "bank1",
        name: "Sample Bank",
        accountNumber: "1234567890",
        balance: 5000,
        userId: "user1",
      },
    ],
    transactions: [
      {
        $id: "tx1",
        amount: 100,
        description: "Grocery shopping",
        date: new Date().toISOString(),
        type: "expense",
        userId: "user1",
      },
      {
        $id: "tx2",
        amount: 2500,
        description: "Salary deposit",
        date: new Date().toISOString(),
        type: "income",
        userId: "user1",
      },
    ],
  };

  listDocuments(databaseId: string, collectionId: string) {
    let documents: unknown[] = [];

    if (collectionId === appwriteConfig.userCollectionId) {
      documents = this.mockData.users;
    } else if (collectionId === appwriteConfig.bankCollectionId) {
      documents = this.mockData.banks;
    } else if (collectionId === appwriteConfig.transactionCollectionId) {
      documents = this.mockData.transactions;
    }

    return Promise.resolve({
      documents,
      total: documents.length,
    });
  }

  getDocument(databaseId: string, collectionId: string, documentId: string) {
    let document = null;

    if (collectionId === appwriteConfig.userCollectionId) {
      document = this.mockData.users.find((doc) => doc.$id === documentId);
    } else if (collectionId === appwriteConfig.bankCollectionId) {
      document = this.mockData.banks.find((doc) => doc.$id === documentId);
    } else if (collectionId === appwriteConfig.transactionCollectionId) {
      document = this.mockData.transactions.find(
        (doc) => doc.$id === documentId
      );
    }

    if (!document) {
      return Promise.reject(new Error("Document not found"));
    }

    return Promise.resolve(document);
  }

  updateDocument(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: Record<string, unknown>
  ) {
    const updatedDocument = {
      $id: documentId,
      $updatedAt: new Date().toISOString(),
      ...data,
    };

    return Promise.resolve(updatedDocument);
  }

  deleteDocument(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    databaseId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collectionId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    documentId: string
  ) {
    return Promise.resolve();
  }
}

// Create and export instances
const client = new MockClient();
const account = new MockAccount();
const databases = new MockDatabases();

export { client, account, databases };

// Export a safe version of the account that returns null on errors
export const safeAccount = {
  get: async () => {
    try {
      return await account.get();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  },
};

// Mock ID utility
export const ID = {
  unique: () => "mock-unique-id",
};

// Mock Query utility
export const Query = {
  equal: (field: string, value: unknown) => `${field}=${String(value)}`,
  limit: (limit: number) => `limit=${limit}`,
};
