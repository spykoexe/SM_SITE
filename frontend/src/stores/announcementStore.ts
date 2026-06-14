import { create } from 'zustand';

interface Announcement {
  id: string;
  message: string;
  duration?: number;
}

interface AnnouncementStore {
  announcements: Announcement[];
  addAnnouncement: (message: string, duration?: number) => void;
  removeAnnouncement: (id: string) => void;
  clearAnnouncements: () => void;
}

export const useAnnouncementStore = create<AnnouncementStore>((set) => ({
  announcements: [],
  addAnnouncement: (message, duration = 10000) => {
    const id = Date.now().toString();
    set((state) => ({
      announcements: [...state.announcements, { id, message, duration }]
    }));
    
    // Auto-remove after duration
    setTimeout(() => {
      set((state) => ({
        announcements: state.announcements.filter((a) => a.id !== id)
      }));
    }, duration);
  },
  removeAnnouncement: (id) => {
    set((state) => ({
      announcements: state.announcements.filter((a) => a.id !== id)
    }));
  },
  clearAnnouncements: () => {
    set({ announcements: [] });
  }
}));
