import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { db } from "@/db";
import { quizzes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

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
  const document = body.get("pdf");
  const questionCount = parseInt(body.get("questionCount") as string, 10) || 10;

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
    void generateQuizInBackground(pdfBlob, questionCount, quizzId, userId);

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
  userId: string
) {
  try {
    // Импортируем необходимые библиотеки динамически,
    // чтобы не загружать их при первоначальном API запросе
    const { ChatGoogleGenerativeAI } = await import("@langchain/google-genai");
    const { HumanMessage } = await import("@langchain/core/messages");
    const { StructuredOutputParser } = await import("langchain/output_parsers");
    const { z } = await import("zod");
    const { default: saveQuizz } = await import("./saveToDb");

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
        You are an expert quiz creator. Create a quiz based on the provided document text.

        CRITICAL REQUIREMENTS:
        - Create EXACTLY ${questionCount} questions. No more, no less.
        - Each question must have exactly 4 answer options.
        - Only ONE answer per question should be correct.
        - All questions must be based SOLELY on the information provided in the text.
        - Do not create questions about information not present in the text.

        QUESTION GUIDELINES:
        - Make questions diverse in difficulty and topic coverage
        - Ensure questions test different aspects: facts, understanding, and application
        - Make incorrect answers plausible but clearly wrong

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

    // Парсим результат
    const parsedResult = await parser.parse(result.content.toString());
    console.log("Parsed result:", parsedResult);

    // Обновляем квиз данными из генерации
    await saveQuizz({
      ...parsedResult.quizz,
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

