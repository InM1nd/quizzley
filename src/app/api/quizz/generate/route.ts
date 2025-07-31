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
import { logger } from "@/lib/logger"; // 🆕 Импортируем logger
import { getUserSubscription } from "@/app/actions/userSubscription";

export async function POST(req: NextRequest) {
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

  const hasSubscription = await getUserSubscription({ userId });

  if (!hasSubscription) {
    logger.api.error(
      "POST",
      "/api/quizz/generate",
      new Error("User has no active subscription")
    );
    return NextResponse.json(
      {
        error: "Active subscription required",
        message: "Please upgrade your plan to generate quizzes",
      },
      { status: 403 }
    );
  }

  logger.api.request("POST", "/api/quizz/generate", userId);

  const body = await req.formData();
  const quizTitle = (body.get("quizTitle") as string) || "Quiz";
  const document = body.get("pdf");
  const questionCount = parseInt(body.get("questionCount") as string, 10) || 10;
  const quizOptions = body.get("quizOptions") as string;
  const selectedDifficulty = body.get("selectedDifficulty") as string;

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

  try {
    const pdfBlob = document as Blob;

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

    // 🆕 Используем специальный метод для генерации квиза
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
      },
      { status: 202 }
    );
  } catch (e: any) {
    logger.api.error("POST", "/api/quizz/generate", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
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

