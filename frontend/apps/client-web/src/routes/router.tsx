import { createBrowserRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { usePingServer } from "@/features/auth/authHook";

import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Landing from "@/pages/Landing";
import HomePage from "@/pages/HomePage";
import VehicleDetail from "@/pages/VehicleDetail";
import ChatPage from "@/pages/ChatPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProfileLayout from "@/layouts/ProfileLayout";
import InfoSection from "@/components/profile/InfoSection";
import SettingSection from "@/components/profile/SettingSection";
import ChatLayout from "@/layouts/ChatLayout";
import BookingResultPage from "@/pages/BookingResultPage";
import MyBookingSection from "@/components/profile/MyBookingSection";
import PaymentPage from "@/pages/PaymentPage";
import NotificationPage from "@/pages/NotificationPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ServerErrorPage from "@/pages/ServerErrorPage";

import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/authStore";
function GlobalRootLayout() {
  const navigate = useNavigate();
  usePingServer();
  const isServerDown = useAuthStore((state) => state.isServerDown);
  console.log("isServerDown:", isServerDown);
  useEffect(() => {
    if (isServerDown) {
      navigate("/server-error");
    }
  }, [isServerDown]);
  return <Outlet />;
}
function ProtectedRoute() {
  const navigate = useNavigate();
  const isLogin = useAuthStore((state) => state.isLogin);

  if (!isLogin) {
    navigate("/login");
  }

  // đã đăng nhập -> render route con
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalRootLayout />, // Layout gốc để kiểm tra server status
    children: [
      {
        index: true,
        element: <Landing />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/vehicles/:id",
        element: <VehicleDetail />,
      },
      {
        element: <ProtectedRoute />, // Bọc các route cần bảo vệ bằng ProtectedRoute
        children: [
          {
            path: "/booking-result/:id",
            element: <BookingResultPage />,
          },
          {
            path: "/payment/:id",
            element: <PaymentPage />,
          },
          {
            path: "/notifications",
            element: <NotificationPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />, // Bọc các route cần bảo vệ bằng ProtectedRoute
    children: [
      {
        element: <ChatLayout />,
        children: [
          {
            path: "/chat",
            element: <ChatPage />,
          },
        ],
      },
      {
        path: "/profile",
        element: <ProfileLayout />,
        children: [
          {
            index: true,
            path: "info",
            element: <InfoSection />,
          },
          {
            path: "settings",
            element: <SettingSection />,
          },
          {
            path: "bookings",
            element: <MyBookingSection />,
          },
        ],
      },
    ],
  },
  {
    path: "/server-error",
    element: <ServerErrorPage />,
  },
]);

export default router;
