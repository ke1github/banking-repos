"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { account as appwriteAccount } from "@/lib/appwrite/config";
import router from "next/router";

function ResetPasswordInner() {
  const params = useSearchParams();

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const userId = params.get("userId") || "";
  const secret = params.get("secret") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !secret) {
      setError("Invalid or missing reset token.");
      return;
    }
    if (password.length < 8 || password !== confirm) {
      setError("Passwords must match and be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      await appwriteAccount.updateRecovery(userId, secret, password);
      setMessage("Password has been reset. You can now sign in.");
      setTimeout(() => router.replace(ROUTES.SIGN_IN), 1200);
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Unable to reset password. The link may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reset password
        </h1>
        <p className="text-gray-600 mb-6">
          Enter a new password for your account.
        </p>
        {message && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Re-enter new password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70"
          >
            {isLoading ? "Updating..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
