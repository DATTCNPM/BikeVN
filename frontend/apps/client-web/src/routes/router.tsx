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
