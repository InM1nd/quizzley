import { FeedbackForm } from "@/app/(user)/feedback/feedbackForm";

export default function FeedbackPage() {
  return (
    <section className="mx-auto space-y-6">
      <div className="mx-auto max-w-4xl">
        <div className="h-10 flex items-center text-center justify-center mb-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary ">
            Feedback
          </h1>
        </div>
        <FeedbackForm />
      </div>
    </section>
  );
}
