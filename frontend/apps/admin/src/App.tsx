import router from "./router/router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { QueryProvider } from "@repo/providers";
import { AuthInitializer } from "./features/auth/AuthInitializer";

// ✨ THÊM: Import hooks và store dùng chung từ Monorepo
import { useServerHealthCheck } from "@repo/hooks";
import { useAuthStore } from "@repo/hooks";
import { ServerErrorPage } from "@/pages/ServerErrorPage"; // Giao diện bảo trì của app này

function App() {
  // ✨ THÊM: Chủ động kích hoạt vòng lặp ping dựa theo biến môi trường API_URL của app
  useServerHealthCheck(import.meta.env.VITE_API_URL);

  // ✨ THÊM: Lấy cờ trạng thái server sập/ngủ từ Zustand store dùng chung
  const isServerDown = useAuthStore((state) => state.isServerDown);

  return (
    <QueryProvider>
      {/* 💡 Mẹo kiến trúc: Bạn nên để AuthInitializer chạy song song. 
        Khi isServerDown = true, ta chặn RouterProvider lại để tránh lỗi sập giao diện do thiếu data.
      */}
      <AuthInitializer />

      {isServerDown ? <ServerErrorPage /> : <RouterProvider router={router} />}

      <Toaster />
    </QueryProvider>
  );
}

export default App;
