"use client";

import React from "react";

import { ROUTES } from "@/constants/route";
import { account as appwriteAccount } from "@/lib/appwrite/config";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Appwrite requires a URL to send the reset link to; use our reset route
      const redirectUrl = `${window.location.origin}${ROUTES.RESET_PASSWORD}`;
      await appwriteAccount.createRecovery(email, redirectUrl);
      setMessage(
        "If an account exists for this email, a reset link has been sent."
      );
    } catch (err) {
      console.error("Password recovery error:", err);
      setError("Unable to start password reset. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Forgot password
        </h1>
        <p className="text-gray-600 mb-6">
          Enter your email to receive a reset link.
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
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70"
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <button
          onClick={() => router.push(ROUTES.SIGN_IN)}
          className="mt-4 text-sm text-blue-600"
        >
          Back to sign in
        </button>
      </div>
    </div>
  );
}
