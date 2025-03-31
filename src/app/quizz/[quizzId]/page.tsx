import { Metadata } from "next";
import { getQuizzById } from "@/lib/quizz";
import { notFound } from "next/navigation";
import QuizzQuestions from "../QuizzQuestions";

export async function generateMetadata({
  params,
}: {
  params: { quizzId: string };
}): Promise<Metadata> {
  const quizz = await getQuizzById(params.quizzId);
  if (!quizz) {
    return {
      title: "Quizz not found",
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
  const quizz = await getQuizzById(params.quizzId);
  if (!quizz) {
    notFound();
  }
  return <QuizzQuestions quizz={quizz} />;
}
