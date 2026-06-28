import { Suspense } from "react"; // Chớ quên import Suspense nhé
import { Outlet } from "react-router-dom";
import AppFooter from "@/components/layouts/Footer";
import AppHeader from "@/components/layouts/Header";
import AppSidebar from "@/components/layouts/Sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/ui/sidebar";

// Nếu cần dùng AdminPageLoader ở đây, bạn có thể export nó từ file router hoặc tạo một Spinner tương tự
import { Spinner } from "@repo/ui/components/ui/spinner";
function LocalPageLoader() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center bg-background">
      <Spinner className="size-8" />
    </div>
  );
}

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-4">
        <AppHeader />
        <SidebarTrigger />
        <div className="h-full">
          {/* Bọc Suspense tại đây để chỉ load riêng phần nội dung trang */}
          <Suspense fallback={<LocalPageLoader />}>
            <Outlet />
          </Suspense>
        </div>
        <AppFooter />
      </main>
    </SidebarProvider>
  );
}
