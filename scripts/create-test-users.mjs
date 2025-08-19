/**
 * This script creates test users in the Appwrite backend
 * Run this script once to set up test users for development
 */

import { ID } from "appwrite";
import { testUsers } from "../lib/test-users";
import { getServerAccount } from "../lib/appwrite/server-config";
import { exit } from "process";

async function createTestUsers() {
  console.log("Creating test users for development...");
  const account = getServerAccount();

  // Create regular test user
  try {
    console.log(`Creating regular user: ${testUsers.regular.email}`);
    await account.create(
      ID.unique(),
      testUsers.regular.email,
      testUsers.regular.password,
      testUsers.regular.fullName
    );
    console.log("✓ Regular test user created successfully");
  } catch (error) {
    if (error.message?.includes("user already exists")) {
      console.log("✓ Regular test user already exists");
    } else {
      console.error("Error creating regular test user:", error);
    }
  }

  // Create admin test user
  try {
    console.log(`Creating admin user: ${testUsers.admin.email}`);
    await account.create(
      ID.unique(),
      testUsers.admin.email,
      testUsers.admin.password,
      testUsers.admin.fullName
    );
    console.log("✓ Admin test user created successfully");
  } catch (error) {
    if (error.message?.includes("user already exists")) {
      console.log("✓ Admin test user already exists");
    } else {
      console.error("Error creating admin test user:", error);
    }
  }

  console.log("\nTest users are ready to use!");
  console.log("----------------------------------");
  console.log("Regular user:");
  console.log(`Email: ${testUsers.regular.email}`);
  console.log(`Password: ${testUsers.regular.password}`);
  console.log("\nAdmin user:");
  console.log(`Email: ${testUsers.admin.email}`);
  console.log(`Password: ${testUsers.admin.password}`);
  console.log("----------------------------------");

  exit(0);
}

// Execute the function
createTestUsers().catch((error) => {
  console.error("Failed to create test users:", error);
  exit(1);
});
