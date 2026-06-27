import { useQuery } from "@tanstack/react-query";
import { authApi } from "@repo/api";
import { useAuthStore } from "./authStore";

export const useServerMonitor = () => {
  const { isServerDown, setIsServerDown } = useAuthStore();

  useQuery({
    queryKey: ["server-status"],
    queryFn: async () => {
      try {
        await authApi.ping();
        setIsServerDown(false);
        return "ONLINE";
      } catch (error) {
        setIsServerDown(true);
        throw error;
      }
    },
    retry: false,
    // Nếu server đang sập, cứ 3 giây ping lại một lần (kể cả khi ở background)
    refetchInterval: isServerDown ? 3000 : false,
    refetchIntervalInBackground: true,
    gcTime: 0,
    staleTime: 0,
  });
};
