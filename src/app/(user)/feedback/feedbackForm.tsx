"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, Medal } from "lucide-react";
import { saveFeedback } from "@/app/actions/saveFeedback";
import { useSession } from "next-auth/react";

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
          <div className="space-y-2">
            <Label className="text-zinc-400">
              How would you rate your experience?
            </Label>
            <RadioGroup
              value={formData.rating}
              onValueChange={(value) =>
                setFormData({ ...formData, rating: value })
              }
              className="flex flex-wrap gap-4"
              disabled={isSubmitting}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="excellent"
                  id="excellent"
                  className="border-zinc-800/50 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <Label
                  htmlFor="excellent"
                  className="text-zinc-400"
                >
                  Excellent
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="good"
                  id="good"
                  className="border-zinc-800/50 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <Label
                  htmlFor="good"
                  className="text-zinc-400"
                >
                  Good
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="average"
                  id="average"
                  className="border-zinc-800/50 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <Label
                  htmlFor="average"
                  className="text-zinc-400"
                >
                  Average
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="poor"
                  id="poor"
                  className="border-zinc-800/50 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <Label
                  htmlFor="poor"
                  className="text-zinc-400"
                >
                  Poor
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="feedback"
              className="text-zinc-400"
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
              className="min-h-[150px] bg-zinc-900/50 border-zinc-800/50 focus:border-orange-500/50"
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            size={"lg"}
            className="mt-4 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </div>

      {/* Диалог благодарности остается без изменений */}
      <Dialog
        open={showThankYouDialog}
        onOpenChange={setShowThankYouDialog}
      >
        <DialogContent className="bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 text-white max-w-md rounded-xl">
          <DialogHeader>
            <div className="flex justify-center my-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                <Check className="h-10 w-10 text-white" />
              </div>
            </div>
            <DialogTitle className="text-xl text-center font-bold text-white">
              Thank You for Your Feedback!
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-400 mt-2">
              We appreciate your time and thoughts. As a token of our gratitude,
              we&apos;ve added 2 weeks of premium subscription to your account.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-zinc-800/50 p-4 rounded-lg flex items-center gap-3 my-4">
            <Medal className="h-6 w-6 text-orange-500" />
            <div>
              <p className="text-white font-medium">Premium Benefits Added</p>
              <p className="text-zinc-400 text-sm">
                2 weeks of free premium access
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
              onClick={() => setShowThankYouDialog(false)}
            >
              Continue to Quizzley
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
