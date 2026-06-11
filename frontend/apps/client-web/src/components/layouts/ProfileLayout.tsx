import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@repo/ui/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/ui/breadcrumb";
import { ProfileSidebar } from "@/features/profile/components/ProfileSidebar";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "@/assets/icons/Logo_yellow.svg";
import { Home, MessageCircle, Bell } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

import { useLocation } from "react-router-dom";

export default function ProfileLayout() {
  const location = useLocation();
  console.log(location.pathname);
  const breadcrumbMap: Record<string, string> = {
    "/profile/info": "Thông tin cá nhân",
    "/profile/settings": "Cài đặt",
  };
  return (
    <SidebarProvider>
      <ProfileSidebar />
      <SidebarInset className="bg-background ">
        {/* Header Header bên trong layout để chứa nút trigger */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-2 px-2">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {breadcrumbMap[location.pathname] || "Profile"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Link to="/home" className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-10" />
            <span className="text-2xl text-primary font-bold">BikeVN</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/home"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
            >
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link
              to="/chat"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all"
            >
              <MessageCircle className="w-4 h-4" /> Chat
            </Link>
            <Button variant="outline" className="p-2 rounded-full">
              <Bell className="w-4 h-4" />
            </Button>
          </nav>
        </header>

        {/* Vùng nội dung thay đổi */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
