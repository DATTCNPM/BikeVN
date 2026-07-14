import { useQuery } from "@tanstack/react-query";

import { notificationApi } from "@repo/api";

import { notificationKeys } from "./notificationKeys";

export const useNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.lists(),

    queryFn: async () => {
      return notificationApi.getNotifications();
    },
  });
};
