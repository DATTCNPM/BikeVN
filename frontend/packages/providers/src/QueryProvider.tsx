import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "@repo/ui/components/ui/sonner";
import type { ReactNode } from "react";

import { ApiError } from "@repo/api";
import { ERROR_MESSAGES } from "./errorMessages";

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return ERROR_MESSAGES[error.code] ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Đã xảy ra lỗi";
}

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
      const message = getErrorMessage(error);
      toast.error(`Query Error: ${message}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(getErrorMessage(error));
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
