import { create } from "zustand";
import type { NotificationMessage } from "@repo/types"; // Import type NotificationMessage của bạn

interface NotificationState {
  notifications: NotificationMessage[];
  unreadCount: number;
  addNotification: (notification: NotificationMessage) => void;
  clearNotifications: () => void;
  resetUnreadCount: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) =>
    set((state) => ({
      // Đẩy thông báo mới lên đầu danh sách
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

  resetUnreadCount: () => set({ unreadCount: 0 }),
}));
