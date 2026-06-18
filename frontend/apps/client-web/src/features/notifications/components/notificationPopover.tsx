import { Link } from "react-router-dom";

import { Bell } from "lucide-react";

import { useUnreadNotifications } from "@/features/notifications/useUnreadNotifications";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";

import { Button } from "@repo/ui/components/ui/button";

import { ScrollArea } from "@repo/ui/components/ui/scroll-area";

import { Separator } from "@repo/ui/components/ui/separator";

export function NotificationPopover() {
  const { data, isLoading } = useUnreadNotifications();

  const notifications = data ?? [];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />

          {notifications.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
              {notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[380px] p-0">
        <div className="p-4">
          <h4 className="font-semibold">Notifications</h4>

          <p className="text-sm text-muted-foreground">Unread notifications</p>
        </div>

        <Separator />

        <ScrollArea className="h-[350px]">
          <div className="flex flex-col">
            {isLoading && (
              <div className="p-4 text-sm text-muted-foreground">
                Loading...
              </div>
            )}

            {!isLoading &&
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex flex-col gap-1 p-4 transition hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{notification.title}</span>

                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>
              ))}
          </div>
        </ScrollArea>

        <Separator />

        <div className="p-3">
          <Button asChild className="w-full" variant="outline">
            <Link to="/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
