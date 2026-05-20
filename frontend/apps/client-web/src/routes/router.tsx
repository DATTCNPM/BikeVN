import { createBrowserRouter } from "react-router-dom";
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
import NotFoundPage from "@/pages/NotFoundPage";

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

function ProtectedRoute() {
  // dùng state này từ useAuthStore
  const isLogin = useAuthStore((state) => state.isLogin);

  // chưa đăng nhập -> đá về login
  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  // đã đăng nhập -> render route con
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <Landing />,
      },
    ],
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
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
