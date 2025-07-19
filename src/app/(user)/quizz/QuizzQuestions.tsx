"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progressBar";
import { ChevronLeft, X } from "lucide-react";
import ResultCard from "./ResultCard";
import QuizzSubmission from "./QuizzSubmission";
import { InferSelectModel } from "drizzle-orm";
import {
  questionAnswers,
  questions as DbQuestions,
  quizzes,
} from "@/db/schema";
import { useRouter } from "next/navigation";
import { saveSubmission } from "../../actions/saveSubmissions";

type Answer = InferSelectModel<typeof questionAnswers>;
type Question = InferSelectModel<typeof DbQuestions> & { answers: Answer[] };
type Quizz = InferSelectModel<typeof quizzes> & { questions: Question[] };

type Props = {
  quizz: Quizz;
};

export default function QuizzQuestions(props: Props) {
  const { questions } = props.quizz;
  const router = useRouter();
  const [started, setStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<
    {
      questionId: number;
      answerId: number;
    }[]
  >([]);

  const currentQuestionNumber = currentQuestion + 1;

  const handleNext = () => {
    if (!started) {
      setStarted(true);
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setSubmitted(true);
      return;
    }
  };

  const handlePressPrev = () => {
    if (currentQuestion > 0 && started) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleAnswer = (answer: Answer, questionId: number) => {
    const newUserAnswersArr = [
      ...userAnswers,
      { answerId: answer.id, questionId },
    ];
    setUserAnswers(newUserAnswersArr);
    const isCurrentCorrect = answer.isCorrect;
    if (isCurrentCorrect) {
      setScore(score + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const subId = await saveSubmission({ score }, props.quizz.id);
    } catch (e) {
      console.log(e);
    }
    setSubmitted(true);
  };

  const handleExit = () => {
    router.push("/dashboard");
  };

  const scorePercentage: number = Math.round((score / questions.length) * 100);
  const selectedAnswer: number | null | undefined = userAnswers.find(
    (item) => item.questionId === questions[currentQuestion].id
  )?.answerId;
  const isCorrect: boolean | null | undefined = questions[
    currentQuestion
  ].answers.findIndex((answer) => answer.id === selectedAnswer)
    ? questions[currentQuestion].answers.find(
        (answer) => answer.id === selectedAnswer
      )?.isCorrect
    : null;

  if (submitted) {
    return (
      <QuizzSubmission
        score={score}
        scorePercentage={scorePercentage}
        totalQuestions={questions.length}
      />
    );
  }
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="flex flex-col flex-1">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-zinc-900/80 to-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 mb-6">
          <header className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between p-4 gap-4">
            <Button
              size={"icon"}
              variant={"default"}
              onClick={handlePressPrev}
              disabled={currentQuestion === 0 || !started}
              className="border-zinc-800 hover:bg-orange-500/10 hover:text-orange-500"
            >
              <ChevronLeft />
            </Button>
            <ProgressBar value={(currentQuestion / questions.length) * 100} />
            {started && (
              <div className="text-sm text-zinc-400 font-medium">
                {currentQuestionNumber} / {questions.length}
              </div>
            )}
            <Button
              size={"icon"}
              variant={"default"}
              onClick={handleExit}
              className="border-zinc-800 hover:bg-orange-500/10 hover:text-orange-500"
            >
              <X />
            </Button>
          </header>
        </div>
        <main className="flex justify-center flex-1 mb-6">
          {!started ? (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-zinc-900/80 to-zinc-900/60 p-8 backdrop-blur-sm border border-zinc-800/50 text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent mb-4">
                Ready to Start?
              </h1>
              <p className="text-zinc-400">
                Click Start to begin your quiz journey
              </p>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-zinc-900/80 to-zinc-900/60 p-8 backdrop-blur-sm border border-zinc-800/50 w-full">
              <h2 className="text-2xl font-bold mb-6 text-white">
                {questions[currentQuestion].questionText}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {questions[currentQuestion].answers.map((answer: Answer) => {
                  const variant =
                    selectedAnswer === answer.id
                      ? answer.isCorrect
                        ? "neoSuccess"
                        : "neoFailed"
                      : "neoOutline";
                  return (
                    <Button
                      key={answer.id}
                      disabled={!!selectedAnswer}
                      variant={variant}
                      size={"xl"}
                      onClick={() =>
                        handleAnswer(answer, questions[currentQuestion].id)
                      }
                      className="disabled:opacity-100 hover:bg-orange-500/10 transition-all duration-300 border-zinc-800/50"
                    >
                      <p className="whitespace-normal">{answer.answerText}</p>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </main>
        <footer className="relative overflow-hidden rounded-xl bg-gradient-to-b from-zinc-900/80 to-zinc-900/60 p-6 backdrop-blur-sm border border-zinc-800/50">
          <div className="space-y-4">
            <ResultCard
              isCorrect={isCorrect}
              correctAnswer={
                questions[currentQuestion].answers.find(
                  (answer) => answer.isCorrect === true
                )?.answerText || ""
              }
            />
            {currentQuestion === questions.length - 1 ? (
              <Button
                variant={"default"}
                size={"lg"}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button
                variant={"default"}
                size={"lg"}
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              >
                {!started ? "Start Quiz" : "Next Question"}
              </Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
