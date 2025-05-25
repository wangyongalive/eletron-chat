import OpenAI from "openai";
import { BaseProvider } from "./BaseProvider";
import { convertMessages } from "../helper";
import { ChatMessageProps } from "../types";

export class OpenAIProvider extends BaseProvider {
  private client: OpenAI;
  constructor(apiKey: string, baseURL: string) {
    super();
    this.client = new OpenAI({
      apiKey,
      baseURL,
    });
  }
  async chat(messages: ChatMessageProps[], model: string) {
    const convertedMessages = await convertMessages(messages);
    const stream = await this.client.chat.completions.create({
      model,
      messages: convertedMessages as any,
      stream: true,
    });
    return {
      async *[Symbol.asyncIterator]() {
        for await (const chunk of stream) {
          yield chunk;
        }
      },
    };
  }
}
