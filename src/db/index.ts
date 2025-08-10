import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/postgres";

// Настройка пула соединений для Supabase Free Plan
const client = postgres(connectionString, {
  max: 3, // Максимум 3 соединения (оставляем 1 в резерве)
  idle_timeout: 20, // Закрываем неиспользуемые соединения через 20 секунд
  connect_timeout: 10, // Таймаут подключения 10 секунд
  max_lifetime: 60 * 30, // Максимальное время жизни соединения 30 минут
  prepare: false, // Отключаем prepared statements для лучшей совместимости
});

export const db = drizzle(client, { schema });
