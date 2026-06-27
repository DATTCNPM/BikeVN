import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

// 📦 UI Components & Route Guards (Giữ nguyên import tĩnh vì cần chạy ngay lập tức)
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import AuthRedirectRoute from "@/features/auth/AuthRedirectRoute";
import { Spinner } from "@repo/ui/components/ui/spinner";

// 💤 Chuyển đổi toàn bộ các trang sang Lazy Loading
const HomePage = lazy(() => import("@/pages/HomePage"));
const VehicleManagementPage = lazy(() => import("@/pages/VehicleManagementPage"));
const BrandManagementPage = lazy(() => import("@/pages/BrandManagementPage"));
const UserManagementPage = lazy(() => import("@/pages/UserManagementPage"));
const BranchManagementPage = lazy(() => import("@/pages/BranchManagementPage"));
const ModelManagementPage = lazy(() => import("@/pages/ModelManagementPage"));
const VehicleImageManagementPage = lazy(() => import("@/pages/VehicleImageManagementPage"));
const BookingManagementPage = lazy(() => import("@/pages/BookingManagementPage"));
const ReviewManagementPage = lazy(() => import("@/pages/ReviewManagementPage"));
const PaymentManagementPage = lazy(() => import("@/pages/PaymentManagementPage"));
const ChatManagementPage = lazy(() => import("@/pages/ChatManagementPage"));
const InfoPage = lazy(() => import("@/pages/InfoPage"));
const SecurityPage = lazy(() => import("@/pages/SecurityPage"));
const SettingPage = lazy(() => import("@/pages/SettingPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const BookingReturnPage = lazy(() => import("@/pages/BookingReturnPage"));
const PermissionManagementPage = lazy(() => import("@/pages/PermissionManagementPage"));
const RoleManagementPage = lazy(() => import("@/pages/RoleManagementPage"));
const EmployeeManagementPage = lazy(() => import("@/pages/EmployeeManagementPage"));

// 🌀 Loading Spinner toàn màn hình khi chuyển đổi giữa các module
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
    <ProtectedRoute>
      <MainLayout />
      <Suspense fallback={<AdminPageLoader />}>
        <Outlet />
      </Suspense>
    </ProtectedRoute>
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
      { path: "vehicles/:vehicleId/images", element: <VehicleImageManagementPage /> },
      { path: "brands", element: <BrandManagementPage /> },
      { path: "models", element: <ModelManagementPage /> },
      { path: "employees", element: <EmployeeManagementPage /> },
      { path: "users", element: <UserManagementPage /> },
      { path: "branches", element: <BranchManagementPage /> },
      { path: "bookings", element: <BookingManagementPage /> },
      { path: "reviews", element: <ReviewManagementPage /> },
      { path: "payments", element: <PaymentManagementPage /> },
      { path: "bookings/:bookingId/return", element: <BookingReturnPage /> },
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
    element: <AdminDashboardLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "vehicles", element: <VehicleManagementPage /> },
      { path: "vehicles/:vehicleId/images", element: <VehicleImageManagementPage /> },
      { path: "brands", element: <BrandManagementPage /> },
      { path: "models", element: <ModelManagementPage /> },
      { path: "users", element: <UserManagementPage /> },
      { path: "branches", element: <BranchManagementPage /> },
      { path: "bookings", element: <BookingManagementPage /> },
      { path: "reviews", element: <ReviewManagementPage /> },
      { path: "payments", element: <PaymentManagementPage /> },
      { path: "bookings/:bookingId/return", element: <BookingReturnPage /> },
      { path: "chats", element: <ChatManagementPage /> },
      { path: "info", element: <InfoPage /> },
      { path: "security", element: <SecurityPage /> },
      { path: "settings", element: <SettingPage /> },
    ],
  },
]);

export default router;