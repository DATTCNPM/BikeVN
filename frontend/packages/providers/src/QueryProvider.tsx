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
    return ERROR_MESSAGES[error.code] ?? error.message;
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
      retry: (failureCount, error: any) => {
        // Không retry với các lỗi client side
        if (error?.code >= 1000 && error?.code < 2000) return false;
        // Sử dụng cả error.status hoặc error.response.status
        const status = error?.status ?? error?.response?.status;
        if (status >= 400 && status < 500)
          return false;
        return failureCount < 1;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      // 🌟 TỐI ƯU 1: Cho phép tắt toast thông qua meta dữ liệu của Query
      if (query.meta?.showToast === false) return;

      // Không hiện toast lỗi query nếu chưa đăng nhập hoặc token hết hạn ngầm
      const status = error?.status ?? error?.response?.status;
      if (error?.code === 5555 || status === 401) return;

      const message = getErrorMessage(error);
      toast.error(message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any, _variables, _context, mutation) => {
      // 🌟 TỐI ƯU 2: Cho phép tắt toast toàn cục cho các action cụ thể (ví dụ: submit form)
      if (mutation.meta?.showToast === false) return;

      // Xử lý mã lỗi tập trung ví dụ Session Expired -> Redirect về login thay vì hiện toast
      if (isApiError(error) && error.code === 5555) {
        // window.location.href = "/login";
        return;
      }

      // 🌟 TỐI ƯU 3: Lọc bớt các lỗi nghiệp vụ thuộc về Form Validation không nên hiện toast
      const silentErrorCodes = [1002, 1003, 1004]; // Trùng email, sai pass, không tồn tại acc
      if (isApiError(error) && silentErrorCodes.includes(error.code)) {
        return; // Để component tự bắt qua khối catch hoặc onError cục bộ nhằm hiện chữ đỏ dưới input
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
