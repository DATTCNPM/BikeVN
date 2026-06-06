import type { Notification } from "@repo/types";

import { notificationMockData } from "../data/notificationData";

export const notificationApi = {
  async getNotifications(): Promise<Notification[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return notificationMockData;
  },

  async getUnreadNotifications(): Promise<Notification[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return notificationMockData.filter((notification) => !notification.isRead);
  },
};
