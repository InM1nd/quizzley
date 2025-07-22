"use client";

import UploadDoc from "../UploadDoc";
import { auth, signIn } from "@/auth";
import { getUserSubscription } from "@/app/actions/userSubscription";
import UpgradePlan from "../UpgradePlan";
import { FileText, Brain, Settings, Sparkles } from "lucide-react";
import { useQuizGenerationStore } from "@/lib/stores/quiz-generation-store";
import { QUIZ_OPTIONS, DIFFICULTY_OPTIONS } from "@/constants/quiz-settings";
import { get } from "http";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Page = () => {
  // const session = await auth();
  // const userId = session?.user?.id;

  const questionCount = useQuizGenerationStore((state) => state.questionCount);
  const setQuestionCount = useQuizGenerationStore(
    (state) => state.setQuestionCount
  );
  const selectedQuizOption = useQuizGenerationStore(
    (state) => state.quizOptions
  );
  const setSelectedQuizOption = useQuizGenerationStore(
    (state) => state.setQuizOptions
  );

  const selectedDifficulty = useQuizGenerationStore(
    (state) => state.selectedDifficulty
  );
  const setSelectedDifficulty = useQuizGenerationStore(
    (state) => state.setSelectedDifficulty
  );

  // if (!session) {
  //   signIn();
  //   return;
  // }

  // const subscribed: boolean | null | undefined = await getUserSubscription({
  //   userId: userId!,
  // });

  return (
    <div className="flex flex-col flex-1">
      <main className="py-11 flex flex-col items-center flex-1">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="py-12 text-center text-3xl font-bold text-primary">
            Generate Your Quizz
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Настройки квиза */}
            <div className="relative group">
              <div className="relative bg-zinc-900/50 p-6 rounded-2xl ring-1 ring-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Settings className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-semibold text-white">
                      Quizz Settings
                    </h2>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="flex flex-row gap-10">
                    <RadioGroup
                      value={selectedQuizOption}
                      onValueChange={setSelectedQuizOption}
                    >
                      <h3 className="text-md font-medium text-primary">Type</h3>
                      {QUIZ_OPTIONS.map((option) => (
                        <div
                          className="flex items-center gap-2"
                          key={option.value}
                        >
                          <RadioGroupItem
                            className="rounded-full border-orange-600"
                            value={option.value}
                            id={option.value}
                          />
                          <label
                            htmlFor={option.value}
                            className="text-gray-400"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>

                    <RadioGroup
                      value={selectedDifficulty}
                      onValueChange={setSelectedDifficulty}
                    >
                      <h3 className="text-md font-medium text-primary">
                        Difficulty
                      </h3>
                      {DIFFICULTY_OPTIONS.map((option) => (
                        <div
                          className="flex items-center gap-2"
                          key={option.value}
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                          />
                          <label
                            htmlFor={option.value}
                            className="text-gray-400 cursor-pointer"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span className="text-gray-400 font-semibold">
                        Number of Questions - {questionCount}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <p className="text-gray-400">5</p>
                      <p className="text-gray-400">30</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Шаги */}
            <div className="bg-zinc-900/50 p-6 rounded-2xl backdrop-blur-sm ring-1 ring-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-white">
                  How It Works
                </h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <p className="text-gray-400">
                    Upload your document (only PDF is supported)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <p className="text-gray-400">Our AI analyzes the content</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <p className="text-gray-400">Get your personalized quiz</p>
                </div>
              </div>
            </div>

            {/* Основная зона загрузки */}
            <div className="col-span-1 md:col-span-2 bg-zinc-900/50 p-6 rounded-2xl backdrop-blur-sm ring-1 ring-white/10">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-white">
                  Upload Your Document
                </h2>
              </div>
              {/* {subscribed ? ( */}
              <UploadDoc />
              {/* ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-6">
                    Upgrade your plan to unlock advanced quiz features and
                    create personalized quizzes from your documents
                  </p>
                  <UpgradePlan />
                </div>
              )} */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
