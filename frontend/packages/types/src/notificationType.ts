export type NotificationType = "system" | "order" | "payment" | "promotion";

export interface Notification {
  id: string;

  title: string;

  description: string;

  type: NotificationType;

  isRead: boolean;

  createdAt: string;

  href?: string;
}
