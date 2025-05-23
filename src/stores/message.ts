import { defineStore } from "pinia";
import { MessageProps, MessageStatus, updatedStreamData } from "../types";
import { db } from "../db";

export interface MessageStore {
  items: MessageProps[];
}

export const useMessageStore = defineStore("message", {
  state: (): MessageStore => {
    return {
      items: [],
    };
  },
  actions: {
    async fetchConversations(conversationId: number) {
      this.items = await db.messages.where({ conversationId }).toArray();
    },
    async createMessage(createdData: Omit<MessageProps, "id">) {
      const newMessageId = await db.messages.add(createdData);
      this.items.push({ id: newMessageId, ...createdData });
      return newMessageId;
    },
    async updateMessage(streamData: updatedStreamData) {
      const { messageId, data } = streamData;
      const currentMessage = this.items.find((item) => item.id === messageId);
      if (currentMessage) {
        const updatedData = {
          status: (data.is_end ? "finished" : "streaming") as MessageStatus,
          updatedAt: new Date().toISOString(),
          ...(!data.is_end && {
            // 没有结束的时候才更新content
            content: currentMessage.content + data.result,
          }),
        };
        await db.messages.update(messageId, updatedData);
        const index = this.items.findIndex(
          (message) => message.id === messageId
        );
        // 更新pinia的state
        if (index !== -1) {
          this.items[index] = { ...this.items[index], ...updatedData };
        }
      }
    },
  },
  getters: {
    getLastQuestion: (state) => (conversationId: number) => {
      return state.items.findLast(
        (item) =>
          item.conversationId === conversationId && item.type === "question"
      );
    },
  },
});
