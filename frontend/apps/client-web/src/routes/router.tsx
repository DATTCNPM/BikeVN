import { createBrowserRouter, Outlet, useNavigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
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
const MyBookingPage = lazy(() => import("@/pages/MyBookingPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));

function PageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Spinner className="size-8 text-primary" />
    </div>
  );
}

// GỌN GÀNG: Không check, không sub store ở đây. Cứ để app chạy tự nhiên, sập nguồn Axios sẽ ép nhảy trang.
function GlobalRootLayout() {
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
      { path: "server-error", element: <ServerErrorPage /> },
      { path: "*", element: <NotFoundPage /> },
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },
      {
        element: <MainLayout />,
        children: [
          { path: "home", element: <HomePage /> },
          { path: "vehicles/:id", element: <VehicleDetail /> },
          {
            element: <ProtectedRoute />,
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
