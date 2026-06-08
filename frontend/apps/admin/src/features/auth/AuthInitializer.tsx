import { useEffect } from "react";

import { useAdminAuth } from "./useAdminAuth";

export function AuthInitializer() {
  const initializeAuth = useAdminAuth((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return null;
}
