import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@repo/ui/components/ui/sonner";
import { usePortalProfile } from "@/features/auth/hooks/usePortalProfile";
import { NotificationWebSocketService } from "@repo/services";
import { useNotificationStore } from "./useNotificationStore";
import notificationSound from "@/assets/music/notification.mp3";

// 🌟 ĐƯA KHỞI TẠO RA NGOÀI HOOK (Singleton Pattern)
const notificationWS = new NotificationWebSocketService({
  tokenKey: "portal_token",
});

export function useBranchNotifications() {
  const navigate = useNavigate();
  const { data: profile } = usePortalProfile();
  const branchId = profile?.branchId;
  const addNotification = useNotificationStore(
    (state) => state.addNotification,
  );

  useEffect(() => {
    if (!branchId) return;

    // Kích hoạt kết nối đến backend
    notificationWS.activate();

    // Đăng ký nhận tin nhắn của chi nhánh
    notificationWS.subscribeToBranch(branchId, (notification) => {
      // 1. Lưu thông báo vào Zustand Store
      addNotification(notification);

      // 2. Hiển thị Toast
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

      // 3. Phát âm thanh
      try {
        const audio = new Audio(notificationSound);
        audio.play();
      } catch (e) {
        console.warn("Autoplay block: Sound alert ignored.", e);
      }
    });

    return () => {
      // Chỉ hủy đăng ký kênh branch đó, không ngắt hẳn Client
      // để tránh việc chuyển trang làm mất kết nối socket
      notificationWS.unsubscribeBranch();
    };
  }, [branchId, navigate, addNotification]);
}
