import { NotificationStatus } from "./database.types";

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  content: string;
  payload?: Record<string, any>;
  status: NotificationStatus;
  seen_at?: string;
  created_at: string;
}
