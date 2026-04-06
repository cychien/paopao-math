import { useState } from "react";

export function usePurchase() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use full document navigation so checkout route can return HTML/form directly.
      window.location.assign("/api/purchase");
    } catch (err) {
      console.error("Purchase error:", err);
      setError(err instanceof Error ? err.message : "購買失敗");
      setIsLoading(false);
    }
  };

  return { purchase, isLoading, error };
}
