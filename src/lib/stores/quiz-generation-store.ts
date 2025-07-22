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
  quizTitle: string;
  quizOptions: string;
  selectedDifficulty: string;

  document: Blob | File | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setProgress: (progress: number | ((prev: number) => number)) => void;
  setError: (error: string | null) => void;
  setQuestionCount: (count: number) => void;
  setQuizTitle: (title: string) => void;
  setDocument: (doc: Blob | File | null) => void;
  setQuizOptions: (options: string) => void;
  setSelectedDifficulty: (difficulty: string) => void;
  incrementMessageIndex: () => void;

  reset: () => void;

  getCurrentMessage: () => string;
}

export const useQuizGenerationStore = create<QuizGenerationState>(
  (set, get) => ({
    isLoading: false,
    progress: 0,
    currentMessageIndex: 0,
    error: null,
    questionCount: 10,
    quizTitle: "",
    quizOptions: "exam",
    selectedDifficulty: "easy",
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
    setQuizTitle: (title) => set({ quizTitle: title }),
    setQuizOptions: (options) => set({ quizOptions: options }),
    setSelectedDifficulty: (difficulty) =>
      set({ selectedDifficulty: difficulty }),
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
        quizOptions: "exam",
        selectedDifficulty: "easy",
        error: null,
      }),

    getCurrentMessage: () => loadingMessages[get().currentMessageIndex],
  })
);
