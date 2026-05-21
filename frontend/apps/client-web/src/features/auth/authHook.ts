import { useQuery } from "@tanstack/react-query";

import { authApi } from "@repo/api";

import { useAuthStore } from "./authStore";
import { useEffect } from "react";

export const usePingServer = () => {
  const setIsServerDown = useAuthStore((state) => state.setIsServerDown);

  const query = useQuery({
    queryKey: ["server-ping"],

    queryFn: async () => {
      return authApi.ping();
    },

    retry: false,

    staleTime: 0,

    gcTime: 0,

    refetchInterval: 3000,

    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setIsServerDown(false);
    }
  }, [query.isSuccess, setIsServerDown]);

  useEffect(() => {
    if (query.isError) {
      setIsServerDown(true);
    }
  }, [query.isError, setIsServerDown]);

  return query;
};
