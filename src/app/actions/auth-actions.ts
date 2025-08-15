"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function logoutUser() {
  // Очищаем кеш для всех страниц пользователя
  revalidatePath("/dashboard");
  revalidatePath("/quizz");
  revalidatePath("/billing");
  revalidatePath("/flashcards");
  revalidatePath("/podcasts");
  revalidatePath("/feedback");

  await signOut();
  redirect("/");
}
