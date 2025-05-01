"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ProgressBar from "@/components/progressBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const loadingMessages = [
  "Conjuring questions...",
  "Analyzing document...",
  "Crafting the quiz...",
  "Selecting the best questions...",
  "Almost there...",
  "Finalizing your quiz...",
];

const UploadDoc = () => {
  const [document, setDocument] = useState<Blob | File | null | undefined>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      // Плавно увеличиваем прогресс до 95% (оставляем 5% для финального завершения)
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          // Увеличиваем медленнее по мере приближения к 95%
          const increment = Math.max(0.5, (95 - prevProgress) / 20);
          return prevProgress + increment;
        });
      }, 300);

      // Меняем сообщения с определенными интервалами
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          // Если достигли последнего сообщения, останавливаем таймер
          if (nextIndex >= loadingMessages.length - 1) {
            clearInterval(messageInterval);
          }
          return nextIndex < loadingMessages.length ? nextIndex : prevIndex;
        });
      }, 3000); // Меняем сообщение каждые 3 секунды

      return () => {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      };
    } else {
      // Сбрасываем состояния при завершении загрузки
      setProgress(0);
      setCurrentMessageIndex(0);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!document) {
      setError("Please upload the document first");
      return;
    }
    setIsLoading(true);
    setProgress(5); // Начинаем с 5% прогресса

    const formData = new FormData();
    formData.append("pdf", document as Blob);
    formData.append("questionCount", questionCount.toString());

    try {
      const res = await fetch("/api/quizz/generate", {
        method: "POST",
        body: formData,
      });

      if (res.status === 202) {
        setProgress(30); // API принял заявку
        const data = await res.json();
        const quizzId = data.quizzId;

        // Начинаем опрос статуса квиза
        let isCompleted = false;
        let attempts = 0;
        const maxAttempts = 60; // 5 минут при интервале 5 секунд

        while (!isCompleted && attempts < maxAttempts) {
          attempts++;
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Опрашиваем каждые 5 секунд

          const statusRes = await fetch(`/api/quizz/${quizzId}/status`);
          if (statusRes.status === 200) {
            const statusData = await statusRes.json();

            // Обновляем прогресс от 30% до 90% по мере выполнения
            setProgress(30 + Math.min(60, attempts * 2));

            if (statusData.status === "completed") {
              isCompleted = true;
              setProgress(100);

              // Дополнительная проверка наличия вопросов перед переходом
              let hasQuestions = false;
              let checkAttempts = 0;

              while (!hasQuestions && checkAttempts < 3) {
                // Небольшая задержка между проверками
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

              // Увеличиваем задержку перед переходом, чтобы данные успели полностью сохраниться
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
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex flex-col items-center space-y-4 p-6">
          <ProgressBar value={progress} />
          <div className="text-center">
            <p className="text-lg font-medium min-h-[28px] text-primary">
              {loadingMessages[currentMessageIndex]}
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
          <label
            htmlFor="document"
            className="bg-secondary w-full flex h-20 rounded-md border-2 border-dashed border-gray-600 relative"
          >
            <div className="absolute inset-0 m-auto flex justify-center items-center">
              {document && document instanceof File
                ? document.name
                : "Drag your file"}
            </div>
            <input
              type="file"
              id="document"
              className="relative block w-full h-full z-50 opacity-0"
              onChange={(e) => setDocument(e?.target?.files?.[0])}
            />
          </label>
          {error ? <p className="text-red-600 mt-2">{error}</p> : null}
          <Button
            size={"lg"}
            className="mt-4"
            type="submit"
          >
            Generate Quizz
          </Button>
        </form>
      )}
    </div>
  );
};

export default UploadDoc;
