export const notificationKeys = {
  all: ["notifications"] as const,

  lists: () => [...notificationKeys.all, "list"] as const,

  unread: () => [...notificationKeys.all, "unread"] as const,
};
