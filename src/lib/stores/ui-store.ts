import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  isMobile: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMobile: (mobile: boolean) => void;
  closeSidebar: () => void;

  // Responsive helpers
  checkScreenSize: () => void;

  // Scroll lock helpers
  lockScroll: () => void;
  unlockScroll: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  sidebarOpen: false,
  isMobile: false,

  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobile: (mobile) => set({ isMobile: mobile }),
  closeSidebar: () => set({ sidebarOpen: false }),

  // Responsive helpers
  checkScreenSize: () => {
    const isMobileView = window.innerWidth < 1024;
    const currentState = get();

    if (isMobileView !== currentState.isMobile) {
      set({ isMobile: isMobileView });

      if (isMobileView && currentState.sidebarOpen) {
        set({ sidebarOpen: false });
      }
    }
  },

  // Scroll lock helpers
  lockScroll: () => {
    if (typeof document !== "undefined") {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    }
  },

  unlockScroll: () => {
    if (typeof document !== "undefined") {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  },
}));
