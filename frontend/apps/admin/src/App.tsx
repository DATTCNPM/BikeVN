import { RouterProvider } from "react-router-dom";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { QueryProvider } from "@repo/providers";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { useServerHealthCheck, useAuthStore } from "@repo/hooks";
import { ServerErrorPage } from "@/pages/ServerErrorPage";
import router from "./router/router";

function AppContent() {
  useServerHealthCheck(import.meta.env.VITE_API_URL);
  const isServerDown = useAuthStore((state) => state.isServerDown);

  // 🌟 Không bọc AuthListenerProvider ở đây nữa để tránh lỗi useNavigate
  return isServerDown ? (
    <ServerErrorPage />
  ) : (
    <RouterProvider router={router} />
  );
}

export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AppContent />
        <Toaster />
      </QueryProvider>
    </ThemeProvider>
  );
}
