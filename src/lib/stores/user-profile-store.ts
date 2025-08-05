import { create } from "zustand";

interface UserProfile {
  usageLimits: any;
  subscriptionStatus: any;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  fetchProfile: () => Promise<void>;
  updateUsageLimits: () => void;
  clearProfile: () => void;
}

export const useUserProfileStore = create<UserProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchProfile: async () => {
    const { lastFetched } = get();
    const now = Date.now();

    // Кэшируем на 30 секунд
    if (lastFetched && now - lastFetched < 30000) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        set({ profile: data, lastFetched: now });
      } else {
        set({ error: "Failed to fetch profile" });
      }
    } catch (error) {
      set({ error: "Network error" });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUsageLimits: () => {
    const { profile } = get();
    if (profile) {
      set({
        profile: {
          ...profile,
          usageLimits: {
            ...profile.usageLimits,
            dailyQuizzesCreated: profile.usageLimits.dailyQuizzesCreated + 1,
            quizzesRemaining: Math.max(
              0,
              profile.usageLimits.quizzesRemaining - 1
            ),
            canCreateQuiz: profile.usageLimits.quizzesRemaining > 1,
          },
        },
      });
    }
  },

  clearProfile: () => {
    set({ profile: null, lastFetched: null });
  },
}));
