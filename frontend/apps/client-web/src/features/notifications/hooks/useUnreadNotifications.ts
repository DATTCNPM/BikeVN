import { useQuery } from "@tanstack/react-query";

import { notificationApi } from "@repo/api";

import { notificationKeys } from "./notificationKeys";

export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.unread(),

    queryFn: async () => {
      return notificationApi.getUnreadNotifications();
    },
  });
};
