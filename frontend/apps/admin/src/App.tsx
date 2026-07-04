import router from "./router/router";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@repo/ui/components/ui/sonner";
import { QueryProvider } from "@repo/providers";
import { AuthInitializer } from "./features/auth/AuthInitializer";

// Import hooks và store dùng chung từ Monorepo
import { useServerHealthCheck } from "@repo/hooks";
import { useAuthStore } from "@repo/hooks";
import { ServerErrorPage } from "@/pages/ServerErrorPage"; // Giao diện bảo trì của app này

// 🌟 TÁCH THÀNH COMPONENT CON: Để đảm bảo chạy bên dưới QueryProvider
function AppContent() {
  // Now safely inside QueryProvider context!
  useServerHealthCheck(import.meta.env.VITE_API_URL);

  // Lấy cờ trạng thái server sập/ngủ từ Zustand store dùng chung
  const isServerDown = useAuthStore((state) => state.isServerDown);

  return (
    <>
      {/* AuthInitializer chạy song song để kiểm tra token/profile */}
      <AuthInitializer />

      {/* Chặn router nếu server sập */}
      {isServerDown ? <ServerErrorPage /> : <RouterProvider router={router} />}
    </>
  );
}

// 🌟 COMPONENT APP GỐC: Chỉ đóng vai trò cấu hình Provider ở tầng cao nhất
function App() {
  return (
    <QueryProvider>
      <AppContent />
      <Toaster />
    </QueryProvider>
  );
}

export default App;
