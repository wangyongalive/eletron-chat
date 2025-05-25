import { ChatMessageProps, UniversalChunkProps } from "../types";
export abstract class BaseProvider {
  abstract chat(message: ChatMessageProps[], modelName: string): Promise<any>;
  protected abstract transformResponse(chunk: any): UniversalChunkProps;
}
