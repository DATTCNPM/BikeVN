import { Bell, ChevronDown, Menu, Search, Trash2 } from "lucide-react";

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
import { Input } from "@repo/ui/components/ui/input";
import { Separator } from "@repo/ui/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";

import { usePortalProfile } from "@/features/auth/hooks/usePortalProfile";
import { useNotificationStore } from "@/hooks/useNotificationStore"; // Import Store
import { useLogoutAdmin } from "@/features/auth/hooks/useLogoutAdmin"; // Thay đổi đường dẫn import cho đúng với dự án của bạn

export default function AppHeader() {
  const navigate = useNavigate();
  const logoutAdmin = useLogoutAdmin();

  const { data: portalProfile } = usePortalProfile();

  // 🔔 Lấy dữ liệu thông báo từ Zustand
  const { notifications, unreadCount, resetUnreadCount, clearNotifications } =
    useNotificationStore();

  const handleLogout = () => {
    logoutAdmin();
  };

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

          <div>
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>

            <p className="text-sm text-muted-foreground">
              Welcome back, {portalProfile?.name?.split(" ")[0] ?? "Admin"}!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden w-72 lg:block">
            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search..."
              className="h-11 rounded-2xl border-border/60 bg-muted/40 pl-11 shadow-none"
            />
          </div>

          {/* 🔔 CHIẾC CHUÔNG THÔNG BÁO REALTIME */}
          <DropdownMenu
            onOpenChange={(open) => {
              if (open) {
                // Khi click mở chuông ra xem thì reset bộ đếm chưa đọc về 0
                resetUnreadCount();
              }
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-2xl"
              >
                <Bell className="size-5" />

                {/* Chỉ hiển thị chấm đỏ khi có thông báo chưa đọc */}
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
                        // Xác định đường dẫn điều hướng dựa vào URL của Portal
                        const isEmployee =
                          window.location.pathname.startsWith("/employee");
                        const route = isEmployee
                          ? "/employee/bookings"
                          : "/admin/bookings";
                        navigate(route);
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

          {/* Dropdown User Profile giữ nguyên phía sau... */}
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
