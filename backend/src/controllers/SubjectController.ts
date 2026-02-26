import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import type { SubjectRepository } from "../services/prisma/SubjectRepository";
import type { AuthenticatedRequest } from "../services/auth/requireAuth";

const createSubjectSchema = z.object({
  name: z.string().min(1).max(120)
});

const subjectIdParamsSchema = z.object({
  subjectId: z.string().min(1)
});

export interface SubjectControllerOptions {
  subjectRepository: SubjectRepository;
}

export class SubjectController {
  private readonly subjectRepository: SubjectRepository;

  constructor(options: SubjectControllerOptions) {
    this.subjectRepository = options.subjectRepository;
  }

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typedReq = req as AuthenticatedRequest;
      const userId = typedReq.authUser?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const subjects = await this.subjectRepository.listByUser(userId);
      res.status(200).json({ subjects });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typedReq = req as AuthenticatedRequest;
      const userId = typedReq.authUser?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const parsed = createSubjectSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
        return;
      }

      const created = await this.subjectRepository.create(userId, parsed.data.name.trim());
      res.status(201).json({ subject: created });
    } catch (error) {
      next(error);
    }
  };

  listFiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const typedReq = req as AuthenticatedRequest;
      const userId = typedReq.authUser?.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const parsedParams = subjectIdParamsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        res.status(400).json({ error: "Invalid subject id", details: parsedParams.error.flatten() });
        return;
      }

      const subject = await this.subjectRepository.findById(parsedParams.data.subjectId, userId);
      if (!subject) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      const files = await this.subjectRepository.listFiles(parsedParams.data.subjectId, userId);
      res.status(200).json({ subject, files });
    } catch (error) {
      next(error);
    }
  };
}
