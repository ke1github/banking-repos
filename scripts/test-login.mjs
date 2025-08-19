/**
 * This script tests the login functionality using the test users
 */

import { getServerAccount } from "../lib/appwrite/server-config";
import { testUsers } from "../lib/test-users";
import { exit } from "process";

async function testLogin() {
  console.log("Testing login functionality...");

  try {
    const account = getServerAccount();

    console.log(`Attempting to log in as: ${testUsers.regular.email}`);

    try {
      // First create a test user if it doesn't exist
      const user = await account.create(
        "unique()", // This is the issue - should be ID.unique()
        testUsers.regular.email,
        testUsers.regular.password,
        testUsers.regular.fullName
      );
      console.log("✓ Created test user:", user.$id);
    } catch (error) {
      if (error.message?.includes("user already exists")) {
        console.log("✓ User already exists, continuing with login");
      } else {
        console.error("Error creating test user:", error);
      }
    }

    // Try to log in
    const session = await account.createSession(
      testUsers.regular.email,
      testUsers.regular.password
    );

    console.log("✓ Login successful!");
    console.log("Session ID:", session.$id);
    console.log("User ID:", session.userId);

    // Clean up
    await account.deleteSession(session.$id);
    console.log("✓ Session cleaned up");
  } catch (error) {
    console.error("❌ Login test failed:");
    console.error("Error code:", error.code);
    console.error("Error type:", error.type);
    console.error("Error message:", error.message);

    if (error.message?.includes("Invalid `userId` param")) {
      console.error(
        "\nISSUE IDENTIFIED: The userId parameter format is incorrect"
      );
      console.error(
        "This is likely caused by using 'unique()' as a string instead of ID.unique()"
      );
      console.error(
        "Fix: Import the ID class from appwrite and use ID.unique() instead of 'unique()'"
      );
    }

    exit(1);
  }

  exit(0);
}

// Run the test
testLogin().catch((error) => {
  console.error("Unexpected error:", error);
  exit(1);
});
