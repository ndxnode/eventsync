"use client";

import { useState, useEffect } from "react";
import { login, signup, forgotPassword } from "./actions";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AuthState {
  isLoading: boolean;
  error: string | null;
  showCheckEmail: boolean;
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    showCheckEmail: false,
  });

  useEffect(() => {
    if (code) {
      router.replace(`/reset-password?code=${code}`);
    }
  }, [code, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;
    const actionType = submitter.dataset.action;

    setAuthState({ isLoading: true, error: null });

    try {
      const formData = new FormData(event.currentTarget);
      await (actionType === "signup" ? signup(formData) : login(formData));
    } catch (error) {
      setAuthState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  const handleForgotPassword = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const form = event.currentTarget.form;
    if (!form) return;

    setAuthState({ isLoading: true, error: null, showCheckEmail: false });

    try {
      const formData = new FormData(form);
      await forgotPassword(formData);
      setAuthState({
        isLoading: false,
        error: null,
        showCheckEmail: true,
      });
    } catch (error) {
      setAuthState({
        isLoading: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        showCheckEmail: false,
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      {authState.showCheckEmail ? (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            Check your email for a password reset link.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              disabled={authState.isLoading}
              aria-describedby={authState.error ? "auth-error" : undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={authState.isLoading}
              aria-describedby={authState.error ? "auth-error" : undefined}
            />
          </div>

          {authState.error && (
            <Alert variant="destructive">
              <AlertDescription id="auth-error" role="alert">
                {authState.error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              data-action="login"
              disabled={authState.isLoading}
              className="flex-1"
            >
              {authState.isLoading ? "Logging in..." : "Log in"}
            </Button>
            <Button
              type="submit"
              data-action="signup"
              disabled={authState.isLoading}
              variant="secondary"
              className="flex-1"
            >
              {authState.isLoading ? "Signing up..." : "Sign up"}
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="link"
              onClick={handleForgotPassword}
              disabled={authState.isLoading}
              className="text-sm"
            >
              Forgot Password?
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
