import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@repo/ui/components/ui/sonner";
import { usePortalProfile } from "@/features/auth/hooks/usePortalProfile";
import { NotificationWebSocketService } from "@repo/services";

export function useBranchNotifications() {
  const navigate = useNavigate();

  // 1. Lấy thông tin Profile của Employee đang đăng nhập
  const { data: profile } = usePortalProfile();
  const branchId = profile?.branchId;

  useEffect(() => {
    // Chỉ kích hoạt kết nối nếu có branchId
    if (!branchId) return;

    // 2. Khởi tạo Service với key token
    const notificationWS = new NotificationWebSocketService({
      tokenKey: "portal_token",
    });

    // 3. Kích hoạt kết nối
    notificationWS.activate();

    // 4. Subscribe lắng nghe thông báo của chi nhánh
    notificationWS.subscribeToBranch(branchId, (notification) => {
      // Vì hook này chỉ chạy bên Employee, link điều hướng luôn là /employee
      const targetRoute = "/employee/bookings";

      // Hiển thị Toast thông báo
      toast.info(notification.title, {
        description: notification.content,
        duration: 8000,
        action: {
          label: "Xử lý ngay",
          onClick: () => {
            void navigate(targetRoute);
          },
        },
      });

      // Phát âm thanh báo hiệu
      try {
        const audio = new Audio("/sounds/notification.mp3");
        audio.play();
      } catch (e) {
        console.warn("Autoplay block: Sound alert ignored.", e);
      }
    });

    // 5. Cleanup khi logout hoặc unmount
    return () => {
      notificationWS.deactivate();
    };
  }, [branchId, navigate]);
}
