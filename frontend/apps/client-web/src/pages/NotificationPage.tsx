"use client";

import { useNotifications } from "@/features/notifications/useNotifications";

import { Card, CardContent } from "@repo/ui/components/ui/card";

import { Separator } from "@repo/ui/components/ui/separator";

import { Badge } from "@repo/ui/components/ui/badge";

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();

  const notifications = data ?? [];

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Notifications</h1>

        <p className="text-muted-foreground">Manage all your notifications</p>
      </div>

      <div className="flex gap-2">
        <Badge>{notifications.length} notifications</Badge>

        <Badge variant="secondary">{unreadCount} unread</Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <div className="p-5 text-sm text-muted-foreground">Loading...</div>
          )}

          {!isLoading &&
            notifications.map((notification, index) => (
              <div key={notification.id}>
                <div className="flex flex-col gap-2 p-5 hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{notification.title}</h3>

                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>

                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {notification.description}
                  </p>
                </div>

                {index !== notifications.length - 1 && <Separator />}
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
