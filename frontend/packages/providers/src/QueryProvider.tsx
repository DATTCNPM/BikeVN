import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "@repo/ui/components/ui/sonner";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error: any) => {
      if (error?.response?.status === 401) return;
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(`Query Error: ${message}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || error?.message || "Action failed";
      toast.error(`Mutation Error: ${message}`);
    },
  }),
});

type Props = {
  children: ReactNode;
};

export default function QueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
