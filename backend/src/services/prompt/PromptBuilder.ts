import type { MemoryTurn, RetrievedChunk } from "../../types/crag";

export interface PromptBuilderInput {
  subjectName: string;
  question: string;
  chunks: RetrievedChunk[];
  threadMemory: MemoryTurn[];
}

export class PromptBuilder {
  build(input: PromptBuilderInput): Array<["system" | "human", string]> {
    const contextBlock = input.chunks
      .map((chunk) => {
        const fileName = chunk.metadata.fileName ?? "UnknownFile";
        const page = chunk.metadata.page ?? "UnknownPage";
        const chunkId = chunk.metadata.chunkId ?? chunk.id;

        return [
          "[CHUNK_START]",
          `chunkId: ${chunkId}`,
          `fileName: ${fileName}`,
          `page: ${page}`,
          `score: ${chunk.score.toFixed(6)}`,
          "text:",
          chunk.text,
          "[CHUNK_END]"
        ].join("\n");
      })
      .join("\n\n");

    const memoryBlock = input.threadMemory.length === 0
      ? "No prior thread memory."
      : input.threadMemory
        .map((turn, idx) => {
          return [
            `[MEMORY_TURN_${idx + 1}]`,
            `question: ${turn.question}`,
            `answer: ${turn.answer}`,
            `createdAtIso: ${turn.createdAtIso}`,
            "[/MEMORY_TURN]"
          ].join("\n");
        })
        .join("\n\n");

    const systemMessage = [
      `You are a helpful study assistant for the subject "${input.subjectName}". Answer questions using ONLY the provided context from the student's notes.`,
      "",
      "RESPONSE FORMAT:",
      "Return EXACTLY one of the following outputs:",
      "",
      `1) A strict JSON object with this schema:`,
      `{`,
      `  "answer": "<your detailed, well-formatted answer>",`,
      `  "confidence": "High" | "Medium" | "Low",`,
      `  "evidence": ["<exact quote from notes backing claim 1>", "<exact quote 2>", ...],`,
      `  "found": true`,
      `}`,
      "",
      `2) The exact string: "Not found in your notes for [${input.subjectName}]"`,
      "",
      "ANSWER WRITING RULES:",
      "- Write the 'answer' field as a clear, detailed, well-structured explanation that directly addresses the student's question.",
      "- Use Markdown formatting in the answer: **bold** for key terms, bullet points or numbered lists for steps/items, and headings (## or ###) for sections when the answer is long.",
      "- Explain concepts thoroughly as a knowledgeable tutor would — don't just copy-paste from the notes.",
      "- Synthesize information from multiple chunks when relevant to give a complete answer.",
      "- Include examples from the notes when available to illustrate points.",
      "- Keep the language clear and student-friendly.",
      "",
      "EVIDENCE RULES:",
      "- The 'evidence' array should contain 2-5 short, exact quotes from the provided context that support your answer.",
      "- Each evidence string should be a direct quote, not a paraphrase.",
      "",
      "STRICT RULES:",
      "- Never include markdown code fences around the JSON output itself.",
      "- Never add extra keys beyond answer, confidence, evidence, and found.",
      "- If the context does not contain enough information to answer, output the exact Not Found string.",
      "- Do NOT make up information that is not in the provided context."
    ].join("\n");

    const humanMessage = [
      `Subject: ${input.subjectName}`,
      `Question: ${input.question}`,
      "THREAD_MEMORY_START",
      memoryBlock,
      "THREAD_MEMORY_END",
      "CONTEXT_CHUNKS_START",
      contextBlock,
      "CONTEXT_CHUNKS_END"
    ].join("\n\n");

    return [
      ["system", systemMessage],
      ["human", humanMessage]
    ];
  }
}
