"use client";

import UploadDoc from "../UploadDoc";
import {
  FileText,
  Settings,
  Sparkles,
  Crown,
  Lock,
  Zap,
  Upload,
  Target,
  Brain,
  Star,
} from "lucide-react";
import { useQuizGenerationStore } from "@/lib/stores/quiz-generation-store";
import { QUIZ_OPTIONS, DIFFICULTY_OPTIONS } from "@/constants/quiz-settings";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UsageLimitsDisplay } from "@/components/ui/usage-limit-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  isSubscribed: boolean;
  userId: string;
  canAccessSettings: boolean;
}

export default function QuizzGeneratorClient({
  isSubscribed,
  userId,
  canAccessSettings,
}: Props) {
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

  return (
    <div className="flex flex-col flex-1">
      <main className="py-11 flex flex-col items-center flex-1">
        <div className="max-w-5xl mx-auto px-4 w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Generate Your Quiz
            </h1>
            <p className="text-gray-400">
              Create personalized quizzes from your documents
            </p>
          </div>

          {/* Верхняя панель с настройками и информацией */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Настройки квиза */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  Quiz Settings
                  {!canAccessSettings && (
                    <Badge
                      variant="outline"
                      className="ml-auto text-orange-600 border-orange-600"
                    >
                      <Lock className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Тип квиза */}
                <div className="flex flex-row gap-10">
                  <div>
                    <h3 className="text-md font-medium text-primary mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Type
                    </h3>
                    <RadioGroup
                      value={selectedQuizOption}
                      onValueChange={setSelectedQuizOption}
                      disabled={!canAccessSettings}
                    >
                      {QUIZ_OPTIONS.map((option) => (
                        <div
                          className="flex items-center space-x-2 mb-2"
                          key={option.value}
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                            className={`border-orange-600 ${
                              !canAccessSettings
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={!canAccessSettings}
                          />
                          <label
                            htmlFor={option.value}
                            className={`text-sm cursor-pointer ${
                              canAccessSettings
                                ? "text-gray-300"
                                : "text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Сложность */}
                  <div>
                    <h3 className="text-md font-medium text-primary mb-3 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      Difficulty
                    </h3>
                    <RadioGroup
                      value={selectedDifficulty}
                      onValueChange={setSelectedDifficulty}
                      disabled={!canAccessSettings}
                    >
                      {DIFFICULTY_OPTIONS.map((option) => (
                        <div
                          className="flex items-center space-x-2 mb-2"
                          key={option.value}
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                            className={`border-orange-600 ${
                              !canAccessSettings
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={!canAccessSettings}
                          />
                          <label
                            htmlFor={option.value}
                            className={`text-sm cursor-pointer ${
                              canAccessSettings
                                ? "text-gray-300"
                                : "text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                {/* Количество вопросов */}
                <div>
                  <h3 className="text-md font-medium text-primary mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Questions: {questionCount}
                  </h3>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    disabled={!canAccessSettings}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer slider ${
                      canAccessSettings
                        ? "bg-zinc-800"
                        : "bg-zinc-700 opacity-50 cursor-not-allowed"
                    }`}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5</span>
                    <span>30</span>
                  </div>
                </div>

                {/* Сообщение о блокировке */}
                {!canAccessSettings && (
                  <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-400 text-sm">
                      <Lock className="h-4 w-4" />
                      <span>
                        Upgrade to premium to customize these settings
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Как это работает */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">
                        Upload Document
                      </h4>
                      <p className="text-sm text-gray-400">
                        Upload your PDF document. We support files up to 10MB in
                        size.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">
                        AI Analysis
                      </h4>
                      <p className="text-sm text-gray-400">
                        Our advanced AI analyzes the content and extracts key
                        information.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white mb-1">
                        Generate Quiz
                      </h4>
                      <p className="text-sm text-gray-400">
                        Get your personalized quiz with questions and detailed
                        explanations.
                      </p>
                    </div>
                  </div>

                  {/* Дополнительная информация */}
                  {/* <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-2">
                      Features
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Multiple question types</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Instant generation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Detailed explanations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Progress tracking</span>
                      </div>
                    </div>
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Основная область загрузки с встроенными лимитами */}
          <div>
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="pb-6">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <CardTitle className="flex items-center gap-3 text-white">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      Upload Your Document
                    </CardTitle>
                    <p className="text-gray-400 text-sm">
                      Drag and drop your PDF or click to browse files
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <UploadDoc />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}