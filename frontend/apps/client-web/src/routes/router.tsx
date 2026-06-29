import { createBrowserRouter, Outlet, useNavigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useInitialServerCheck } from "@/features/auth/useInitialServerCheck";
import { useAuthStore } from "@/features/auth/authStore";
import { Spinner } from "@repo/ui/components/ui/spinner";

import MainLayout from "@/components/layouts/MainLayout";
import AuthLayout from "@/components/layouts/AuthLayout";

// Lazy loading pages
const Landing = lazy(() => import("@/pages/LandingPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const VehicleDetail = lazy(() => import("@/pages/VehicleDetailPage"));
const ChatPage = lazy(() => import("@/pages/ChatPage"));
const Login = lazy(() => import("@/pages/LoginPage"));
const Register = lazy(() => import("@/pages/RegisterPage"));
const BookingResultPage = lazy(() => import("@/pages/BookingResultPage"));
const PaymentPage = lazy(() => import("@/pages/PaymentPage"));
const NotificationPage = lazy(() => import("@/pages/NotificationPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const ServerErrorPage = lazy(() => import("@/pages/ServerErrorPage"));
const PaymentResultPage = lazy(() => import("@/pages/PaymentResultPage"));

// Lazy loading profile sections (Sẽ gom cụm lại ở Phase 3)
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));

function PageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Spinner className="size-8 text-primary" />
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

  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalRootLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "*", element: <NotFoundPage /> },
      { path: "server-error", element: <ServerErrorPage /> },
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },
      // 🌟 TẤT CẢ TẬP TRUNG TẠI MAIN LAYOUT DUY NHẤT
      {
        element: <MainLayout />,
        children: [
          { path: "home", element: <HomePage /> },
          { path: "vehicles/:id", element: <VehicleDetail /> },

          // Các route bắt buộc Đăng nhập
          {
            element: <ProtectedRoute />,
            children: [
              { path: "chat", element: <ChatPage /> },

              // Cấu trúc phẳng cho Profile (Không lồng thêm Layout)
              { path: "profile", element: <ProfilePage /> },

              { path: "booking-result/:id", element: <BookingResultPage /> },
              { path: "payment/:id", element: <PaymentPage /> },
              { path: "payment-result", element: <PaymentResultPage /> },
              { path: "notifications", element: <NotificationPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
