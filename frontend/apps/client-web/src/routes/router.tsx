import { createBrowserRouter, Outlet, useNavigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { Spinner } from "@repo/ui/components/ui/spinner";

import MainLayout from "@/components/layouts/MainLayout";
import AuthLayout from "@/components/layouts/AuthLayout";
import MainLayoutNoFooter from "@/components/layouts/MainLayoutNoFooter"; // 🌟 Import Layout không Footer

import { AuthListenerProvider } from "@repo/providers";

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
const PaymentResultPage = lazy(() => import("@/pages/PaymentResultPage"));
const MyBookingPage = lazy(() => import("@/pages/MyBookingPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));

function PageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Spinner className="size-8 text-primary" />
    </div>
  );
}

function GlobalRootLayout() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AuthListenerProvider loginPath="/login">
        <Outlet />
      </AuthListenerProvider>
    </Suspense>
  );
}

function ProtectedRoute() {
  const navigate = useNavigate();
  const isLogin = useAuthStore((state) => state.isLogin);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login", { replace: true });
    }
  }, [isLogin, navigate]);

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

      // 🔐 1. AUTH LAYOUT (Login/Register)
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },

      // 💻 2. MAIN LAYOUT (CÓ FOOTER - Dành cho duyệt xe và trang chủ)
      {
        element: <MainLayout />,
        children: [
          { path: "home", element: <HomePage /> },
          { path: "vehicles/:id", element: <VehicleDetail /> },
        ],
      },

      // 🚫 3. MAIN LAYOUT NO FOOTER (KHÔNG CÓ FOOTER - Dành cho tính năng, thanh toán, trang cá nhân)
      {
        element: <MainLayoutNoFooter />,
        children: [
          {
            element: <ProtectedRoute />, // Chốt chặn bảo vệ nằm bên trong layout không footer
            children: [
              { path: "chat", element: <ChatPage /> },
              { path: "profile", element: <ProfilePage /> },
              { path: "booking-result/:id", element: <BookingResultPage /> },
              { path: "payment/:id", element: <PaymentPage /> },
              { path: "payment-result", element: <PaymentResultPage /> },
              { path: "notifications", element: <NotificationPage /> },
              { path: "my-bookings", element: <MyBookingPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
