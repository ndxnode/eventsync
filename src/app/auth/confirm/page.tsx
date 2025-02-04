"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleConfirmation = async () => {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (!tokenHash || !type) {
        setError("Invalid confirmation link");
        return;
      }

      const supabase = createClient();

      if (type === "signup") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "signup",
        });

        if (error) {
          setError(error.message);
          return;
        }

        // Successful confirmation - redirect to home page
        router.push("/");
      } else if (type === "recovery") {
        // Handle password recovery confirmation
        router.push(`/reset-password?token_hash=${tokenHash}`);
      } else {
        setError("Invalid confirmation type");
      }
    };

    handleConfirmation();
  }, [searchParams, router]);

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            Confirming your email...
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
