import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-6 pt-20 pb-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
