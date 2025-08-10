interface QuizPromptParams {
  quizTitle: string;
  questionCount: number;
  selectedInstructions?: string;
  difficultyInstruction?: string;
  formatInstructions: string;
  documentText: string;
}

export const createQuizGenerationPrompt = ({
  quizTitle,
  questionCount,
  selectedInstructions,
  difficultyInstruction,
  formatInstructions,
  documentText,
}: QuizPromptParams): string => {
  return `
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

RESPONSE FORMAT:
You MUST respond with ONLY a valid JSON object in this exact format:
${formatInstructions}

IMPORTANT FORMATTING RULES:
- Return ONLY the JSON object, no markdown code blocks, no explanations, no additional text
- Do not wrap the JSON in \`\`\`json or \`\`\` blocks
- Ensure the JSON is properly formatted and valid
- Do not include any text before or after the JSON object

QUESTION & ANSWER GUIDELINES:
- Cover a broad range of key topics and concepts from the text.
- Include a balance of factual, conceptual, and application-based questions.
- Avoid trivial, redundant, or overly similar questions — ensure each question tests a distinct aspect of the text.
- Phrase both questions and answers in clear, concise, and professional language.
- Ensure incorrect answers are plausible within the context of the document.
- Avoid answers like "All of the above" or "None of the above".
- Each question must be standalone and understandable without additional context.

DOCUMENT TEXT:
${documentText}

Respond with only the JSON object:`;
};

export const ERROR_MESSAGES = {
  EMPTY_RESPONSE:
    "AI model returned an empty answer. Please try again or contact support.",
  PARSE_ERROR:
    "Error processing the response from the AI model. The model returned incorrect data format. Please try again.",
  INSUFFICIENT_TEXT:
    "Not enough text was extracted from the PDF file. Please ensure the file contains readable text.",
  GENERATION_ERROR:
    "An error occurred during quiz generation. Please try again.",
} as const;
