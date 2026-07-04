import { useQuery } from "@tanstack/react-query";
import { authApi } from "@repo/api";

export const usePingQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["auth", "ping"],
    queryFn: async () => {
      const response = await authApi.ping();
      return response.data;
    },
    refetchOnWindowFocus: false,
    retry: false,
    ...options,
  });
};
