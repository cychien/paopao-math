import { useNavigate } from "react-router";
import { useState } from "react";

export function usePurchase() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Navigate to the purchase API route which will handle the checkout
      navigate("/api/purchase");
    } catch (err) {
      console.error("Purchase error:", err);
      setError(err instanceof Error ? err.message : "購買失敗");
      setIsLoading(false);
    }
  };

  return { purchase, isLoading, error };
}
