import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import type { QuizGenerationService } from "../services/quiz/QuizGenerationService";
import type { SubjectRepository } from "../services/prisma/SubjectRepository";
import type { AuthenticatedRequest } from "../services/auth/requireAuth";

const generateQuizParamsSchema = z.object({
    subjectId: z.string().min(1)
});

export interface QuizControllerOptions {
    quizGenerationService: QuizGenerationService;
    subjectRepository: SubjectRepository;
}

export class QuizController {
    private readonly quizGenerationService: QuizGenerationService;
    private readonly subjectRepository: SubjectRepository;

    constructor(options: QuizControllerOptions) {
        this.quizGenerationService = options.quizGenerationService;
        this.subjectRepository = options.subjectRepository;
    }

    generateQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const typedReq = req as AuthenticatedRequest;
            const userId = typedReq.authUser?.id;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const parsedParams = generateQuizParamsSchema.safeParse(req.params);
            if (!parsedParams.success) {
                res.status(400).json({ error: "Invalid subject id", details: parsedParams.error.flatten() });
                return;
            }

            const subjectId = parsedParams.data.subjectId;
            const subject = await this.subjectRepository.findById(subjectId, userId);

            if (!subject) {
                res.status(404).json({ error: "Subject not found" });
                return;
            }

            const quiz = await this.quizGenerationService.generateQuiz(subjectId, subject.name, userId);

            res.status(200).json({ quiz });
        } catch (error) {
            if (error instanceof Error && error.message.includes("No notes found")) {
                res.status(400).json({ error: error.message });
            } else {
                next(error);
            }
        }
    };
}
