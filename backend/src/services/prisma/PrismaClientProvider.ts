import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/prisma/client";

export class PrismaClientProvider {
  private readonly databaseUrl: string;
  private client: PrismaClient | null = null;

  constructor(databaseUrl: string) {
    this.databaseUrl = databaseUrl;
  }

  getClient(): PrismaClient {
    if (!this.client) {
      const adapter = new PrismaPg({ connectionString: this.databaseUrl });
      this.client = new PrismaClient({ adapter });
    }
    return this.client;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.$disconnect();
      this.client = null;
    }
  }
}
