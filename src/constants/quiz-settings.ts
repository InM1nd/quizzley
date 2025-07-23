const QUIZ_OPTIONS = [
  {
    label: "Exam Preparation",
    value: "exam",
    instruction: `
      The questions should mimic high-stakes exam conditions:
      - Use a balanced mix of knowledge recall and critical thinking.
      - Include slightly tricky distractors (wrong answers that seem partially correct).
      - Ensure the questions reflect typical exam style: direct, precise, and testing understanding of key points.
    `,
  },
  {
    label: "Interview Practice",
    value: "interview",
    instruction: `
      Focus on scenario-based and applied knowledge:
      - Create questions that simulate real-world problem-solving or decision-making.
      - Use practical examples derived from the document content.
      - Avoid overly theoretical or trivial facts; emphasize actionable understanding.
    `,
  },
  {
    label: "General Knowledge",
    value: "general",
    instruction: `
      Cover a wide variety of facts, concepts, and ideas from the text:
      - Make the questions balanced, engaging, and informative.
      - Avoid overcomplication or hyper-specialized details.
    `,
  },
];

const DIFFICULTY_OPTIONS = [
  {
    label: "Easy",
    value: "easy",
    instruction: `
      - Questions should be straightforward and direct.
      - Use simple phrasing and avoid complex terminology.
      - The correct answer should be relatively easy to identify for someone with minimal knowledge.
    `,
  },
  {
    label: "Medium",
    value: "medium",
    instruction: `
      - Questions should include both direct recall and some interpretation.
      - Use moderate complexity in phrasing.
      - Distractors (wrong answers) should be plausible and require attention to detail.
    `,
  },
  {
    label: "Hard",
    value: "hard",
    instruction: `
      - Questions should be challenging, with nuanced or subtle differences between options.
      - Include advanced concepts or multi-step reasoning derived from the text.
      - Ensure that even well-informed readers need to think carefully.
    `,
  },
];

export { QUIZ_OPTIONS, DIFFICULTY_OPTIONS };
