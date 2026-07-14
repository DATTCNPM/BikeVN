import { Bell, ChevronDown, Menu, Search } from "lucide-react";

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

import { usePortalAuth } from "@/features/auth/hooks/usePortalAuth";
import { usePortalProfile } from "@/features/auth/hooks/usePortalProfile";

export default function AppHeader() {
  const navigate = useNavigate();

  const logoutPortal = usePortalAuth((state) => state.logoutPortal);

  const { data: portalProfile } = usePortalProfile();

  const handleLogout = () => {
    logoutPortal();
    void navigate("/login");
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

          <Button
            variant="outline"
            size="icon"
            className="relative rounded-2xl"
          >
            <Bell className="size-5" />

            <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
          </Button>

          <Separator orientation="vertical" className="hidden h-10 md:block" />

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
