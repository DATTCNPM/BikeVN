import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

// 📦 UI Components & Route Guards
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import AuthRedirectRoute from "@/features/auth/AuthRedirectRoute";
import { Spinner } from "@repo/ui/components/ui/spinner";

import { AuthListenerProvider } from "@repo/providers";

// 💤 Lazy Loading các trang cũ
const HomePage = lazy(() => import("@/pages/HomePage"));
const VehicleManagementPage = lazy(
  () => import("@/pages/VehicleManagementPage"),
);
const BrandManagementPage = lazy(() => import("@/pages/BrandManagementPage"));
const UserManagementPage = lazy(() => import("@/pages/UserManagementPage"));
const BranchManagementPage = lazy(() => import("@/pages/BranchManagementPage"));
const ModelManagementPage = lazy(() => import("@/pages/ModelManagementPage"));
const VehicleImageManagementPage = lazy(
  () => import("@/pages/VehicleImageManagementPage"),
);
const BookingManagementPage = lazy(
  () => import("@/pages/BookingManagementPage"),
);
const ReviewManagementPage = lazy(() => import("@/pages/ReviewManagementPage"));
const PaymentManagementPage = lazy(
  () => import("@/pages/PaymentManagementPage"),
);
const ChatManagementPage = lazy(() => import("@/pages/ChatManagementPage"));
const InfoPage = lazy(() => import("@/pages/InfoPage"));
const SecurityPage = lazy(() => import("@/pages/SecurityPage"));
const SettingPage = lazy(() => import("@/pages/SettingPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const BookingReturnPage = lazy(() => import("@/pages/BookingReturnPage"));
const PermissionManagementPage = lazy(
  () => import("@/pages/PermissionManagementPage"),
);
const RoleManagementPage = lazy(() => import("@/pages/RoleManagementPage"));
const EmployeeManagementPage = lazy(
  () => import("@/pages/EmployeeManagementPage"),
);

// 🆕 Lazy Loading 2 trang lịch sử trả xe mới tinh chỉnh
const VehicleReturnAdminPage = lazy(
  () => import("@/pages/VehicleReturnAdminPage"),
);
const VehicleReturnBranchPage = lazy(
  () => import("@/pages/VehicleReturnBranchPage"),
);

import { NotFoundPage } from "@/pages/NotFoundPage";
import { ServerErrorPage } from "@/pages/ServerErrorPage";
import { useBranchNotifications } from "@/hooks/useBranchNotifications";

// 🌀 Loading Spinner toàn màn hình
function AdminPageLoader() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background">
      <Spinner className="size-8" />
    </div>
  );
}

// 🛡️ Wrapper Layout đảm nhiệm việc bắt trạng thái Suspense cho toàn bộ Route con
function AdminDashboardLayout() {
  return (
    <AuthListenerProvider loginPath="/login">
      <ProtectedRoute>
        {/* Bọc Suspense ở đây để khi bấm menu chuyển giữa các trang Lazy load, 
          nó sẽ hiển thị AdminPageLoader thay vì làm crash ứng dụng.
        */}
        <Suspense fallback={<AdminPageLoader />}>
          <MainLayout />
        </Suspense>
      </ProtectedRoute>
    </AuthListenerProvider>
  );
}

// 💼 2. Layout dành riêng cho EMPLOYEE (Kích hoạt lắng nghe thông báo Realtime)
function EmployeeLayout() {
  // Chỉ nhân viên mới kích hoạt kết nối WebSocket và nhận Toast
  useBranchNotifications();

  return (
    <AuthListenerProvider loginPath="/login">
      <ProtectedRoute>
        <Suspense fallback={<AdminPageLoader />}>
          <MainLayout />
        </Suspense>
      </ProtectedRoute>
    </AuthListenerProvider>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirectRoute />,
  },
  {
    path: "login",
    element: (
      <Suspense fallback={<AdminPageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  // 👑 ADMIN ROUTES
  {
    path: "admin",
    element: <AdminDashboardLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "vehicles", element: <VehicleManagementPage /> },
      {
        path: "vehicles/:vehicleId/images",
        element: <VehicleImageManagementPage />,
      },
      { path: "brands", element: <BrandManagementPage /> },
      { path: "models", element: <ModelManagementPage /> },
      { path: "employees", element: <EmployeeManagementPage /> },
      { path: "users", element: <UserManagementPage /> },
      { path: "branches", element: <BranchManagementPage /> },
      { path: "bookings", element: <BookingManagementPage /> },
      { path: "reviews", element: <ReviewManagementPage /> },
      { path: "payments", element: <PaymentManagementPage /> },
      { path: "bookings/:bookingId/return", element: <BookingReturnPage /> },

      // 🆕 Route danh sách quản lý trả xe tổng (Admin)
      { path: "vehicle-returns", element: <VehicleReturnAdminPage /> },

      { path: "chats", element: <ChatManagementPage /> },
      { path: "info", element: <InfoPage /> },
      { path: "security", element: <SecurityPage /> },
      { path: "settings", element: <SettingPage /> },
      { path: "permissions", element: <PermissionManagementPage /> },
      { path: "roles", element: <RoleManagementPage /> },
    ],
  },
  // 💼 EMPLOYEE ROUTES
  {
    path: "employee",
    element: <EmployeeLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "vehicles", element: <VehicleManagementPage /> },
      {
        path: "vehicles/:vehicleId/images",
        element: <VehicleImageManagementPage />,
      },
      { path: "brands", element: <BrandManagementPage /> },
      { path: "models", element: <ModelManagementPage /> },
      { path: "users", element: <UserManagementPage /> },
      { path: "branches", element: <BranchManagementPage /> },
      { path: "bookings", element: <BookingManagementPage /> },
      { path: "reviews", element: <ReviewManagementPage /> },
      { path: "payments", element: <PaymentManagementPage /> },
      { path: "bookings/:bookingId/return", element: <BookingReturnPage /> },

      // 🆕 Route danh sách lịch sử trả xe nội bộ chi nhánh (Employee)
      { path: "vehicle-returns", element: <VehicleReturnBranchPage /> },

      { path: "chats", element: <ChatManagementPage /> },
      { path: "info", element: <InfoPage /> },
      { path: "security", element: <SecurityPage /> },
      { path: "settings", element: <SettingPage /> },
    ],
  },
  // 🛑 Các trang lỗi
  { path: "*", element: <NotFoundPage /> },
  { path: "server-error", element: <ServerErrorPage /> },
]);

export default router;
