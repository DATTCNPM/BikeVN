import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { authApi } from "@repo/api";

import { useAuthStore } from "./authStore";

export const useInitialServerCheck = () => {
  const setIsServerDown = useAuthStore((state) => state.setIsServerDown);

  const query = useQuery({
    queryKey: ["initial-server-check"],
    queryFn: authApi.ping,
    retry: false,
  });

  useEffect(() => {
    console.log("STATUS:", query.status);

    if (query.isSuccess) {
      setIsServerDown(false);
    }

    if (query.isError) {
      setIsServerDown(true);
    }
  }, [query.isSuccess, query.isError, setIsServerDown]);
};
