import { FeedbackForm } from "@/app/(user)/feedback/feedbackForm";

export default function FeedbackPage() {
  return (
    <section className="container mx-auto p-6 space-y-6">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <FeedbackForm />
      </div>
    </section>
  );
}
