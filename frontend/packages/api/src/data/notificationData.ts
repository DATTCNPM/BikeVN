import type { Notification } from "@repo/types";

export const notificationMockData: Notification[] = [
  {
    id: "1",
    title: "Đơn hàng mới",
    description: "Bạn vừa nhận được đơn hàng mới.",
    type: "order",
    isRead: false,
    createdAt: "2026-05-27T10:00:00Z",
    href: "/orders/1",
  },

  {
    id: "2",
    title: "Thanh toán thành công",
    description: "Khách hàng đã thanh toán thành công.",
    type: "payment",
    isRead: false,
    createdAt: "2026-05-27T09:00:00Z",
    href: "/payments/1",
  },

  {
    id: "3",
    title: "Khuyến mãi mới",
    description: "Có chương trình giảm giá mới.",
    type: "promotion",
    isRead: true,
    createdAt: "2026-05-26T08:00:00Z",
  },

  {
    id: "4",
    title: "Cập nhật hệ thống",
    description: "Hệ thống sẽ bảo trì lúc 2 giờ sáng.",
    type: "system",
    isRead: true,
    createdAt: "2026-05-25T12:00:00Z",
  },
];
