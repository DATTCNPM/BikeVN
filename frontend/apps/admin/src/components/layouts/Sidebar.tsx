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

import { ROLES } from "@repo/constants";
import { authStorageService, tokenService } from "@repo/services";

import Logo from "@/assets/icons/Logo_yellow.svg";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
  },
  {
    title: "Employees",
    icon: Users,
    path: "employees",
    roles: [ROLES.ADMIN],
  },
  {
    title: "Customers",
    icon: Users,
    path: "users",
    roles: [ROLES.ADMIN],
  },
  {
    title: "Vehicles",
    icon: Bike,
    path: "vehicles",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
  },
  {
    title: "Brands",
    icon: Bike,
    path: "brands",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
  },
  {
    title: "Branches",
    icon: Store,
    path: "branches",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
  },
  {
    title: "Models",
    icon: Bike,
    path: "models",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
  },
  {
    title: "Bookings",
    icon: ClipboardList,
    path: "bookings",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
  },
  {
    title: "Reviews",
    icon: Star,
    path: "reviews",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
  },
  {
    title: "Payments",
    icon: CircleDollarSign,
    path: "payments",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
  },
  {
    title: "Chats",
    icon: MessageSquare,
    path: "chats",
    roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
  },
  {
    title: "Permissions",
    icon: Users,
    path: "permissions",
    roles: [ROLES.ADMIN],
  },
  {
    title: "Roles",
    icon: Users,
    path: "roles",
    roles: [ROLES.ADMIN],
  },
];

export default function AppSidebar() {
  const location = useLocation();

  const token = authStorageService.getPortalToken();

  const roles = token ? tokenService.getRoles(token) : [];

  const isAdmin = roles.includes(ROLES.ADMIN);

  const basePath = isAdmin ? "/admin" : "/employee";

  const visibleMenus = menuItems.filter((menu) =>
    menu.roles.some((role) => roles.includes(role)),
  );

  return (
    <Sidebar className="border-none">
      <SidebarHeader className="border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl text-primary-foreground shadow-lg shadow-primary/20">
            <img src={Logo} alt="Logo" />
          </div>

          <div>
            <h2 className="text-lg font-bold tracking-tight">
              MotoRent Portal
            </h2>

            <p className="text-sm text-muted-foreground">Motorcycle Rental</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-5">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Main Menu
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {visibleMenus.map((item) => {
                const href = item.path ? `${basePath}/${item.path}` : basePath;

                const isActive =
                  location.pathname === href ||
                  location.pathname.startsWith(`${href}/`);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        to={href}
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
            Manage vehicles, bookings, and revenue in a centralized interface.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
