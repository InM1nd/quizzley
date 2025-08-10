interface RateLimitConfig {
  interval: number;
  uniqueTokenPerInterval: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

class RateLimit {
  private tokens: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async check(identifier: string, limit: number): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.config.interval;

    // Получаем или создаем массив временных меток для идентификатора
    if (!this.tokens.has(identifier)) {
      this.tokens.set(identifier, []);
    }

    const tokens = this.tokens.get(identifier)!;

    // Удаляем устаревшие токены
    const validTokens = tokens.filter((timestamp) => timestamp > windowStart);

    // Проверяем лимит
    if (validTokens.length >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: windowStart + this.config.interval,
      };
    }

    // Добавляем новый токен
    validTokens.push(now);
    this.tokens.set(identifier, validTokens);

    return {
      success: true,
      limit,
      remaining: limit - validTokens.length,
      reset: windowStart + this.config.interval,
    };
  }

  // Очистка устаревших записей
  cleanup() {
    const now = Date.now();
    const windowStart = now - this.config.interval;

    for (const [identifier, tokens] of this.tokens.entries()) {
      const validTokens = tokens.filter((timestamp) => timestamp > windowStart);
      if (validTokens.length === 0) {
        this.tokens.delete(identifier);
      } else {
        this.tokens.set(identifier, validTokens);
      }
    }
  }
}

// Создаем глобальные экземпляры rate limiter'ов
export const apiRateLimit = new RateLimit({
  interval: 60 * 1000, // 1 минута
  uniqueTokenPerInterval: 1000,
});

export const authRateLimit = new RateLimit({
  interval: 60 * 1000, // 1 минута
  uniqueTokenPerInterval: 100,
});

export const quizGenerationRateLimit = new RateLimit({
  interval: 60 * 1000, // 1 минута
  uniqueTokenPerInterval: 500,
});

// Функция для получения идентификатора пользователя
function getIdentifier(request: Request): string {
  // Для API роутов используем IP адрес
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";

  // Для аутентифицированных пользователей добавляем user ID
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    return `${ip}:${authHeader}`;
  }

  return ip;
}

// Функция для проверки rate limit
export async function checkRateLimit(
  request: Request,
  limit: number,
  type: "api" | "auth" | "quiz" = "api"
): Promise<RateLimitResult> {
  const identifier = getIdentifier(request);

  let rateLimiter: RateLimit;
  switch (type) {
    case "auth":
      rateLimiter = authRateLimit;
      break;
    case "quiz":
      rateLimiter = quizGenerationRateLimit;
      break;
    default:
      rateLimiter = apiRateLimit;
  }

  return await rateLimiter.check(identifier, limit);
}

// Периодическая очистка (каждые 5 минут)
if (typeof window === "undefined") {
  setInterval(() => {
    apiRateLimit.cleanup();
    authRateLimit.cleanup();
    quizGenerationRateLimit.cleanup();
  }, 5 * 60 * 1000);
}
