"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ManageSubscription = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const redirectToCustomerPortal = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const text = await response.text(); // Сначала получаем текст ответа
      console.log("Response text:", text); // Логируем для отладки

      if (!response.ok) {
        throw new Error(text || `HTTP error! status: ${response.status}`);
      }

      if (!text) {
        throw new Error("Empty response from server");
      }

      const data = JSON.parse(text); // Парсим текст в JSON

      if (!data?.url) {
        throw new Error("No URL in response");
      }

      router.push(data.url);
    } catch (error) {
      console.error("Subscribe Button error", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        disabled={loading}
        onClick={redirectToCustomerPortal}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please Wait
          </>
        ) : (
          "Change your subscription"
        )}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ManageSubscription;
