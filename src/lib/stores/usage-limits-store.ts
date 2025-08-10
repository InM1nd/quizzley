import { create } from "zustand";

interface UsageLimits {
  canCreateQuiz: boolean;
  dailyQuizzesCreated: number;
  dailyQuizzesLimit: number;
  quizzesRemaining: number;
  isPremium: boolean;
}

interface UsageLimitsState {
  limits: UsageLimits | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setLimits: (limits: UsageLimits) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshLimits: () => Promise<void>;
  updateAfterQuizCreation: () => void;
}

export const useUsageLimitsStore = create<UsageLimitsState>((set, get) => ({
  limits: null,
  isLoading: false,
  error: null,

  setLimits: (limits) => set({ limits, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  refreshLimits: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/user/usage-limit");
      if (response.ok) {
        const data = await response.json();
        set({ limits: data, isLoading: false });
      } else {
        set({ error: "Failed to fetch usage limits", isLoading: false });
      }
    } catch (error) {
      set({ error: "Network error", isLoading: false });
    }
  },

  updateAfterQuizCreation: () => {
    const current = get().limits;
    if (current && !current.isPremium) {
      set({
        limits: {
          ...current,
          dailyQuizzesCreated: current.dailyQuizzesCreated + 1,
          quizzesRemaining: Math.max(0, current.quizzesRemaining - 1),
          canCreateQuiz: current.quizzesRemaining > 1,
        },
      });
    }
  },
}));
