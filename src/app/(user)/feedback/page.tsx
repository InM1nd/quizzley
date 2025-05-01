import { FeedbackForm } from "@/app/(user)/feedback/feedbackForm";

export default function FeedbackPage() {
  return (
    <section className="container mx-auto p-6 space-y-6">
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <FeedbackForm />
      </div>
    </section>
  );
}
