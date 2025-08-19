declare namespace NodeJS {
  interface ProcessEnv {
    // Next.js environment variables
    NODE_ENV: "development" | "production" | "test";

    // Appwrite config
    NEXT_PUBLIC_APPWRITE_ENDPOINT: string;
    NEXT_PUBLIC_APPWRITE_PROJECT: string;
    APPWRITE_API_KEY: string;
    APPWRITE_DATABASE_ID: string;
    APPWRITE_USER_COLLECTION_ID: string;
    APPWRITE_BANK_COLLECTION_ID: string;
    APPWRITE_TRANSACTION_COLLECTION_ID: string;

    // Additional environment variables
    NEXT_PUBLIC_APP_URL: string;
  }
}
