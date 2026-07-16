import { Bell, ChevronDown, Menu, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Separator } from "@repo/ui/components/ui/separator";
import { Link, useNavigate, useLocation } from "react-router-dom"; // 🌟 Import thêm useLocation

import { usePortalProfile } from "@/features/auth/hooks/usePortalProfile";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { useLogoutAdmin } from "@/features/auth/hooks/useLogoutAdmin";

// 🌟 1. CẤU HÌNH TIÊU ĐỀ & MÔ TẢ ĐỘNG THEO PATHNAME
const ROUTE_METADATA: Record<string, { title: string; description: string }> = {
  dashboard: {
    title: "Dashboard",
    description:
      "Overview of system metrics, recent activities, and quick access to management features.",
  },
  vehicles: {
    title: "Vehicle Management",
    description: "List, status, and update information of vehicles.",
  },
  brands: {
    title: "Brands",
    description: "Manage the list of vehicle brands in the system.",
  },
  models: {
    title: "Models",
    description: "Manage vehicle models and trim levels.",
  },
  employees: {
    title: "Employees",
    description: "Manage employee accounts, permissions, and schedules.",
  },
  users: {
    title: "Users",
    description: "List of registered customers and their interaction history.",
  },
  branches: {
    title: "Branches",
    description: "Manage the network of store branches across the system.",
  },
  bookings: {
    title: "Bookings",
    description:
      "Track, approve, and update the progress of vehicle rental schedules.",
  },
  reviews: {
    title: "Reviews",
    description: "Feedback and ratings from customers.",
  },
  payments: {
    title: "Payments",
    description: "Transaction logs, invoices, and payment history.",
  },
  "vehicle-returns": {
    title: "Vehicle Returns",
    description: "List of return documents and vehicle handover records.",
  },
  chats: {
    title: "Customer Support",
    description: "Online chat channel for real-time customer assistance.",
  },
  info: {
    title: "Personal Information",
    description: "View and update your member profile.",
  },
  settings: {
    title: "System Settings",
    description: "Customize general operational parameters of the software.",
  },
  security: {
    title: "Account Security",
    description: "Manage passwords, security keys, and login sessions.",
  },
  permissions: {
    title: "Permission Management",
    description: "Configure detailed actions allowed within the system.",
  },
  roles: {
    title: "Roles & Permissions",
    description: "Assign administrative roles and manage system permissions.",
  },
};

// 🌟 2. HELPER FUNCTION ĐỂ ĐỌC METADATA DỰA TRÊN PATH HIỆN TẠI
function getHeaderMetadata(pathname: string) {
  const defaultMeta = {
    title: "Hệ thống quản trị",
    description: "Hệ thống quản lý dịch vụ cho thuê xe BikeVN.",
  };

  // Chia nhỏ path thành các segment (Ví dụ: "/admin/vehicles/123/images" -> ["admin", "vehicles", "123", "images"])
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return defaultMeta;

  // Nếu đang ở trang chủ admin hoặc employee (Ví dụ: /admin hoặc /employee)
  if (
    segments.length === 1 &&
    (segments[0] === "admin" || segments[0] === "employee")
  ) {
    return ROUTE_METADATA.dashboard;
  }

  // Ưu tiên tìm kiếm key khớp với segment tiếp theo (Ví dụ: "vehicles", "bookings"...)
  // Giải quyết được cả trường hợp route lồng phức tạp hoặc route động: "/admin/bookings/5/return" -> Tìm key "bookings" hoặc "return"
  for (const segment of segments.reverse()) {
    if (ROUTE_METADATA[segment]) {
      return ROUTE_METADATA[segment];
    }
  }

  return defaultMeta;
}

export default function AppHeader() {
  const navigate = useNavigate();
  const logoutAdmin = useLogoutAdmin();
  const { pathname } = useLocation(); // 🌟 Lấy pathname hiện tại của trình duyệt

  const { data: portalProfile } = usePortalProfile();
  const { notifications, unreadCount, resetUnreadCount, clearNotifications } =
    useNotificationStore();

  const handleLogout = () => {
    logoutAdmin();
  };

  // 🌟 Lấy thông tin tiêu đề và mô tả động tương ứng với URL hiện tại
  const { title, description } = getHeaderMetadata(pathname);

  const initials =
    portalProfile?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "AD";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl lg:hidden"
          >
            <Menu className="size-5" />
          </Button>

          {/* 🌟 HIỂN THỊ TIÊU ĐỀ & MÔ TẢ ĐỘNG */}
          <div>
            <h1 className="text-lg font-bold tracking-tight md:text-xl">
              {title}
            </h1>
            <p className="hidden text-xs text-muted-foreground md:block">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 🔔 CHUÔNG THÔNG BÁO */}
          <DropdownMenu
            onOpenChange={(open) => {
              if (open) resetUnreadCount();
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-2xl"
              >
                <Bell className="size-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <p className="font-semibold text-sm">Notifications</p>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 rounded-lg text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotifications();
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />

              <div className="max-h-[300px] overflow-y-auto space-y-1">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-xs text-muted-foreground">
                      No new alerts yet
                    </p>
                  </div>
                ) : (
                  notifications.map((item, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      className="flex flex-col items-start gap-1 p-3 rounded-xl cursor-pointer"
                      onClick={() => {
                        const isEmployee =
                          window.location.pathname.startsWith("/employee");
                        const route = isEmployee
                          ? "/employee/bookings"
                          : "/admin/bookings";
                        void navigate(route);
                      }}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span className="font-semibold text-xs text-primary">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(item.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.content}
                      </p>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="hidden h-10 md:block" />

          {/* USER PROFILE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-14 rounded-2xl px-2 hover:bg-muted"
              >
                <Avatar className="size-11 border">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="hidden text-left md:block">
                  <p className="text-sm font-semibold">
                    {portalProfile?.name ?? "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {portalProfile?.email ?? ""}
                  </p>
                </div>

                <ChevronDown className="ml-2 hidden size-4 text-muted-foreground md:block" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 rounded-2xl">
              <DropdownMenuLabel className="space-y-1">
                <p className="font-semibold">Admin System</p>
                <p className="text-xs font-normal text-muted-foreground">
                  {portalProfile?.email ?? "admin@example.com"}
                </p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <Link to="/admin/info">Profile</Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link to="/admin/settings">Settings</Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link to="/admin/security">Security</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Badge className="hidden rounded-xl px-3 py-1 md:flex">Online</Badge>
        </div>
      </div>
    </header>
  );
}
