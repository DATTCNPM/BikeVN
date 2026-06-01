import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import HomePage from "../pages/HomePage";
import VehicleManagementPage from "@/pages/VehicleManagementPage";
import BrandManagementPage from "@/pages/BrandManagementPage";
import UserManagementPage from "@/pages/UserManagementPage";
import BranchManagementPage from "@/pages/BranchManagementPage";
import ModelManagementPage from "@/pages/ModelManagementPage";
import BookingManagementPage from "@/pages/BookingManagementPage";
import ReviewManagementPage from "@/pages/ReviewManagementPage";
import PaymentManagementPage from "@/pages/PaymentManagementPage";
import VehicleReturnManagementPage from "@/pages/VehicleReturnManagementPage";
import ChatManagementPage from "@/pages/ChatManagementPage";
import InfoPage from "@/pages/InfoPage";
import SecurityPage from "@/pages/SecurityPage";
import SettingPage from "@/pages/SettingPage";
import LoginPage from "@/pages/LoginPage";

const router = createBrowserRouter([
  {
    path: "/admin",
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
        path: "vehicle-returns",
        element: <VehicleReturnManagementPage />,
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
    path: "/admin/login",
    element: <LoginPage />,
  },
]);

export default router;
