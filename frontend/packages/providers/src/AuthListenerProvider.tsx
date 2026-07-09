import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type AuthListenerProps = {
  children: React.ReactNode;
  loginPath?: string; // Cho phép linh hoạt cấu hình link login riêng cho Admin / Client nếu muốn
};

export function AuthListenerProvider({
  children,
  loginPath = "/login",
}: AuthListenerProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      // Kiểm tra xem có đang ở trang login sẵn chưa để tránh lặp điều hướng
      if (!window.location.pathname.startsWith(loginPath)) {
        console.log(
          "📢 AuthListener: Token expired! Redirecting to:",
          loginPath,
        );
        navigate(loginPath);
      }
    };

    // 🎧 Đăng ký lắng nghe sự kiện từ Axios phát ra
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      // Hủy lắng nghe khi component unmount để tránh rò rỉ bộ nhớ (Memory Leak)
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [navigate, loginPath]);

  return <>{children}</>;
}
