import { create } from "zustand";
import { api } from "@/services/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  toggleOpen: () => void;
  close: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isOpen: false,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    const res = await api.get("/users/notifications");
    if (res?.success) {
      set({ notifications: res.data, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    const res = await api.get("/users/notifications/unread-count");
    if (res?.success) {
      set({ unreadCount: res.data.count });
    }
  },

  markRead: async (id: string) => {
    await api.patch(`/users/notifications/${id}/read`);
    set({
      notifications: get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      unreadCount: Math.max(0, get().unreadCount - 1),
    });
  },

  markAllRead: async () => {
    await api.patch("/users/notifications/read-all");
    set({
      notifications: get().notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    });
  },

  toggleOpen: () => {
    const next = !get().isOpen;
    set({ isOpen: next });
    if (next) {
      get().fetchNotifications();
    }
  },

  close: () => set({ isOpen: false }),
}));
