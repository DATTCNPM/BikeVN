import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/components/layouts/MainLayout";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import HomePage from "../pages/HomePage";
import VehicleManagementPage from "@/pages/VehicleManagementPage";
import BrandManagementPage from "@/pages/BrandManagementPage";
import UserManagementPage from "@/pages/UserManagementPage";
import BranchManagementPage from "@/pages/BranchManagementPage";
import ModelManagementPage from "@/pages/ModelManagementPage";
import VehicleImageManagementPage from "@/pages/VehicleImageManagementPage";
import BookingManagementPage from "@/pages/BookingManagementPage";
import ReviewManagementPage from "@/pages/ReviewManagementPage";
import PaymentManagementPage from "@/pages/PaymentManagementPage";
import ChatManagementPage from "@/pages/ChatManagementPage";
import InfoPage from "@/pages/InfoPage";
import SecurityPage from "@/pages/SecurityPage";
import SettingPage from "@/pages/SettingPage";
import LoginPage from "@/pages/LoginPage";
import BookingReturnPage from "@/pages/BookingReturnPage";
import PermissionManagementPage from "@/pages/PermissionManagementPage";
import RoleManagementPage from "@/pages/RoleManagementPage";
import EmployeeManagementPage from "@/pages/EmployeeManagementaPage";
import AuthRedirectRoute from "@/features/auth/AuthRedirectRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirectRoute />,
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "vehicles",
        element: <VehicleManagementPage />,
      },
      {
        path: "vehicles/:vehicleId/images",
        element: <VehicleImageManagementPage />,
      },
      {
        path: "brands",
        element: <BrandManagementPage />,
      },
      {
        path: "models",
        element: <ModelManagementPage />,
      },
      {
        path: "employees",
        element: <EmployeeManagementPage />,
      },
      {
        path: "users",
        element: <UserManagementPage />,
      },
      {
        path: "branches",
        element: <BranchManagementPage />,
      },
      {
        path: "bookings",
        element: <BookingManagementPage />,
      },
      {
        path: "reviews",
        element: <ReviewManagementPage />,
      },
      {
        path: "payments",
        element: <PaymentManagementPage />,
      },
      {
        path: "bookings/:bookingId/return",
        element: <BookingReturnPage />,
      },
      {
        path: "chats",
        element: <ChatManagementPage />,
      },
      {
        path: "info",
        element: <InfoPage />,
      },
      {
        path: "security",
        element: <SecurityPage />,
      },
      {
        path: "settings",
        element: <SettingPage />,
      },
      {
        path: "permissions",
        element: <PermissionManagementPage />,
      },
      {
        path: "roles",
        element: <RoleManagementPage />,
      },
    ],
  },

  {
    path: "employee",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "vehicles",
        element: <VehicleManagementPage />,
      },
      {
        path: "vehicles/:vehicleId/images",
        element: <VehicleImageManagementPage />,
      },
      {
        path: "brands",
        element: <BrandManagementPage />,
      },
      {
        path: "models",
        element: <ModelManagementPage />,
      },
      {
        path: "users",
        element: <UserManagementPage />,
      },
      {
        path: "branches",
        element: <BranchManagementPage />,
      },
      {
        path: "bookings",
        element: <BookingManagementPage />,
      },
      {
        path: "reviews",
        element: <ReviewManagementPage />,
      },
      {
        path: "payments",
        element: <PaymentManagementPage />,
      },
      {
        path: "bookings/:bookingId/return",
        element: <BookingReturnPage />,
      },
      {
        path: "chats",
        element: <ChatManagementPage />,
      },
      {
        path: "info",
        element: <InfoPage />,
      },
      {
        path: "security",
        element: <SecurityPage />,
      },
      {
        path: "settings",
        element: <SettingPage />,
      },
    ],
  },

  {
    path: "login",
    element: <LoginPage />,
  },
]);

export default router;
