import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tool, HistoryItem, Settings, Notification } from '@/types';

interface AppState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Tools
  tools: Tool[];
  setTools: (tools: Tool[]) => void;
  currentTool: Tool | null;
  setCurrentTool: (tool: Tool | null) => void;
  
  // History
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
  
  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Tool[];
  setSearchResults: (results: Tool[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      // Tools
      tools: [],
      setTools: (tools) => set({ tools }),
      currentTool: null,
      setCurrentTool: (tool) => set({ currentTool: tool }),
      
      // History
      history: [],
      addToHistory: (item) => {
        const newItem: HistoryItem = {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          history: [newItem, ...state.history].slice(0, 100), // Keep only last 100 items
        }));
      },
      clearHistory: () => set({ history: [] }),
      removeFromHistory: (id) => {
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        }));
      },
      
      // Settings
      settings: {
        theme: { mode: 'system' },
        language: 'zh-CN',
        autoSave: true,
        notifications: true,
      },
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      
      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));
        
        // Auto remove after duration
        if (notification.duration && notification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(newNotification.id);
          }, notification.duration);
        }
      },
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      clearNotifications: () => set({ notifications: [] }),
      
      // UI State
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      loading: false,
      setLoading: (loading) => set({ loading }),
      
      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      searchResults: [],
      setSearchResults: (results) => set({ searchResults: results }),
    }),
    {
      name: 'tion-work-storage',
      partialize: (state) => ({
        theme: state.theme,
        history: state.history,
        settings: state.settings,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// Selectors
export const useTheme = () => useAppStore((state) => state.theme);
export const useSetTheme = () => useAppStore((state) => state.setTheme);

export const useTools = () => useAppStore((state) => state.tools);
export const useSetTools = () => useAppStore((state) => state.setTools);
export const useCurrentTool = () => useAppStore((state) => state.currentTool);
export const useSetCurrentTool = () => useAppStore((state) => state.setCurrentTool);

export const useHistory = () => useAppStore((state) => state.history);
export const useAddToHistory = () => useAppStore((state) => state.addToHistory);
export const useClearHistory = () => useAppStore((state) => state.clearHistory);
export const useRemoveFromHistory = () => useAppStore((state) => state.removeFromHistory);

export const useSettings = () => useAppStore((state) => state.settings);
export const useUpdateSettings = () => useAppStore((state) => state.updateSettings);

export const useNotifications = () => useAppStore((state) => state.notifications);
export const useAddNotification = () => useAppStore((state) => state.addNotification);
export const useRemoveNotification = () => useAppStore((state) => state.removeNotification);
export const useClearNotifications = () => useAppStore((state) => state.clearNotifications);

export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useSetSidebarOpen = () => useAppStore((state) => state.setSidebarOpen);
export const useLoading = () => useAppStore((state) => state.loading);
export const useSetLoading = () => useAppStore((state) => state.setLoading);

export const useSearchQuery = () => useAppStore((state) => state.searchQuery);
export const useSetSearchQuery = () => useAppStore((state) => state.setSearchQuery);
export const useSearchResults = () => useAppStore((state) => state.searchResults);
export const useSetSearchResults = () => useAppStore((state) => state.setSearchResults);
