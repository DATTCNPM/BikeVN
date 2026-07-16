import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { ROLES } from "@repo/constants";
import { AuthListenerProvider } from "@repo/providers";

// UI Components & Guards
import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import { Spinner } from "@repo/ui/components/ui/spinner";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ServerErrorPage } from "@/pages/ServerErrorPage";

// Lazy Loading Pages
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
const VehicleReturnAdminPage = lazy(
  () => import("@/pages/VehicleReturnAdminPage"),
);
const VehicleReturnBranchPage = lazy(
  () => import("@/pages/VehicleReturnBranchPage"),
);

// Khai báo cấu hình spinner inline đơn giản
const loader = (
  <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background">
    <Spinner className="size-8" />
  </div>
);
function RootLayout() {
  return (
    <AuthListenerProvider loginPath="/login">
      <Outlet />
    </AuthListenerProvider>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // 🌟 Đặt RootLayout làm chốt chặn cao nhất chứa Context Router
    children: [
      {
        index: true,
        element: <ProtectedRoute />,
      },
      {
        path: "login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Suspense fallback={loader}>
              <LoginPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      // 👑 ADMIN ROUTES
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <Suspense fallback={loader}>
              <MainLayout />
            </Suspense>
          </ProtectedRoute>
        ),
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
          {
            path: "bookings/:bookingId/return",
            element: <BookingReturnPage />,
          },
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
        element: (
          <ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]}>
            <Suspense fallback={loader}>
              <MainLayout />
            </Suspense>
          </ProtectedRoute>
        ),
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
          {
            path: "bookings/:bookingId/return",
            element: <BookingReturnPage />,
          },
          { path: "vehicle-returns", element: <VehicleReturnBranchPage /> },
          { path: "chats", element: <ChatManagementPage /> },
          { path: "info", element: <InfoPage /> },
          { path: "security", element: <SecurityPage /> },
          { path: "settings", element: <SettingPage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
      { path: "server-error", element: <ServerErrorPage /> },
    ],
  },
]);

export default router;
