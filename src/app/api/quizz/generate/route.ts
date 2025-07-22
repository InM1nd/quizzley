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
        You are an expert quiz creator. Your task is to generate a high-quality, diverse, and challenging quiz strictly based on the provided document text.

        CRITICAL REQUIREMENTS:
        - The quiz title must be: "${quizTitle}"
        - Create EXACTLY ${questionCount} questions. No more, no less.
        - Each question must have exactly 4 answer options.
        - Only ONE answer per question should be correct.
        - All questions and answers must be based SOLELY on the information provided in the text. Do NOT use any outside knowledge or assumptions.
        - Do NOT invent facts or details not present in the text ("no hallucinations").
        - If the text is insufficient for the required number of questions, focus on rephrasing or combining information, but never invent content.

        ${
          selectedInstructions
            ? `ADDITIONAL INSTRUCTIONS:\n${selectedInstructions}`
            : ""
        }
        ${difficultyInstruction ? `DIFFICULTY: ${difficultyInstruction}` : ""}

        QUESTION GUIDELINES:
        - Cover a broad range of topics and difficulty levels from the text.
        - Include a mix of factual, conceptual, and application-based questions.
        - Avoid trivial or repetitive questions.
        - Ensure each question is clear, unambiguous, and tests understanding of the material.
        - Phrase questions and answers in a professional, academic style.
        - Incorrect answers must be plausible but clearly incorrect when compared to the correct answer.
        - Avoid using the exact wording from the text for both questions and answers; paraphrase where possible.
        - Do not include "All of the above", "None of the above", or similar options.


        Formatting Instructions:
        ${formatInstructions}
    
      Text:
      ${texts.join("\n")}
    `;

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      modelName: "gemini-2.0-flash",
      temperature: 0.3,
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

