const QUIZ_OPTIONS = [
  {
    label: "Exam Preparation",
    value: "exam",
    instruction:
      "Make questions similar in style and difficulty to real exam questions.",
  },
  {
    label: "Interview Practice",
    value: "interview",
    instruction:
      "Focus on practical and scenario-based questions suitable for interviews.",
  },
  {
    label: "General Knowledge",
    value: "general",
    instruction:
      "Include a broad range of general knowledge questions from the text.",
  },
];

const DIFFICULTY_OPTIONS = [
  {
    label: "Easy",
    value: "easy",
    instruction:
      "Make the quiz suitable for beginners. Use simple questions and avoid complex concepts.",
  },
  {
    label: "Medium",
    value: "medium",
    instruction:
      "Make the quiz moderately challenging. Include a mix of basic and intermediate questions.",
  },
  {
    label: "Hard",
    value: "hard",
    instruction:
      "Make the quiz challenging, focusing on advanced concepts and tricky questions.",
  },
];

export { QUIZ_OPTIONS, DIFFICULTY_OPTIONS };
