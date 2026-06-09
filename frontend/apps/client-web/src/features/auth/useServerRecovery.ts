import { useQuery } from "@tanstack/react-query";

import { authApi } from "@repo/api";

import { useAuthStore } from "./authStore";
import { useEffect } from "react";

export const useServerRecovery = () => {
  const isServerDown = useAuthStore((state) => state.isServerDown);

  const setIsServerDown = useAuthStore((state) => state.setIsServerDown);

  const query = useQuery({
    queryKey: ["server-recovery"],

    queryFn: authApi.ping,

    enabled: isServerDown,

    retry: false,

    staleTime: 0,

    gcTime: 0,

    refetchInterval: isServerDown ? 3000 : false,

    refetchIntervalInBackground: true,
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
