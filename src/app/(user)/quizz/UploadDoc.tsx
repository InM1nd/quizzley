"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ProgressBar from "@/components/progressBar";
import { useQuizGenerationStore } from "@/lib/stores/quiz-generation-store";
import { Upload } from "lucide-react";
import UpgradePlan from "./UpgradePlan";

// Добавляем интерфейс для лимитов использования
interface UsageLimits {
  canCreateQuiz: boolean;
  dailyQuizzesCreated: number;
  dailyQuizzesLimit: number;
  quizzesRemaining: number;
  isPremium: boolean;
}

const UploadDoc = () => {
  const router = useRouter();
  const quizOptions = useQuizGenerationStore.getState().quizOptions;
  const selectedDifficulty =
    useQuizGenerationStore.getState().selectedDifficulty;

  // Добавляем состояние для лимитов использования
  const [usageLimits, setUsageLimits] = useState<UsageLimits | null>(null);
  const [isLoadingLimits, setIsLoadingLimits] = useState(true);

  const {
    isLoading,
    progress,
    currentMessageIndex,
    error,
    questionCount,
    document,
    quizTitle,
    setQuizTitle,
    setLoading,
    setProgress,
    setError,
    setDocument,
    incrementMessageIndex,
    reset,
    getCurrentMessage,
  } = useQuizGenerationStore();

  // Загружаем лимиты использования при монтировании компонента
  useEffect(() => {
    const fetchUsageLimits = async () => {
      try {
        const response = await fetch("/api/user/usage-limit");
        if (response.ok) {
          const limits = await response.json();
          setUsageLimits(limits);
        } else {
          console.error("Failed to fetch usage limits");
        }
      } catch (error) {
        console.error("Error fetching usage limits:", error);
      } finally {
        setIsLoadingLimits(false);
      }
    };

    fetchUsageLimits();
  }, []);

  useEffect(() => {
    if (isLoading) {
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 95) {
            clearInterval(progressInterval);
            return 95;
          }

          const increment = Math.max(0.5, (95 - prevProgress) / 20);
          return prevProgress + increment;
        });
      }, 300);

      const messageInterval = setInterval(() => {
        incrementMessageIndex();
      }, 3000); // 3 seconds

      return () => {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      };
    } else {
      // Сбрасываем состояния при завершении загрузки
      setProgress(0);
    }
  }, [isLoading, setProgress, incrementMessageIndex]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Проверяем лимиты перед отправкой
    if (usageLimits && !usageLimits.canCreateQuiz) {
      setError(
        "You have reached your daily quiz creation limit. Please upgrade to continue."
      );
      return;
    }

    if (!quizTitle) {
      setError("Please enter the name of your quizz");
      return;
    }

    if (!document) {
      setError("Please upload the document first");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(5); // Start with 5% progress

    const formData = new FormData();
    formData.append("pdf", document as Blob);
    formData.append("questionCount", questionCount.toString());
    formData.append("quizTitle", quizTitle);
    formData.append("quizOptions", quizOptions);
    formData.append("selectedDifficulty", selectedDifficulty);

    try {
      const res = await fetch("/api/quizz/generate", {
        method: "POST",
        body: formData,
      });

      if (res.status === 202) {
        setProgress(30);
        const data = await res.json();
        const quizzId = data.quizzId;

        // Начинаем опрос статуса квиза
        let isCompleted = false;
        let attempts = 0;
        const maxAttempts = 60;

        while (!isCompleted && attempts < maxAttempts) {
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 5000));

          const statusRes = await fetch(`/api/quizz/${quizzId}/status`);
          if (statusRes.status === 200) {
            const statusData = await statusRes.json();

            setProgress(30 + Math.min(60, attempts * 2));

            if (statusData.status === "completed") {
              isCompleted = true;
              setProgress(100);

              let hasQuestions = false;
              let checkAttempts = 0;

              while (!hasQuestions && checkAttempts < 3) {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                try {
                  const quizData = await fetch(`/api/quizz/${quizzId}/details`);
                  if (quizData.ok) {
                    const quiz = await quizData.json();
                    if (quiz.questions && quiz.questions.length > 0) {
                      hasQuestions = true;
                    }
                  }
                } catch (e) {
                  console.log("Error checking quiz questions:", e);
                }

                checkAttempts++;
              }

              setTimeout(() => {
                router.push(`/quizz/${quizzId}`);
              }, 2000);

              console.log("Quizz generated successfully");
              break;
            } else if (statusData.status === "error") {
              throw new Error(statusData.message || "Failed to generate quiz");
            }
          }
        }

        if (!isCompleted) {
          throw new Error(
            "Quiz generation is taking too long. Please try again later."
          );
        }
      } else {
        throw new Error("Failed to start quiz generation");
      }
    } catch (e) {
      console.log("Error while generating", e);
      setError(
        "An error occurred while generating the quiz. Please try again."
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
        reset();
      }, 500);
    }
  };

  // Показываем загрузку лимитов
  if (isLoadingLimits) {
    return (
      <div className="w-full flex justify-center items-center p-6">
        <div className="text-center">
          <p className="text-lg font-medium text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  // Показываем UpgradePlan если пользователь не может создавать квизы
  if (usageLimits && !usageLimits.canCreateQuiz && !usageLimits.isPremium) {
    return <UpgradePlan />;
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex flex-col items-center space-y-4 p-6">
          <ProgressBar value={progress} />
          <div className="text-center">
            <p className="text-lg font-medium min-h-[28px] text-primary">
              {getCurrentMessage()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              This may take a few moments...
            </p>
          </div>
        </div>
      ) : (
        <form
          className="w-full"
          onSubmit={handleSubmit}
        >
          {/* Показываем информацию о лимитах для бесплатных пользователей */}
          {/* {usageLimits && !usageLimits.isPremium && (
            <div className="mb-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <p className="text-sm text-secondary">
                Quizzes created today: {usageLimits.dailyQuizzesCreated}/
                {usageLimits.dailyQuizzesLimit}
                {usageLimits.quizzesRemaining > 0 && (
                  <span className="text-green-400 ml-2">
                    ({usageLimits.quizzesRemaining} remaining)
                  </span>
                )}
              </p>
            </div>
          )} */}

          <label
            className="block text-secondary mb-2 font-medium"
            htmlFor="quizTitle"
          >
            <input
              id="quizTitle"
              type="text"
              className="w-full border rounded-md px-3 py-2 mb-4 text-secondary bg-zinc-900"
              placeholder="Enter the name of your quizz"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
            />
          </label>
          <label
            htmlFor="document"
            className="bg-text-secondary w-full flex h-24 rounded-md border-2 border-dashed border-orange-700 relative cursor-pointer"
          >
            <div className="absolute inset-0 m-auto flex flex-col justify-center items-center gap-2">
              <Upload className="h-6 w-6 text-primary " />
              {document && document instanceof File
                ? document.name
                : "Drag your file"}
            </div>
            <input
              type="file"
              id="document"
              className="relative block w-full h-full z-50 opacity-0"
              onChange={(e) => setDocument(e?.target?.files?.[0] || null)}
            />
          </label>
          {error ? <p className="text-red-600 mt-2">{error}</p> : null}
          <div className="flex justify-center">
            <Button
              size={"lg"}
              className="mt-4 py-6 px-8 rounded-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:via-orange-500/90 hover:to-orange-600/90 shadow-xl shadow-primary/25 hover:shadow-primary/40 text-lg font-bold border-0 relative overflow-hidden group"
              type="submit"
              variant="default"
              disabled={usageLimits ? !usageLimits.canCreateQuiz : false}
            >
              Generate Quizz
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UploadDoc;
