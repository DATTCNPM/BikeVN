import { Outlet } from "react-router-dom";

import AppFooter from "@/components/layouts/Footer";
import AppHeader from "@/components/layouts/Header";
import AppSidebar from "@/components/layouts/Sidebar";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/ui/sidebar";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 p-4">
        <AppHeader />
        <SidebarTrigger />
        <div className="h-full">
          <Outlet />
        </div>
        <AppFooter />
      </main>
    </SidebarProvider>
  );
}
