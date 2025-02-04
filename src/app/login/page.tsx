"use client";

import { useState } from "react";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (
    action: (formData: FormData) => Promise<void>,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      await action(formData);
    } catch (error: any) {
      // Instead of redirecting, we display the error message
      setErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4 p-6"
      onSubmit={(e) => handleAction(login, e)}
    >
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 font-medium">
          Email:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="mb-1 font-medium">
          Password:
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {errorMessage && (
        <div role="alert" className="text-red-600">
          {errorMessage}
        </div>
      )}
      <div className="flex gap-4">
        <button
          type="submit"
          onClick={(e) => handleAction(login, e)}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
        <button
          type="button"
          onClick={(e) => handleAction(signup, e)}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
      </div>
    </form>
  );
}
