import { User, Settings, LogOut, ChevronUp, ShieldCheck } from "lucide-react";
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
} from "@repo/ui/components/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import { useAuthStore } from "@/stores/useAuthStore";

export function ProfileSidebar() {
  const { userProfile } = useAuthStore();
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar className="h-9 w-9 border border-primary/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {userProfile?.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm truncate">
              {userProfile?.name}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {userProfile?.email}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tài khoản</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Thông tin">
                  <a href="/profile/info">
                    <User /> <span>Thông tin cá nhân</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Cài đặt">
                  <a href="/profile/settings">
                    <Settings /> <span>Cài đặt hệ thống</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Đặt xe của tôi">
                  <a href="/profile/bookings">
                    <Settings /> <span>Quản lý đặt xe</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="text-destructive" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Đăng xuất
                  </span>
                  <ChevronUp className="ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <span>Xác nhận đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
