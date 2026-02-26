import { Pinecone } from "@pinecone-database/pinecone";

export interface PineconeClientFactoryOptions {
  apiKey: string;
}

export class PineconeClientFactory {
  private readonly options: PineconeClientFactoryOptions;

  constructor(options: PineconeClientFactoryOptions) {
    this.options = options;
  }

  createClient(): Pinecone {
    return new Pinecone({ apiKey: this.options.apiKey });
  }
}
