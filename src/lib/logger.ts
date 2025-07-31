type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  userId?: string;
  quizzId?: number;
  action?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;
  private appName: string;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.appName = "Quizzley";
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${
      this.appName
    }] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    if (level === "error") return true; // Ошибки всегда логируем
    return this.isDevelopment; // Остальное только в development
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog("info")) {
      console.log(this.formatMessage("info", message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, context));
    }
  }

  error(message: string, error?: Error | any, context?: LogContext): void {
    const errorMessage = this.isDevelopment
      ? error?.stack || error?.message || "Unknown error"
      : error?.message || "Unknown error";

    const fullContext = { ...context, error: errorMessage };
    console.error(this.formatMessage("error", message, fullContext));
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog("debug")) {
      console.log(this.formatMessage("debug", message, context));
    }
  }

  // Специальные методы для конкретных действий
  quizGeneration = {
    started: (quizzId: number, userId: string) => {
      this.info("Quiz generation started", {
        quizzId,
        userId,
        action: "quiz_generation_start",
      });
    },

    completed: (quizzId: number, questionsCount: number) => {
      this.info("Quiz generation completed", {
        quizzId,
        questionsCount,
        action: "quiz_generation_complete",
      });
    },

    failed: (quizzId: number, error: Error | any) => {
      this.error("Quiz generation failed", error, {
        quizzId,
        action: "quiz_generation_failed",
      });
    },

    pdfProcessed: (quizzId: number, pagesCount: number, textLength: number) => {
      this.info("PDF processed successfully", {
        quizzId,
        pagesCount,
        textLength,
        action: "pdf_processed",
      });
    },

    aiResponseReceived: (quizzId: number, responseLength: number) => {
      this.debug("AI response received", {
        quizzId,
        responseLength,
        action: "ai_response_received",
      });
    },
  };

  // Методы для API запросов
  api = {
    request: (method: string, endpoint: string, userId?: string) => {
      this.info(`API ${method} ${endpoint}`, {
        method,
        endpoint,
        userId,
        action: "api_request",
      });
    },

    response: (
      method: string,
      endpoint: string,
      status: number,
      duration?: number
    ) => {
      this.info(`API ${method} ${endpoint} - ${status}`, {
        method,
        endpoint,
        status,
        duration,
        action: "api_response",
      });
    },

    error: (method: string, endpoint: string, error: Error | any) => {
      this.error(`API ${method} ${endpoint} failed`, error, {
        method,
        endpoint,
        action: "api_error",
      });
    },
  };
}

// Singleton instance
export const logger = new Logger();

// Для обратной совместимости можно экспортировать простые функции
export const log = {
  info: (message: string, data?: any) => logger.info(message, data),
  warn: (message: string, data?: any) => logger.warn(message, data),
  error: (message: string, error?: any) => logger.error(message, error),
  debug: (message: string, data?: any) => logger.debug(message, data),
};
