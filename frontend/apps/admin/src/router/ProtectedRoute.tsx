import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authStorageService, tokenService } from "@repo/services";
import { ROLES } from "@repo/constants";
import { usePortalProfile } from "@/features/auth/hooks/usePortalProfile";
import { Spinner } from "@repo/ui/components/ui/spinner";

type ProtectedRouteProps = {
  children?: React.ReactNode;
  allowedRoles?: string[];
  requireAuth?: boolean;
};

export default function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = true,
}: ProtectedRouteProps) {
  // 🌟 Quy tắc Hook: Luôn gọi toàn bộ Hook ở đầu Component
  const location = useLocation();
  const token = authStorageService.getPortalToken();

  // Chỉ kích hoạt query fetch profile khi thực sự có token
  const { data: portalProfile, isLoading: isProfileLoading } =
    usePortalProfile();

  // 1. Kiểm tra yêu cầu đăng nhập khi chưa có token
  if (requireAuth && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Chặn truy cập trang login khi đã có sẵn token
  if (!requireAuth && token) {
    const roles = tokenService.getRoles(token); // Ép kiểu hoặc chắn chắn có token nhờ logic ngoài
    if (roles.includes(ROLES.ADMIN)) return <Navigate to="/admin" replace />;
    if (roles.includes(ROLES.EMPLOYEE))
      return <Navigate to="/employee" replace />;
    return <Navigate to="/login" replace />;
  }

  // Nếu là trang public (không yêu cầu auth), hiển thị luôn children
  if (!requireAuth) return <>{children}</>;

  // 3. Hiển thị loading khi đang fetch profile chi tiết
  if (isProfileLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // Nếu session token bị lỗi hoặc không có profile tương ứng từ API
  if (!portalProfile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. Nếu truy cập đường dẫn gốc "/" -> Tự động chuyển vùng thông minh dựa trên Role
  if (location.pathname === "/") {
    // Thêm kiểm tra `if (token)` để loại bỏ lỗi Type 'null' của TypeScript
    if (token) {
      const roles = tokenService.getRoles(token);
      if (roles.includes(ROLES.ADMIN)) return <Navigate to="/admin" replace />;
      if (roles.includes(ROLES.EMPLOYEE))
        return <Navigate to="/employee" replace />;
    }
  }

  // 5. Kiểm tra quyền truy cập Role Guard
  if (allowedRoles && token) {
    const userRoles = tokenService.getRoles(token);
    const hasPermission = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasPermission) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
