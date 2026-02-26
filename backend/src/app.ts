import express, { type Express, type NextFunction, type Request, type Response } from "express";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { toNodeHandler } from "better-auth/node";
import { buildCragConfig } from "./config/cragConfig";
import type { AppEnv } from "./config/env";
import { loadAppEnv } from "./config/env";
import { AskController } from "./controllers/AskController";
import { CragPipelineService } from "./services/crag/CragPipelineService";
import { GeminiLangChainClient } from "./services/llm/GeminiLangChainClient";
import { LangGraphPostgresMemoryService } from "./services/memory/LangGraphPostgresMemoryService";
import { PineconeClientFactory } from "./services/pinecone/PineconeClientFactory";
import { PostProcessor } from "./services/postprocess/PostProcessor";
import { PromptBuilder } from "./services/prompt/PromptBuilder";
import { SubjectRepository } from "./services/prisma/SubjectRepository";
import { PrismaClientProvider } from "./services/prisma/PrismaClientProvider";
import { LangChainPineconeStoreFactory } from "./services/retrieval/LangChainPineconeStoreFactory";
import { Reranker } from "./services/retrieval/Reranker";
import { SubjectScopedRetriever } from "./services/retrieval/SubjectScopedRetriever";
import { createAskRoutes } from "./routes/askRoutes";
import { createBetterAuth } from "./services/auth/auth";
import { createRequireAuth } from "./services/auth/requireAuth";

export interface AppBootstrap {
  app: Express;
  stop: () => Promise<void>;
}

export function createApp(envInput?: AppEnv): AppBootstrap {
  const env = envInput ?? loadAppEnv();
  const config = buildCragConfig(env);

  const prismaProvider = new PrismaClientProvider(env.databaseUrl);
  const subjectRepository = new SubjectRepository(prismaProvider.getClient());
  const auth = createBetterAuth(prismaProvider.getClient(), env);
  const requireAuth = createRequireAuth(auth);

  const pinecone = new PineconeClientFactory({ apiKey: env.pineconeApiKey }).createClient();
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: env.googleApiKey,
    model: "text-embedding-004"
  });

  const retriever = new SubjectScopedRetriever({
    pinecone,
    pineconeIndexName: env.pineconeIndex,
    googleApiKey: env.googleApiKey,
    langChainStoreFactory: new LangChainPineconeStoreFactory({
      pinecone,
      indexName: env.pineconeIndex,
      embeddings
    })
  });

  const reranker = new Reranker();
  const promptBuilder = new PromptBuilder();
  const llmClient = new GeminiLangChainClient({
    apiKey: env.googleApiKey,
    model: config.geminiModel,
    temperature: 0
  });

  const memoryService = new LangGraphPostgresMemoryService({
    connectionString: env.databaseUrl,
    autoSetup: env.langGraphAutoSetup,
    schema: env.langGraphSchema
  });

  const postProcessor = new PostProcessor();

  const cragPipeline = new CragPipelineService({
    retriever,
    reranker,
    promptBuilder,
    llmClient,
    postProcessor,
    memoryService,
    notFoundThreshold: config.notFoundThreshold,
    topK: config.topK,
    rerankTopN: config.rerankTopN
  });

  const askController = new AskController({
    cragPipeline,
    subjectRepository
  });

  const app = express();
  app.all("/api/auth/{*any}", toNodeHandler(auth));
  app.use(express.json());
  app.use("/api", createAskRoutes(askController, requireAuth));

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });

  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  });

  return {
    app,
    stop: async () => {
      await prismaProvider.disconnect();
    }
  };
}
