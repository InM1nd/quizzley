import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import saveQuizz from "./saveToDb";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const document = body.get("pdf");

  if (!document) {
    return NextResponse.json(
      { error: "No PDF file provided" },
      { status: 400 }
    );
  }

  try {
    const pdfLoader = new PDFLoader(document as Blob, {
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
      Given the text, which is a summary of the document, generate a quiz based on the text.
      ${formatInstructions}
      Text: ${texts.join("\n")}
    `;

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      modelName: "gemini-2.0-flash",
    });

    const message = new HumanMessage({
      content: prompt,
    });

    // Получаем ответ от модели
    const result = await model.invoke([message]);

    // Парсим результат
    const parsedResult = await parser.parse(result.content.toString());
    console.log("Parsed result:", parsedResult);

    const { quizzId } = await saveQuizz(parsedResult.quizz);

    return NextResponse.json(
      {
        quizzId,
        data: parsedResult,
        message: "Quiz created successfully",
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error("Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
