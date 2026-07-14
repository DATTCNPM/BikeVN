import { useEffect } from "react";
import { usePortalAuth } from "./hooks/usePortalAuth";

export function AuthInitializer() {
  const initializeAuth = usePortalAuth((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return null;
}
