import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@repo/ui/components/ui/sonner";
import { usePortalProfile } from "@/features/auth/hooks/usePortalProfile";
import { NotificationWebSocketService } from "@repo/services";
import { useNotificationStore } from "./useNotificationStore"; // Import Store

export function useBranchNotifications() {
  const navigate = useNavigate();
  const { data: profile } = usePortalProfile();
  const branchId = profile?.branchId;
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  useEffect(() => {
    if (!branchId) return;

    const notificationWS = new NotificationWebSocketService({
      tokenKey: "portal_token",
    });

    notificationWS.activate();

    notificationWS.subscribeToBranch(branchId, (notification) => {
      // 1. Lưu thông báo vào Zustand Store để hiển thị ở chuông
      addNotification(notification);

      // 2. Hiển thị Toast thông báo nhanh ngoài màn hình
      toast.info(notification.title, {
        description: notification.content,
        duration: 8000,
        action: {
          label: "Xử lý ngay",
          onClick: () => {
            navigate("/employee/bookings");
          },
        },
      });

      // 3. Phát âm thanh báo hiệu
      try {
        const audio = new Audio("/sounds/notification.mp3");
        audio.play();
      } catch (e) {
        console.warn("Autoplay block: Sound alert ignored.", e);
      }
    });

    return () => {
      notificationWS.deactivate();
    };
  }, [branchId, navigate, addNotification]);
}
