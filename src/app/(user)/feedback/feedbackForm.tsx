"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { saveFeedback } from "@/app/actions/saveFeedback";
import { useSession } from "next-auth/react";
import { ThankYouDialog } from "@/components/ui/thank-you-dialog";

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
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await saveFeedback(formData);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (result.success) {
        // Очистить форму
        setFormData({
          rating: "",
          feedback: "",
        });

        // Показать диалог благодарности
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
      <div className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm border border-zinc-800 text-center">
        <p className="text-zinc-400 mb-4">
          You need to be logged in to submit feedback.
        </p>
        <Button>Log In</Button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm border border-zinc-800">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            Share Your Feedback
          </h2>
          <p className="text-zinc-400 text-lg">
            Help us improve Quizzley by sharing your thoughts and suggestions
          </p>
          <div className="bg-zinc-800/50 p-4 rounded-lg">
            <p className="text-white font-medium">
              Submitting as: {session.user?.name || "User"} (
              {session.user?.email})
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-4">
            <Label className="text-zinc-300 text-lg font-medium">
              How would you rate your experience?
            </Label>
            <RadioGroup
              value={formData.rating}
              onValueChange={(value) =>
                setFormData({ ...formData, rating: value })
              }
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              disabled={isSubmitting}
            >
              <div className="relative">
                <RadioGroupItem
                  value="excellent"
                  id="excellent"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="excellent"
                  className="flex flex-col items-center justify-center w-full h-20 p-4 text-zinc-400 bg-zinc-800/30 border-2 border-zinc-700 rounded-xl cursor-pointer hover:bg-zinc-800/50 hover:border-orange-500/50 transition-all duration-300 peer-checked:bg-gradient-to-br peer-checked:from-orange-500/20 peer-checked:to-orange-600/20 peer-checked:border-orange-500 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-orange-500/25"
                >
                  <div className="text-2xl mb-1">⭐</div>
                  <span className="text-sm font-medium">Excellent</span>
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem
                  value="good"
                  id="good"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="good"
                  className="flex flex-col items-center justify-center w-full h-20 p-4 text-zinc-400 bg-zinc-800/30 border-2 border-zinc-700 rounded-xl cursor-pointer hover:bg-zinc-800/50 hover:border-orange-500/50 transition-all duration-300 peer-checked:bg-gradient-to-br peer-checked:from-orange-500/20 peer-checked:to-orange-600/20 peer-checked:border-orange-500 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-orange-500/25"
                >
                  <div className="text-2xl mb-1">👍</div>
                  <span className="text-sm font-medium">Good</span>
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem
                  value="average"
                  id="average"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="average"
                  className="flex flex-col items-center justify-center w-full h-20 p-4 text-zinc-400 bg-zinc-800/30 border-2 border-zinc-700 rounded-xl cursor-pointer hover:bg-zinc-800/50 hover:border-orange-500/50 transition-all duration-300 peer-checked:bg-gradient-to-br peer-checked:from-orange-500/20 peer-checked:to-orange-600/20 peer-checked:border-orange-500 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-orange-500/25"
                >
                  <div className="text-2xl mb-1">😐</div>
                  <span className="text-sm font-medium">Average</span>
                </Label>
              </div>

              <div className="relative">
                <RadioGroupItem
                  value="poor"
                  id="poor"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="poor"
                  className="flex flex-col items-center justify-center w-full h-20 p-4 text-zinc-400 bg-zinc-800/30 border-2 border-zinc-700 rounded-xl cursor-pointer hover:bg-zinc-800/50 hover:border-orange-500/50 transition-all duration-300 peer-checked:bg-gradient-to-br peer-checked:from-orange-500/20 peer-checked:to-orange-600/20 peer-checked:border-orange-500 peer-checked:text-white peer-checked:shadow-lg peer-checked:shadow-orange-500/25"
                >
                  <div className="text-2xl mb-1">👎</div>
                  <span className="text-sm font-medium">Poor</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="feedback"
              className="text-zinc-300 text-lg font-medium"
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
              required
              className="min-h-[150px] bg-zinc-900/50 border-zinc-800/50 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all duration-300"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            size={"lg"}
            className="mt-6 w-full bg-gradient-to-r from-primary to-orange-500 hover:from-orange-500 hover:to-primary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </div>

      {/* Используем вынесенный компонент диалога */}
      <ThankYouDialog
        open={showThankYouDialog}
        onOpenChange={setShowThankYouDialog}
      />
    </>
  );
}
