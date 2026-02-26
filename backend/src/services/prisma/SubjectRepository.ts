import type { PrismaClient } from "../../../generated/prisma/client";

export interface SubjectRecord {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubjectFileRecord {
  fileName: string;
  chunkCount: number;
  maxPage: number | null;
  lastIngestedAt: Date | null;
}

export class SubjectRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(subjectId: string, userId: string): Promise<SubjectRecord | null> {
    const row = await this.prisma.subject.findFirst({
      where: { id: subjectId, userId },
      select: { id: true, name: true, createdAt: true, updatedAt: true }
    });

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  async listByUser(userId: string): Promise<SubjectRecord[]> {
    const rows = await this.prisma.subject.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, createdAt: true, updatedAt: true }
    });

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
  }

  async create(userId: string, name: string): Promise<SubjectRecord> {
    const row = await this.prisma.subject.create({
      data: { userId, name },
      select: { id: true, name: true, createdAt: true, updatedAt: true }
    });

    return {
      id: row.id,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  async listFiles(subjectId: string, userId: string): Promise<SubjectFileRecord[]> {
    const subject = await this.findById(subjectId, userId);
    if (!subject) {
      return [];
    }

    const groups = await this.prisma.noteChunk.groupBy({
      by: ["fileName"],
      where: { subjectId },
      _count: { _all: true },
      _max: { page: true, createdAt: true }
    });

    return groups.map((group) => ({
      fileName: group.fileName,
      chunkCount: group._count._all,
      maxPage: group._max.page ?? null,
      lastIngestedAt: group._max.createdAt ?? null
    }));
  }
}
