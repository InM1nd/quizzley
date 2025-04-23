"use server";
import { auth } from "@/auth";

export async function getUserSession() {
  return await auth();
}
