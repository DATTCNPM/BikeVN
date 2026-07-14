import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { toast } from "@repo/ui/components/ui/sonner";
import type { ReactNode } from "react";
import { isApiError } from "@repo/api";
import { ERROR_MESSAGES } from "./errorMessages";

function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    // 🌟 KHẮC PHỤC LỖI: Lấy thuộc tính .message từ object ErrorConfig nếu có
    return ERROR_MESSAGES[error.code]?.message ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1,
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: unknown) => {
        if (isApiError(error) && error.code >= 1000 && error.code < 2000)
          return false;

        const responseStatus =
          (error as any)?.status ?? (error as any)?.response?.status;

        if (
          responseStatus >= 400 &&
          responseStatus < 500 &&
          responseStatus !== 408 &&
          responseStatus !== 429
        ) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error: unknown, query) => {
      if (query.meta?.showToast === false) return;

      const silentCodes = (query.meta?.silentErrorCodes as number[]) || [];
      if (isApiError(error) && silentCodes.includes(error.code)) return;

      const status = (error as any)?.status ?? (error as any)?.response?.status;
      if ((isApiError(error) && error.code === 5555) || status === 401) return;

      toast.error(getErrorMessage(error));
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: unknown, _variables, _context, mutation) => {
      if (mutation.meta?.showToast === false) return;

      if (isApiError(error) && error.code === 5555) return;

      const silentCodes = (mutation.meta?.silentErrorCodes as number[]) || [];
      if (isApiError(error) && silentCodes.includes(error.code)) {
        return;
      }

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
