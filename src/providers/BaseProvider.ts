import { ChatMessageProps } from "../types";
export abstract class BaseProvider {
    abstract chat(message: ChatMessageProps[], modelName: string): Promise<any>;
    
}
