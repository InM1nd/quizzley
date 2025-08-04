import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { db } from "@/db";
import { quizzes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { QUIZ_OPTIONS, DIFFICULTY_OPTIONS } from "@/constants/quiz-settings";
import {
  createQuizGenerationPrompt,
  ERROR_MESSAGES,
} from "@/constants/quiz-prompts";
import { logger } from "@/lib/logger";
import { getUserSubscription } from "@/app/actions/userSubscription";
import {
  checkQuizCreationLimit,
  incrementDailyQuizCount,
} from "@/lib/usage-limits";
import { checkRateLimit } from "@/lib/rate-limit";

// Константы для валидации
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ["application/pdf"];
const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 50;

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, 5, "quiz"); // 5 запросов в минуту
    if (!rateLimitResult.success) {
      logger.api.error(
        "POST",
        "/api/quizz/generate",
        new Error("Rate limit exceeded")
      );
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (rateLimitResult.reset - Date.now()) / 1000
            ).toString(),
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          },
        }
      );
    }

    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      logger.api.error(
        "POST",
        "/api/quizz/generate",
        new Error("User not authenticated")
      );
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const usageLimits = await checkQuizCreationLimit(userId);

    if (!usageLimits.canCreateQuiz) {
      logger.api.error(
        "POST",
        "/api/quizz/generate",
        new Error("Daily quiz creation limit exceeded")
      );
      return NextResponse.json(
        {
          error: "Daily limit exceeded",
          message: `You can create up to ${usageLimits.dailyQuizzesLimit} quizzes per day. Please upgrade to premium for unlimited quizzes.`,
          usageLimits,
        },
        { status: 429 }
      );
    }

    logger.api.request("POST", "/api/quizz/generate", userId);

    const body = await req.formData();

    // Валидация и sanitization входных данных
    const quizTitle = sanitizeInput(body.get("quizTitle") as string) || "Quiz";
    const document = body.get("pdf");
    const questionCountRaw = body.get("questionCount") as string;
    const quizOptions = sanitizeInput(body.get("quizOptions") as string);
    const selectedDifficulty = sanitizeInput(
      body.get("selectedDifficulty") as string
    );

    // Валидация количества вопросов
    const questionCount = parseInt(questionCountRaw, 10);
    if (
      isNaN(questionCount) ||
      questionCount < MIN_QUESTIONS ||
      questionCount > MAX_QUESTIONS
    ) {
      logger.api.error(
        "POST",
        "/api/quizz/generate",
        new Error(`Invalid question count: ${questionCountRaw}`)
      );
      return NextResponse.json(
        {
          error: `Question count must be between ${MIN_QUESTIONS} and ${MAX_QUESTIONS}`,
        },
        { status: 400 }
      );
    }

    // Валидация файла
    if (!document) {
      logger.api.error(
        "POST",
        "/api/quizz/generate",
        new Error("No PDF file provided")
      );
      return NextResponse.json(
        { error: "No PDF file provided" },
        { status: 400 }
      );
    }

    const pdfBlob = document as Blob;

    // Валидация типа файла
    if (!ALLOWED_FILE_TYPES.includes(pdfBlob.type)) {
      logger.api.error(
        "POST",
        "/api/quizz/generate",
        new Error(`Invalid file type: ${pdfBlob.type}`)
      );
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Валидация размера файла
    if (pdfBlob.size > MAX_PDF_SIZE) {
      logger.api.error(
        "POST",
        "/api/quizz/generate",
        new Error(`File too large: ${pdfBlob.size} bytes`)
      );
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${
            MAX_PDF_SIZE / (1024 * 1024)
          }MB`,
        },
        { status: 400 }
      );
    }

    // Валидация названия квиза
    if (quizTitle.length > 100) {
      logger.api.error(
        "POST",
        "/api/quizz/generate",
        new Error("Quiz title too long")
      );
      return NextResponse.json(
        { error: "Quiz title must be less than 100 characters" },
        { status: 400 }
      );
    }

    const newQuizz = await db
      .insert(quizzes)
      .values({
        name: "Quiz being generated...",
        description:
          "Your quiz is currently being generated and will be ready soon.",
        status: "processing",
        userId: userId,
      })
      .returning({ quizzId: quizzes.id });

    const quizzId = newQuizz[0].quizzId;

    await incrementDailyQuizCount(userId);

    logger.quizGeneration.started(quizzId, userId);

    void generateQuizInBackground(
      pdfBlob,
      questionCount,
      quizzId,
      userId,
      quizTitle,
      quizOptions,
      selectedDifficulty
    );

    logger.api.response("POST", "/api/quizz/generate", 202);

    return NextResponse.json(
      {
        quizzId,
        message: "Quiz generation started",
        usageLimits: {
          ...usageLimits,
          dailyQuizzesCreated: usageLimits.dailyQuizzesCreated + 1,
          quizzesRemaining: usageLimits.quizzesRemaining - 1,
        },
      },
      {
        status: 202,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
        },
      }
    );
  } catch (e: any) {
    logger.api.error("POST", "/api/quizz/generate", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Функция для sanitization входных данных
function sanitizeInput(input: string): string {
  if (!input) return "";

  // Удаляем потенциально опасные символы
  return input
    .replace(/[<>]/g, "") // Удаляем < и >
    .replace(/javascript:/gi, "") // Удаляем javascript: протокол
    .replace(/data:/gi, "") // Удаляем data: протокол
    .replace(/vbscript:/gi, "") // Удаляем vbscript: протокол
    .trim()
    .slice(0, 1000); // Ограничиваем длину
}

async function generateQuizInBackground(
  pdfBlob: Blob,
  questionCount: number,
  quizzId: number,
  userId: string,
  quizTitle: string,
  quizOptions: string,
  selectedDifficulty: string
) {
  try {
    const { ChatGoogleGenerativeAI } = await import("@langchain/google-genai");
    const { HumanMessage } = await import("@langchain/core/messages");
    const { StructuredOutputParser } = await import("langchain/output_parsers");
    const { z } = await import("zod");
    const { default: saveQuizz } = await import("./saveToDb");

    logger.info("Starting background quiz generation", { quizzId, userId });

    const selectedInstructions = quizOptions
      ? QUIZ_OPTIONS.find((q) => q.value === quizOptions)?.instruction || ""
      : "";

    const difficultyInstruction =
      DIFFICULTY_OPTIONS.find((d) => d.value === selectedDifficulty)
        ?.instruction || "";

    const pdfLoader = new PDFLoader(pdfBlob, {
      parsedItemSeparator: "",
    });
    const docs = await pdfLoader.load();

    const texts = docs
      .filter((doc) => doc.pageContent !== undefined)
      .map((doc) => doc.pageContent);

    // 🆕 Используем специальный метод
    logger.quizGeneration.pdfProcessed(
      quizzId,
      texts.length,
      texts.join("").length
    );

    const quizSchema = z.object({
      quizz: z.object({
        name: z.string(),
        description: z.string(),
        questions: z.array(
          z.object({
            questionText: z.string(),
            answers: z.array(
              z.object({
                answerText: z.string(),
                isCorrect: z.boolean(),
              })
            ),
          })
        ),
      }),
    });

    const parser = StructuredOutputParser.fromZodSchema(quizSchema);
    const formatInstructions = parser.getFormatInstructions();

    const prompt = createQuizGenerationPrompt({
      quizTitle,
      questionCount,
      selectedInstructions,
      difficultyInstruction,
      formatInstructions,
      documentText: texts.join("\n"),
    });

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      modelName: "gemini-2.5-pro",
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
    });

    const message = new HumanMessage({
      content: prompt,
    });

    logger.info("Sending request to AI model", { quizzId });
    const result = await model.invoke([message]);

    let contentText: string = "";

    if (typeof result.content === "string") {
      contentText = result.content;
    } else if (Array.isArray(result.content)) {
      contentText = result.content
        .map((item: any) => {
          if (typeof item === "string") {
            return item;
          } else if (item && typeof item === "object") {
            return (
              item.text || item.content || item.message || JSON.stringify(item)
            );
          }
          return String(item);
        })
        .join("");
    } else if (result.content && typeof result.content === "object") {
      const contentObj = result.content as any;
      contentText =
        contentObj.text ||
        contentObj.content ||
        contentObj.message ||
        JSON.stringify(contentObj);
    } else {
      contentText = String(result.content || "");
    }

    // 🆕 Используем специальный метод
    logger.quizGeneration.aiResponseReceived(quizzId, contentText.length);

    if (!contentText || contentText.trim().length === 0) {
      logger.quizGeneration.failed(quizzId, new Error("Empty AI response"));

      await db
        .update(quizzes)
        .set({
          status: "error",
          description: ERROR_MESSAGES.EMPTY_RESPONSE,
        })
        .where(eq(quizzes.id, quizzId));
      return;
    }

    // Clean JSON content
    let jsonContent = contentText.trim();

    if (jsonContent.includes("```json")) {
      const jsonMatch = jsonContent.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1].trim();
      }
    } else if (jsonContent.includes("```")) {
      const codeMatch = jsonContent.match(/```\s*([\s\S]*?)\s*```/);
      if (codeMatch) {
        jsonContent = codeMatch[1].trim();
      }
    }

    if (!jsonContent.startsWith("{")) {
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }
    }

    logger.debug("JSON content cleaned", {
      quizzId,
      contentLength: jsonContent.length,
    });

    try {
      const parsedResult = await parser.parse(jsonContent);

      await saveQuizz({
        ...parsedResult.quizz,
        name: quizTitle,
        id: quizzId,
        status: "completed",
        userId: userId,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 🆕 Используем специальный метод
      logger.quizGeneration.completed(
        quizzId,
        parsedResult.quizz.questions.length
      );
    } catch (parseError) {
      logger.warn("Initial parse failed, attempting fix", { quizzId });

      // Try to fix common JSON issues
      try {
        let fixedContent = jsonContent
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .replace(/^\s*/, "")
          .replace(/\s*$/, "")
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]");

        if (!fixedContent.startsWith("{")) {
          const match = fixedContent.match(/(\{.*\})/);
          if (match) {
            fixedContent = match[1];
          }
        }

        const parsedResult = await parser.parse(fixedContent);

        await saveQuizz({
          ...parsedResult.quizz,
          name: quizTitle,
          id: quizzId,
          status: "completed",
          userId: userId,
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));
        logger.quizGeneration.completed(
          quizzId,
          parsedResult.quizz.questions.length
        );
      } catch (secondParseError) {
        logger.quizGeneration.failed(quizzId, secondParseError);

        await db
          .update(quizzes)
          .set({
            status: "error",
            description: ERROR_MESSAGES.PARSE_ERROR,
          })
          .where(eq(quizzes.id, quizzId));
        return;
      }
    }
  } catch (error) {
    logger.quizGeneration.failed(quizzId, error);

    await db
      .update(quizzes)
      .set({
        status: "error",
        description: ERROR_MESSAGES.GENERATION_ERROR,
      })
      .where(eq(quizzes.id, quizzId));
  }
} 

