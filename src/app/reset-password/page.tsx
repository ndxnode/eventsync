"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  // Retrieve the reset token from the query parameter "code"
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  const supabase = createClient();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Early return if the reset token is missing.
  if (!code) {
    return (
      <div className="p-6">
        <p className="text-red-600">Invalid or missing reset password code.</p>
      </div>
    );
  }

  const handleResetPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage(null);

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      // Use Supabase's verifyOtp method to complete the reset.
      const { error } = await supabase.auth.verifyOtp({
        token: code,
        type: "recovery",
        tokenHash: newPassword,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        // On successful password reset, redirect to the login page.
        router.push("/login?reset=success");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
      {errorMessage && (
        <div role="alert" className="mb-4 text-red-600">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="newPassword" className="mb-1 font-medium">
            New Password:
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="New Password"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className="mb-1 font-medium">
            Confirm New Password:
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Confirm New Password"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
