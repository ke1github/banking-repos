import "server-only";
import { ID, Query } from "appwrite";
import { appwriteConfig } from "./config";

// Mock permissions and roles
export const Permission = {
  read: (role: string) => `read("${role}")`,
  write: (role: string) => `write("${role}")`,
};

export const Role = {
  any: () => "any",
  users: () => "users",
  guests: () => "guests",
};

// Mock server account with minimal functionality
const mockServerAccount = {
  // User management
  get: async () => {
    return {
      $id: "mock-user-id",
      email: "mock@example.com",
      name: "Mock User",
      emailVerification: false,
      phoneVerification: false,
    };
  },

  create: async (
    userId: string,
    email: string,
    password: string,
    name: string
  ) => {
    return {
      $id: userId || "mock-user-id",
      email,
      name,
      emailVerification: false,
      phoneVerification: false,
    };
  },

  // Session management
  createSession: async (_email: string, _password: string) => {
    return { $id: "mock-session-id" };
  },

  deleteSession: async (_sessionId: string) => {
    return {};
  },

  updateRecovery: async (
    _userId: string,
    _secret: string,
    _password: string
  ) => {
    return {};
  },

  createRecovery: async (_email: string, _url: string) => {
    return {};
  },
};

// Mock server databases with minimal functionality
const mockServerDatabases = {
  listDocuments: async (
    _databaseId: string,
    _collectionId: string,
    _queries: unknown[] = []
  ) => {
    // Return empty mock documents
    return {
      documents: [],
      total: 0,
    };
  },

  getDocument: async (
    _databaseId: string,
    _collectionId: string,
    documentId: string
  ) => {
    // Return a mock document with all expected properties
    return {
      $id: documentId,
      userId: "mock-user-id",
      accountNumber: "123456789",
      routingNumber: "987654321",
      accountType: "checking",
      balance: 1000.0,
      currency: "USD",
      name: "Mock Account",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  createDocument: async (
    _databaseId: string,
    _collectionId: string,
    documentId: string,
    data: Record<string, unknown>
  ) => {
    return { $id: documentId, ...data };
  },

  updateDocument: async (
    _databaseId: string,
    _collectionId: string,
    documentId: string,
    data: Record<string, unknown>
  ) => {
    return { $id: documentId, ...data };
  },

  deleteDocument: async (
    _databaseId: string,
    _collectionId: string,
    _documentId: string
  ) => {
    return true;
  },
};

// Mock teams functionality
const mockServerTeams = {
  // Teams can be implemented if needed
};

// Export server-side Appwrite functions
export function getServerAccount() {
  return mockServerAccount;
}

export function getServerDatabases() {
  return mockServerDatabases;
}

export function getAdminDatabases() {
  return mockServerDatabases;
}

export function getServerTeams() {
  return mockServerTeams;
}

export { ID, Query };
