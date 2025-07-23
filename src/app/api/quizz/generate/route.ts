import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { db } from "@/db";
import { quizzes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { QUIZ_OPTIONS, DIFFICULTY_OPTIONS } from "@/constants/quiz-settings";

// Новый маршрут для инициирования задания
export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const body = await req.formData();
  const quizTitle = (body.get("quizTitle") as string) || "Quiz";
  const document = body.get("pdf");
  const questionCount = parseInt(body.get("questionCount") as string, 10) || 10;
  const quizOptions = body.get("quizOptions") as string;
  const selectedDifficulty = body.get("selectedDifficulty") as string;

  if (!document) {
    return NextResponse.json(
      { error: "No PDF file provided" },
      { status: 400 }
    );
  }

  try {
    // Сохраняем PDF как Blob для дальнейшей обработки
    const pdfBlob = document as Blob;

    // Создаем запись о квизе в статусе "processing"
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

    // Запускаем фоновую задачу
    void generateQuizInBackground(
      pdfBlob,
      questionCount,
      quizzId,
      userId,
      quizTitle,
      quizOptions,
      selectedDifficulty
    );

    // Немедленно возвращаем ID квиза, который находится в обработке
    return NextResponse.json(
      {
        quizzId,
        message: "Quiz generation started",
      },
      { status: 202 }
    );
  } catch (e: any) {
    console.error("Error starting quiz generation:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// Функция для фоновой генерации квиза
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
    // Импортируем необходимые библиотеки динамически,
    // чтобы не загружать их при первоначальном API запросе
    const { ChatGoogleGenerativeAI } = await import("@langchain/google-genai");
    const { HumanMessage } = await import("@langchain/core/messages");
    const { StructuredOutputParser } = await import("langchain/output_parsers");
    const { z } = await import("zod");
    const { default: saveQuizz } = await import("./saveToDb");

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

    // Определяем схему для парсинга
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

    // Создаем парсер
    const parser = StructuredOutputParser.fromZodSchema(quizSchema);

    // Получаем формат для промпта
    const formatInstructions = parser.getFormatInstructions();

    // Формируем промпт с инструкциями по формату
    const prompt = `
      You are a professional quiz designer. Your task is to create a well-structured, high-quality quiz strictly based on the provided document text.

      CRITICAL REQUIREMENTS:
      - The quiz title must be: "${quizTitle}".
      - Generate EXACTLY ${questionCount} questions. No more, no less.
      - Each question must have exactly 4 answer options (A, B, C, D).
      - Only ONE correct answer per question. Clearly indicate the correct answer.
      - All questions and answers must be based EXCLUSIVELY on the provided text. Do NOT use outside knowledge or assumptions.
      - Do NOT invent or assume facts not present in the text ("no hallucinations").
      - If the document lacks enough information for ${questionCount} unique questions:
        - Rephrase existing facts in different ways.
        - Combine multiple related facts into a single question.
        - Create conceptual or applied questions derived ONLY from the text.
        - Never include any content not directly supported by the document.

      ${selectedInstructions ? `QUIZ STYLE:\n${selectedInstructions}` : ""}

      ${difficultyInstruction ? `DIFFICULTY:\n${difficultyInstruction}` : ""}

      QUESTION & ANSWER GUIDELINES:
      - Cover a broad range of key topics and concepts from the text.
      - Include a balance of factual, conceptual, and application-based questions.
      - Avoid trivial, redundant, or overly similar questions — ensure each question tests a distinct aspect of the text.
      - Phrase both questions and answers in clear, concise, and professional language.
      - Ensure incorrect answers are:
        - Plausible within the context of the document.
        - Clearly incorrect compared to the correct answer.
        - Not misleading due to ambiguity.
      - Avoid answers like "All of the above" or "None of the above".
      - Paraphrase the document’s content instead of copying sentences verbatim.
      - Each question must be standalone and understandable without additional context.

      FORMATTING REQUIREMENTS:
      - Your response MUST strictly follow this structure:
      ${formatInstructions}
      - Do NOT include any extra commentary, explanations, or notes — output only the quiz content in the correct format.

      DOCUMENT TEXT:
      ${texts.join("\n")}
    `;

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      modelName: "gemini-2.5-pro",
      temperature: 0.3,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 2048,
    });

    const message = new HumanMessage({
      content: prompt,
    });

    // Получаем ответ от модели
    const result = await model.invoke([message]);

    function cleanJsonResponse(text: string): string {
      return text
        .replace(/^```json\s*/i, "") // убирает ```json в начале
        .replace(/```$/i, "") // убирает ``` в конце
        .trim();
    }

    const cleaned = cleanJsonResponse(result.content.toString());

    // Парсим результат
    const parsedResult = await parser.parse(cleaned);
    console.log("Parsed result:", parsedResult);

    // Обновляем квиз данными из генерации
    await saveQuizz({
      ...parsedResult.quizz,
      name: quizTitle,
      id: quizzId,
      status: "completed",
      userId: userId,
    });

    // Добавляем дополнительную задержку для гарантии завершения всех транзакций базы данных
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(`Quiz generation completed for quizzId: ${quizzId}`);
  } catch (error) {
    console.error(
      `Error generating quiz in background for quizzId: ${quizzId}`,
      error
    );

    // Обновляем статус квиза в случае ошибки
    await db
      .update(quizzes)
      .set({
        status: "error",
        description:
          "An error occurred during quiz generation. Please try again.",
      })
      .where(eq(quizzes.id, quizzId));
  }
}

