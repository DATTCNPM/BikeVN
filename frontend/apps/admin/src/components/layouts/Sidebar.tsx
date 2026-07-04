import {
  LayoutDashboard,
  Users,
  UserCheck,
  Bike,
  Layers,
  Store,
  MapPin,
  ClipboardList,
  History,
  Star,
  CircleDollarSign,
  MessageSquare,
  ShieldAlert,
  KeyRound,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@repo/ui/components/wrapper/Logo";

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

import { ROLES } from "@repo/constants";
import { authStorageService, tokenService } from "@repo/services";

// Danh sách Menu được cấu trúc lại theo từng nhóm hợp lý
const menuGroups = [
  {
    groupLabel: "Overview",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "",
        roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
      },
      {
        title: "Chats",
        icon: MessageSquare,
        path: "chats",
        roles: [ROLES.EMPLOYEE],
      },
    ],
  },
  {
    groupLabel: "Operations",
    items: [
      {
        title: "Bookings",
        icon: ClipboardList,
        path: "bookings",
        roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
      },
      {
        title: "Vehicle Returns",
        icon: History, // Icon lịch sử/trả xe thay vì lặp lại ClipboardList
        path: "vehicle-returns",
        roles: [ROLES.ADMIN, ROLES.EMPLOYEE], // Gộp cả 2 role vào đây
      },
      {
        title: "Payments",
        icon: CircleDollarSign,
        path: "payments",
        roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
      },
      {
        title: "Reviews",
        icon: Star,
        path: "reviews",
        roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
      },
    ],
  },
  {
    groupLabel: "Fleet & Network",
    items: [
      {
        title: "Vehicles",
        icon: Bike,
        path: "vehicles",
        roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
      },
      {
        title: "Models",
        icon: Layers, // Phân lớp dòng xe / đời xe
        path: "models",
        roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
      },
      {
        title: "Brands",
        icon: MapPin, // Nhãn mác / Xuất xứ thương hiệu
        path: "brands",
        roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
      },
      {
        title: "Branches",
        icon: Store,
        path: "branches",
        roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
      },
    ],
  },
  {
    groupLabel: "User & Access Management",
    items: [
      {
        title: "Employees",
        icon: UserCheck, // Phân biệt với khách hàng bằng icon nhân sự được duyệt
        path: "employees",
        roles: [ROLES.ADMIN],
      },
      {
        title: "Customers",
        icon: Users, // Khách hàng (Số đông)
        path: "users",
        roles: [ROLES.ADMIN],
      },
      {
        title: "Roles",
        icon: KeyRound, // Vai trò / Khóa bảo mật
        path: "roles",
        roles: [ROLES.ADMIN],
      },
      {
        title: "Permissions",
        icon: ShieldAlert, // Quyền truy cập hệ thống công nghệ
        path: "permissions",
        roles: [ROLES.ADMIN],
      },
    ],
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const token = authStorageService.getPortalToken();
  const roles = token ? tokenService.getRoles(token) : [];
  const isAdmin = roles.includes(ROLES.ADMIN);
  const basePath = isAdmin ? "/admin" : "/employee";

  return (
    <Sidebar className="border-none">
      <SidebarHeader className="border-b px-6 py-5">
        <div className="flex items-center gap-3 select-none">
          {/* Khung bọc logo nhỏ gọn, bo góc công nghệ */}
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-950 text-amber-400 p-2 shadow-md shadow-neutral-950/20 border border-neutral-800 transition-transform duration-300 hover:scale-105">
            <Logo className="size-full animate-pulse [animation-duration:4s]" />
          </div>

          <div>
            <h2 className="text-[15px] font-bold tracking-tight text-foreground leading-tight">
              MotoRent{" "}
              <span className="text-amber-500 font-extrabold">Portal</span>
            </h2>
            <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
              Motorcycle Rental
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-3 space-y-4">
        {menuGroups.map((group) => {
          // Lọc các item trong nhóm phù hợp với Role hiện tại
          const visibleItems = group.items.filter((item) =>
            item.roles.some((role) => roles.includes(role)),
          );

          // Nếu nhóm không có item nào hiển thị cho role này thì bỏ qua không render nhóm đó
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={group.groupLabel} className="p-0">
              <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1.5">
                {group.groupLabel}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {visibleItems.map((item) => {
                    const href = item.path
                      ? `${basePath}/${item.path}`
                      : basePath;
                    const isActive =
                      location.pathname === href ||
                      location.pathname.startsWith(`${href}/`);

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link
                            to={href}
                            className="group flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary"
                          >
                            <item.icon className="size-4.5 transition-transform duration-200 group-hover:scale-105" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="rounded-2xl border bg-muted/50 p-4">
          <p className="text-sm font-semibold">BIKEVN SYSTEM</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Manager system for BikeVN.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
