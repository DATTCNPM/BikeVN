import Header from "@/components/layouts/Header";
import { Outlet } from "react-router-dom";

export default function MainLayoutNoFooter() {
  return (
    <div className="flex flex-col min-h-screen bg-background antialiased selection:bg-primary/20">
      {/* Cố định ở trên cùng */}
      <Header />

      {/* Tận dụng tối đa không gian hiển thị sản phẩm */}
      <main className="flex-1 w-full max-w-[1680px] mx-auto px-6 lg:px-8 pt-24 pb-5 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}
