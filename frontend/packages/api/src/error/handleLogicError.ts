import { toast } from "@repo/ui/components/ui/sonner";

export function handleLogicError(code: number, message?: string) {
  switch (code) {
    case 1002:
      toast.error("Email đã tồn tại");
      break;

    case 1003:
      toast.error("Tài khoản không tồn tại");
      break;

    case 1004:
      toast.error("Mật khẩu không chính xác");
      break;

    case 1017:
      toast.error("Xe đã được đặt trong khoảng thời gian này");
      break;

    case 1018:
      toast.error("Xe đang được giữ chỗ");
      break;

    case 5050:
      toast.error("Bạn không có quyền thực hiện thao tác này");
      break;

    default:
      toast.error(message || "Đã xảy ra lỗi");
  }
}
