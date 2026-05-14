import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import HomePage from "../pages/HomePage";
import VehicleManagementPage from "@/pages/VehicleManagementPage";
import UserManagementPage from "@/pages/UserManagementPage";
import BranchManagementPage from "@/pages/BranchManagementPage";
import BookingManagementPage from "@/pages/BookingManagementPage";
import ReviewManagementPage from "@/pages/ReviewManagementPage";
import PaymentManagementPage from "@/pages/PaymentManagementPage";
import VehicleReturnManagementPage from "@/pages/VehicleReturnManagementPage";
import ChatManagementPage from "@/pages/ChatManagementPage";
import InfoPage from "@/pages/InfoPage";
import SecurityPage from "@/pages/SecurityPage";
import SettingPage from "@/pages/SettingPage";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <MainLayout />,
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
]);

export default router;
