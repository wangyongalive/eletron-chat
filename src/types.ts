export interface ConversationProps {
  id: number;
  title: string;
  selectedModel: string;
  createdAt: string;
  updatedAt: string;
  providerId: number;
}

export interface ProviderProps {
  id: number;
  name: string;
  title?: string;
  desc?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  models: string[];
}

export type MessageStatus = "loading" | "streaming" | "finished" | "error";
export interface MessageProps {
  id: number;
  content: string;
  type: "question" | "answer";
  conversationId: number;
  status?: MessageStatus;
  createdAt: string;
  updatedAt: string;
  imagePath?: string;
}

export interface CreateChatProps {
  content: string;
  providerName: string;
  selectedModel: string;
  messageId: number;
}

export interface updatedStreamData {
  messageId: number;
  data: {
    is_end: boolean;
    result: string;
  };
}

export type OnUpdatedCallback = (data: updatedStreamData) => void;
