import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import Landing from "@/pages/landing/Landing";
import HomePage from "@/pages/home/HomePage";
import VehicleDetail from "@/pages/vehicle/VehicleDetail";
import ChatPage from "@/pages/chat/ChatPage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ProfileLayout from "@/layouts/ProfileLayout";
import InfoSection from "@/pages/profile/InfoSection";
import SettingSection from "@/pages/profile/SettingSection";
import ChatLayout from "@/layouts/ChatLayout";

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
    ],
  },
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
    ],
  },
]);

export default router;
