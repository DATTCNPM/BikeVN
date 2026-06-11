import { createBrowserRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useInitialServerCheck } from "@/features/auth/useInitialServerCheck";

import MainLayout from "@/components/layouts/MainLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import Landing from "@/pages/LandingPage";
import HomePage from "@/pages/HomePage";
import VehicleDetail from "@/pages/VehicleDetailPage";
import ChatPage from "@/pages/ChatPage";
import Login from "@/pages/LoginPage";
import Register from "@/pages/RegisterPage";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import InfoSection from "@/features/profile/components/InfoSection";
import SettingSection from "@/features/profile/components/SettingSection";
import ChatLayout from "@/components/layouts/ChatLayout";
import BookingResultPage from "@/pages/BookingResultPage";
import MyBookingSection from "@/features/profile/components/MyBookingSection";
import PaymentPage from "@/pages/PaymentPage";
import NotificationPage from "@/pages/NotificationPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ServerErrorPage from "@/pages/ServerErrorPage";

import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/authStore";
function GlobalRootLayout() {
  const navigate = useNavigate();
  console.log("GlobalRootLayout mounted");

  useInitialServerCheck();

  const isServerDown = useAuthStore((state) => state.isServerDown);

  useEffect(() => {
    if (isServerDown) {
      navigate("/server-error");
    }
  }, [isServerDown, navigate]);

  return <Outlet />;
}

function ProtectedRoute() {
  const navigate = useNavigate();
  const isLogin = useAuthStore((state) => state.isLogin);

  console.log("ProtectedRoute - isLogin:", isLogin);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin]);

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
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "server-error",
        element: <ServerErrorPage />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
        ],
      },
      {
        element: <MainLayout />,
        children: [
          {
            path: "home",
            element: <HomePage />,
          },
          {
            path: "vehicles/:id",
            element: <VehicleDetail />,
          },
          {
            element: <ProtectedRoute />, // Bọc các route cần bảo vệ bằng ProtectedRoute
            children: [
              {
                path: "booking-result/:id",
                element: <BookingResultPage />,
              },
              {
                path: "payment/:id",
                element: <PaymentPage />,
              },
              {
                path: "notifications",
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
                path: "chat",
                element: <ChatPage />,
              },
            ],
          },
          {
            path: "profile",
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
    ],
  },
]);

export default router;
