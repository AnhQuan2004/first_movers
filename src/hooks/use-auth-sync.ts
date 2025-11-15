import { useEffect, useState } from "react";
import { getIsAuthenticated, subscribeToAuthChange } from "@/lib/auth-events";

export const useAuthSync = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(getIsAuthenticated);

  useEffect(() => {
    const updateAuthState = () => setIsAuthenticated(getIsAuthenticated());
    const unsubscribe = subscribeToAuthChange(updateAuthState);

    if (typeof window !== "undefined") {
      window.addEventListener("focus", updateAuthState);
      window.addEventListener("visibilitychange", updateAuthState);
    }

    return () => {
      unsubscribe?.();
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", updateAuthState);
        window.removeEventListener("visibilitychange", updateAuthState);
      }
    };
  }, []);

  return isAuthenticated;
};
