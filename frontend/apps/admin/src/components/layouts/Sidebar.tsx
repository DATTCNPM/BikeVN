import {
  Bike,
  CircleDollarSign,
  ClipboardList,
  LayoutDashboard,
  Users,
  Store,
  MessageSquare,
  Star,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/ui/sidebar";

import Logo from "@/assets/icons/Logo_yellow.svg";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Khách hàng",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Quản lý xe",
    icon: Bike,
    href: "/admin/vehicles",
  },
  {
    title: "Quản lý hãng xe",
    icon: Bike,
    href: "/admin/brands",
  },
  {
    title: "Quản lý chi nhánh",
    icon: Store,
    href: "/admin/branches",
  },
  {
    title: "Quản lý model",
    icon: Bike,
    href: "/admin/models",
  },
  {
    title: "Đơn thuê",
    icon: ClipboardList,
    href: "/admin/bookings",
  },
  {
    title: "Đánh giá",
    icon: Star,
    href: "/admin/reviews",
  },
  {
    title: "Thanh toán",
    icon: CircleDollarSign,
    href: "/admin/payments",
  },
  {
    title: "Tin nhắn",
    icon: MessageSquare,
    href: "/admin/chats",
  },
  {
    title: "Quyền",
    icon: Users,
    href: "/admin/permissions",
  },
  {
    title: "Vai trò",
    icon: Users,
    href: "/admin/roles",
  },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-none">
      <SidebarHeader className="border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl text-primary-foreground shadow-lg shadow-primary/20">
            <img src={Logo} alt="Logo" />
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-tight">MotoRent Admin</h2>

            <p className="text-sm text-muted-foreground">Motorcycle Rental</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-5">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quản trị hệ thống
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {menuItems.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  location.pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        to={item.href}
                        className="group flex h-12 items-center gap-3 rounded-2xl px-4 text-sm font-medium transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                      >
                        <item.icon className="size-5 transition-transform duration-200 group-hover:scale-110" />

                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="rounded-2xl border bg-muted/50 p-4">
          <p className="text-sm font-semibold">MotoRent System</p>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Quản lý xe, đơn thuê và doanh thu trong một giao diện tập trung.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
