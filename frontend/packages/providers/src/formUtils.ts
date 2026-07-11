import type { UseFormSetError } from "react-hook-form";
import { ERROR_MESSAGES } from "./errorMessages";

/**
 * Tự động map lỗi từ Backend Spring Boot vào đúng ô Input dựa trên file cấu hình errorMessages
 */
export const handleFormBackendError = (
  error: any,
  setError: UseFormSetError<any>,
  isApiErrorFilter: (err: any) => boolean,
) => {
  if (isApiErrorFilter(error)) {
    const errorConfig = ERROR_MESSAGES[error.code];

    // 1. Nếu tìm thấy mã lỗi được định nghĩa sẵn
    if (errorConfig) {
      // Ưu tiên lấy message từ backend, nếu không có thì lấy message mặc định ở file config
      const finalMessage = error.message || errorConfig.message;

      if (errorConfig.field) {
        // Nếu lỗi này gắn liền với 1 field (như email, password), map thẳng vào ô input đó
        setError(errorConfig.field, {
          type: "server",
          message: finalMessage,
        });
        return;
      } else {
        // Nếu lỗi chung (ví dụ: 1016 - đã thanh toán), đẩy vào root của form
        setError("root", { type: "server", message: finalMessage });
        return;
      }
    }
  }

  // 2. Fallback: Nếu là lỗi không xác định (Lỗi mạng, sập server, hoặc mã lỗi lạ chưa định nghĩa)
  setError("root", {
    type: "server",
    message:
      error?.message || "An unexpected error occurred. Please try again.",
  });
};
