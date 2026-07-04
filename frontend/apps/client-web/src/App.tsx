import { RouterProvider } from "react-router-dom";
import router from "@/routes/router";
import "leaflet/dist/leaflet.css";
import { TooltipProvider } from "@repo/ui/components/ui/tooltip";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { ThemeProvider } from "@/components/common/ThemeProvider";

// ✨ THÊM: Import các gói dùng chung từ Monorepo và trang lỗi
import { useServerHealthCheck } from "@repo/hooks";
import { useAuthStore } from "@repo/hooks";
import ServerErrorPage from "@/pages/ServerErrorPage"; // Hoặc đường dẫn chính xác tới trang lỗi của bạn

export default function App() {
  // ✨ THÊM: Chủ động kích hoạt luồng ping dựa theo URL cấu hình của App
  useServerHealthCheck(import.meta.env.VITE_API_URL);

  // ✨ THÊM: Lấy trạng thái server từ Zustand store dùng chung
  const isServerDown = useAuthStore((state) => state.isServerDown);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        {/* ✨ SỬA: Biện pháp rẽ nhánh UI độc lập dựa vào trạng thái server */}
        {isServerDown ? (
          <ServerErrorPage />
        ) : (
          <RouterProvider router={router} />
        )}

        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
