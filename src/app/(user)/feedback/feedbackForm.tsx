"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { saveFeedback } from "@/app/actions/saveFeedback";
import { useSession } from "next-auth/react";
import { ThankYouDialog } from "@/components/ui/thank-you-dialog";
import { FaSadTear, FaFrown, FaMeh, FaSmile } from "react-icons/fa";

export function FeedbackForm() {
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    rating: "",
    feedback: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYouDialog, setShowThankYouDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.rating) {
      setError("Please select a rating before submitting feedback.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await saveFeedback(formData);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (result.success) {
        setFormData({
          rating: "",
          feedback: "",
        });
        setShowThankYouDialog(true);
      } else {
        setError(
          result.message || "Failed to submit feedback. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-zinc-800 text-center">
        <p className="text-secondary mb-4">
          You need to be logged in to submit feedback.
        </p>
        <Button>Log In</Button>
      </div>
    );
  }

  const ratingOptions = [
    {
      value: "excellent",
      label: "Excellent",
      icon: (
        <FaSmile className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-emerald-400" />
      ),
      color: "text-emerald-400",
      bgGradient: "from-emerald-500/20 to-emerald-600/20",
      borderColor: "border-emerald-500/50",
      glowColor: "shadow-emerald-500/30",
    },
    {
      value: "very-good",
      label: "Very Good",
      icon: (
        <FaSmile className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-400" />
      ),
      color: "text-green-400",
      bgGradient: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/50",
      glowColor: "shadow-green-500/30",
    },
    {
      value: "good",
      label: "Good",
      icon: (
        <FaMeh className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-400" />
      ),
      color: "text-yellow-400",
      bgGradient: "from-yellow-500/20 to-yellow-600/20",
      borderColor: "border-yellow-500/50",
      glowColor: "shadow-yellow-500/30",
    },
    {
      value: "fair",
      label: "Fair",
      icon: (
        <FaFrown className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-orange-400" />
      ),
      color: "text-orange-400",
      bgGradient: "from-orange-500/20 to-orange-600/20",
      borderColor: "border-orange-500/50",
      glowColor: "shadow-orange-500/30",
    },
    {
      value: "poor",
      label: "Poor",
      icon: (
        <FaSadTear className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-400" />
      ),
      color: "text-red-400",
      bgGradient: "from-red-500/20 to-red-600/20",
      borderColor: "border-red-500/50",
      glowColor: "shadow-red-500/30",
    },
  ];

  return (
    <>
      <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-zinc-800">
        <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            Share Your Feedback
          </h2>
          <p className="text-secondary text-sm sm:text-base lg:text-lg">
            Help us improve Quizzley by sharing your thoughts and suggestions
          </p>
          <div className="bg-zinc-800/50 p-3 sm:p-4 rounded-lg">
            <p className="text-white font-medium text-sm sm:text-base">
              Submitting as: {session.user?.name || "User"} (
              {session.user?.email})
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 sm:p-4 rounded-md mb-4 sm:mb-6 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6"
        >
          <div className="space-y-3 sm:space-y-4 mb-6">
            <Label className="text-zinc-300 text-base flex justify-center sm:text-lg font-medium">
              How would you rate your experience?
            </Label>

            {/* Мобильная версия - вертикальный список */}
            <div className="block sm:hidden space-y-3">
              {ratingOptions.map((option) => {
                const isSelected = formData.rating === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, rating: option.value })
                    }
                    disabled={isSubmitting}
                    className={`
                      group relative flex items-center justify-center w-full p-4 
                      bg-zinc-800/40 border-2 border-zinc-700/50 rounded-xl 
                      cursor-pointer transition-all duration-300 ease-out
                      hover:bg-zinc-800/60 hover:border-zinc-600/50
                      ${
                        isSelected
                          ? `bg-gradient-to-r ${option.bgGradient} ${option.borderColor} shadow-lg ${option.glowColor}`
                          : ""
                      }
                    `}
                  >
                    {/* Фоновый градиент для выбранного состояния */}
                    {isSelected && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${option.bgGradient} rounded-xl opacity-20`}
                      />
                    )}

                    {/* Иконка */}
                    <div className="relative z-10 mr-4 flex-shrink-0">
                      {option.icon}
                    </div>

                    {/* Текст */}
                    <span
                      className={`
                      relative z-10 text-lg font-medium transition-all duration-300
                      ${
                        isSelected
                          ? "text-white font-semibold"
                          : "text-secondary group-hover:text-zinc-300"
                      }
                    `}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Планшетная и десктопная версия - сетка */}
            <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
              {ratingOptions.map((option) => {
                const isSelected = formData.rating === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, rating: option.value })
                    }
                    disabled={isSubmitting}
                    className={`
                      group relative flex flex-col items-center justify-center w-full h-20 sm:h-24 p-3 
                      bg-zinc-800/40 border-2 border-zinc-700/50 rounded-xl sm:rounded-2xl 
                      cursor-pointer transition-all duration-500 ease-out
                      hover:bg-zinc-800/60 hover:border-zinc-600/50 hover:scale-105
                      ${
                        isSelected
                          ? `bg-gradient-to-br ${option.bgGradient} ${option.borderColor} shadow-xl ${option.glowColor} scale-110`
                          : ""
                      }
                    `}
                  >
                    {/* Фоновый градиент для выбранного состояния */}
                    {isSelected && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${option.bgGradient} rounded-xl sm:rounded-2xl opacity-20`}
                      />
                    )}

                    {/* Иконка */}
                    <div
                      className={`
                      relative z-10 mb-1 sm:mb-2 transition-all duration-500 ease-out
                      ${
                        isSelected
                          ? "scale-125 drop-shadow-lg"
                          : "group-hover:scale-110"
                      }
                    `}
                    >
                      {option.icon}
                    </div>

                    {/* Текст */}
                    <span
                      className={`
                      relative z-10 text-xs sm:text-sm font-medium text-center leading-tight transition-all duration-300
                      ${
                        isSelected
                          ? "text-white font-semibold"
                          : "text-secondary group-hover:text-zinc-300"
                      }
                    `}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="feedback"
              className="text-zinc-300 text-base flex justify-center sm:text-lg font-medium"
            >
              Your Feedback
            </Label>
            <Textarea
              id="feedback"
              placeholder="Share your thoughts, suggestions, or any issues you encountered..."
              value={formData.feedback}
              onChange={(e) =>
                setFormData({ ...formData, feedback: e.target.value })
              }
              className="min-h-[120px] sm:min-h-[150px] bg-zinc-900/50 border-zinc-800/50 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300 text-sm sm:text-base"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              size={"lg"}
              className="w-full sm:w-auto py-4 sm:py-6 px-6 sm:px-8 rounded-full bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:via-orange-500/90 hover:to-orange-600/90 shadow-xl shadow-primary/25 hover:shadow-primary/40 text-base sm:text-lg font-bold border-0 relative overflow-hidden group"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </form>
      </div>

      <ThankYouDialog
        open={showThankYouDialog}
        onOpenChange={setShowThankYouDialog}
      />
    </>
  );
}
