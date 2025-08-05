import { Metadata } from "next";
import { getQuizzByIdForUser } from "@/lib/quizz";
import { notFound, redirect } from "next/navigation";
import QuizzQuestions from "../QuizzQuestions";
import { Loader2 } from "lucide-react";
import { auth } from "@/auth";

export async function generateMetadata({
  params,
}: {
  params: { quizzId: string };
}): Promise<Metadata> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      title: "Access Denied",
    };
  }

  const quizz = await getQuizzByIdForUser(params.quizzId, userId);
  if (!quizz) {
    return {
      title: "Quizz not found",
    };
  }

  if (quizz.status === "processing") {
    return {
      title: "Quiz is being processed",
      description: "Your quiz is currently being generated. Please wait.",
    };
  }

  return {
    title: quizz.name || "Quizz",
    description: quizz.description || "Quizz description",
  };
}

export default async function QuizzPage({
  params,
}: {
  params: { quizzId: string };
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/api/auth/signin");
  }

  const quizz = await getQuizzByIdForUser(params.quizzId, userId);

  if (!quizz) {
    notFound();
  }

  // Если квиз в процессе создания, показываем страницу загрузки
  if (quizz.status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-semibold text-center">
          Your quiz is being generated
        </h2>
        <p className="text-muted-foreground text-center mt-2 max-w-md">
          This process may take a minute or two. Please wait or refresh this
          page to check the status.
        </p>
      </div>
    );
  }

  // Если статус ошибки, перенаправляем на страницу создания квиза
  if (quizz.status === "error") {
    redirect("/quizz");
  }

  return <QuizzQuestions quizz={quizz as any} />;
}
