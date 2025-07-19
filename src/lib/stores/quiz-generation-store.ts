import { create } from "zustand";

const loadingMessages = [
  "Conjuring questions...",
  "Analyzing document...",
  "Crafting the quiz...",
  "Selecting the best questions...",
  "Almost there...",
  "Finalizing your quiz...",
];

interface QuizGenerationState {
  isLoading: boolean;
  progress: number;
  currentMessageIndex: number;
  error: string | null;

  questionCount: number;

  document: Blob | File | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setProgress: (progress: number | ((prev: number) => number)) => void;
  setError: (error: string | null) => void;
  setQuestionCount: (count: number) => void;
  setDocument: (doc: Blob | File | null) => void;
  incrementMessageIndex: () => void;
  reset: () => void;

  currentMessage: string;
}

export const useQuizGenerationStore = create<QuizGenerationState>(
  (set, get) => ({
    isLoading: false,
    progress: 0,
    currentMessageIndex: 0,
    error: null,
    questionCount: 10,
    document: null,

    // Actions
    setLoading: (loading) => set({ isLoading: loading }),
    setProgress: (progress) =>
      set((state) => ({
        progress:
          typeof progress === "function" ? progress(state.progress) : progress,
      })),
    setError: (error) => set({ error }),
    setQuestionCount: (count) => set({ questionCount: count }),
    setDocument: (doc) => set({ document: doc }),
    incrementMessageIndex: () =>
      set((state) => ({
        currentMessageIndex: Math.min(
          state.currentMessageIndex + 1,
          loadingMessages.length - 1
        ),
      })),
    reset: () =>
      set({
        isLoading: false,
        progress: 0,
        currentMessageIndex: 0,
        error: null,
      }),

    get currentMessage() {
      return loadingMessages[get().currentMessageIndex];
    },
  })
);
