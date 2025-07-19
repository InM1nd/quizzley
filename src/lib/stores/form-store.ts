import { create } from "zustand";

interface FormState {
  feedbackForm: {
    rating: string;
    feedback: string;
    isSubmitting: boolean;
    error: string | null;
  };

  updateFeedbackForm: (updates: Partial<FormState["feedbackForm"]>) => void;
  resetFeedbackForm: () => void;
}

export const useFormStore = create<FormState>((set) => ({
  feedbackForm: {
    rating: "",
    feedback: "",
    isSubmitting: false,
    error: null,
  },

  updateFeedbackForm: (updates) =>
    set((state) => ({
      feedbackForm: { ...state.feedbackForm, ...updates },
    })),

  resetFeedbackForm: () =>
    set((state) => ({
      feedbackForm: {
        rating: "",
        feedback: "",
        isSubmitting: false,
        error: null,
      },
    })),
}));
