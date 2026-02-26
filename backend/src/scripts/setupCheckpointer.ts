import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { loadAppEnv } from "../config/env";

async function main(): Promise<void> {
  const env = loadAppEnv();

  const checkpointer = PostgresSaver.fromConnString(env.databaseUrl, {
    schema: env.langGraphSchema
  });

  await checkpointer.setup();
  await checkpointer.end();

  console.log("LangGraph Postgres checkpointer tables are ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
