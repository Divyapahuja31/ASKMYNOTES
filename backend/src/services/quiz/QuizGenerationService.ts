import { z } from "zod";
import type { SubjectRepository } from "../prisma/SubjectRepository";
import type { GeminiLangChainClient } from "../llm/GeminiLangChainClient";

export interface QuizGenerationServiceOptions {
    subjectRepository: SubjectRepository;
    llmClient: GeminiLangChainClient;
}

const quizResponseSchema = z.object({
    mcqs: z.array(z.object({
        id: z.string(),
        question: z.string(),
        options: z.array(z.string()).length(4),
        correctIndex: z.number().int().min(0).max(3),
        explanation: z.string(),
        citation: z.string()
    })).min(1),
    shortAnswers: z.array(z.object({
        id: z.string(),
        question: z.string(),
        modelAnswer: z.string(),
        citation: z.string()
    })).min(1)
});

export type GeneratedQuiz = z.infer<typeof quizResponseSchema>;

export class QuizGenerationService {
    private readonly subjectRepository: SubjectRepository;
    private readonly llmClient: GeminiLangChainClient;

    constructor(options: QuizGenerationServiceOptions) {
        this.subjectRepository = options.subjectRepository;
        this.llmClient = options.llmClient;
    }

    async generateQuiz(subjectId: string, subjectName: string, userId: string): Promise<GeneratedQuiz> {
        // 1. Verify subject exists and belongs to user
        const subject = await this.subjectRepository.findById(subjectId, userId);
        if (!subject) {
            throw new Error("Subject not found");
        }

        // 2. Fetch a random sample of chunks
        const chunks = await this.subjectRepository.getRandomChunks(subjectId, 15);

        if (chunks.length === 0) {
            throw new Error("No notes found for this subject to generate a quiz from.");
        }

        // 3. Assemble context
        const contextText = chunks.map((c, i) => `[Source ${i + 1}: ${c.fileName}, Page ${c.page}, ID: ${c.chunkId}]\n${c.text}`).join("\n\n");

        // 4. Build prompt
        const systemPrompt = `You are an expert tutor creating a helpful study quiz.
You will be provided with random excerpts from a student's notes on the subject: "${subjectName}".
Your task is to generate exactly 5 Multiple Choice Questions (MCQs) and 3 Short Answer questions based ONLY on the provided notes.

For each question, you MUST include a 'citation' field that references the exact Source file, page, and a brief description of where the answer was found (e.g. "lecture_1.pdf - Page 3").

Return the output strictly in the following JSON format without Markdown formatting or code blocks:
{
  "mcqs": [
    {
      "id": "unique-string-id",
      "question": "Question text...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this is correct...",
      "citation": "source file / page"
    }
  ],
  "shortAnswers": [
    {
      "id": "unique-string-id",
      "question": "Question text...",
      "modelAnswer": "Expected answer...",
      "citation": "source file / page"
    }
  ]
}`;

        const humanPrompt = `Here are the excerpts from my notes:\n\n${contextText}\n\nPlease generate the quiz now in the specified JSON format.`;

        // 5. Invoke LLM
        const responseText = await this.llmClient.invoke([
            ["system", systemPrompt],
            ["human", humanPrompt]
        ]);

        // 6. Parse and Validate
        try {
            // Remove any potential markdown wrappers that the LLM might stubbornly include
            const cleanJsonStr = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
            const extractedJson = extractFirstJsonObject(cleanJsonStr);
            const parsed = JSON.parse(extractedJson);
            return quizResponseSchema.parse(parsed);
        } catch (err) {
            console.error("Failed to parse or validate LLM quiz response:", responseText, err);
            throw new Error("Failed to generate a valid quiz. Please try again.");
        }
    }
}

function extractFirstJsonObject(input: string): string {
    const start = input.indexOf("{");
    if (start === -1) {
        throw new Error("No JSON object found in response.");
    }

    let depth = 0;
    let inString = false;
    let escape = false;
    for (let i = start; i < input.length; i += 1) {
        const ch = input[i];
        if (escape) {
            escape = false;
            continue;
        }
        if (ch === "\\") {
            escape = true;
            continue;
        }
        if (ch === "\"") {
            inString = !inString;
            continue;
        }
        if (inString) continue;
        if (ch === "{") depth += 1;
        if (ch === "}") depth -= 1;
        if (depth === 0) {
            return input.slice(start, i + 1).trim();
        }
    }

    throw new Error("Unterminated JSON object in response.");
}
