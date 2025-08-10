import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function roundIfNumber(value: string | number | null) {
  if (typeof value === "number") {
    return parseFloat(value.toFixed(2));
  } else if (typeof value === "string") {
    const num = parseFloat(value);
    const rounded = parseFloat(num.toFixed(2));
    return rounded;
  }
  return value;
}

export function convertDateToString(date: Date): string {
  const timestampDate = new Date(date);
  const year = timestampDate.getFullYear();
  const month = timestampDate.getMonth() + 1;
  const day = timestampDate.getDate();

  const formattedDate = `${year}/${month}/${day}`;
  return formattedDate;
}

export const PRICE_ID: string = (() => {
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!priceId) {
    console.warn("⚠️ STRIPE_PRICE_ID не установлен в переменных окружения");
    // Возвращаем оригинальный ID как fallback для разработки
    return "price_1RqzEOBVanHArmp8vNj2sJJg";
  }

  // Валидация формата Stripe Price ID
  if (!priceId.startsWith("price_")) {
    throw new Error(
      '❌ Неверный формат STRIPE_PRICE_ID. Должен начинаться с "price_"'
    );
  }

  return priceId;
})();

