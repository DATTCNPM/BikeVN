import { createBrowserRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { lazy, Suspense } from "react";

import { useInitialServerCheck } from "@/features/auth/useInitialServerCheck";

import MainLayout from "@/components/layouts/MainLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
const Landing = lazy(() => import("@/pages/LandingPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const VehicleDetail = lazy(() => import("@/pages/VehicleDetailPage"));
const ChatPage = lazy(() => import("@/pages/ChatPage"));
const Login = lazy(() => import("@/pages/LoginPage"));
const Register = lazy(() => import("@/pages/RegisterPage"));
const ProfileLayout = lazy(() => import("@/components/layouts/ProfileLayout"));
const InfoSection = lazy(
  () => import("@/features/profile/components/InfoSection"),
);
const SettingSection = lazy(
  () => import("@/features/profile/components/SettingSection"),
);
const ChatLayout = lazy(() => import("@/components/layouts/ChatLayout"));
const BookingResultPage = lazy(() => import("@/pages/BookingResultPage"));
const MyBookingSection = lazy(
  () => import("@/features/profile/components/MyBookingSection"),
);
const PaymentPage = lazy(() => import("@/pages/PaymentPage"));
const NotificationPage = lazy(() => import("@/pages/NotificationPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const ServerErrorPage = lazy(() => import("@/pages/ServerErrorPage"));
const PaymentResultPage = lazy(() => import("@/pages/PaymentResultPage"));

import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/authStore";
import { Spinner } from "@repo/ui/components/ui/spinner";

// 🌀 Tạo một Loading Component dùng chung cho việc chuyển trang
function PageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Spinner className="size-8" />
    </div>
  );
}

function GlobalRootLayout() {
  const navigate = useNavigate();

  useInitialServerCheck();

  const isServerDown = useAuthStore((state) => state.isServerDown);

  useEffect(() => {
    if (isServerDown) {
      navigate("/server-error");
    }
  }, [isServerDown, navigate]);

  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}

function ProtectedRoute() {
  const navigate = useNavigate();
  const isLogin = useAuthStore((state) => state.isLogin);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  }, [isLogin]);

  // đã đăng nhập -> render route con
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
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
                path: "payment-result",
                element: <PaymentResultPage />,
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
