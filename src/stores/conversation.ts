import { defineStore } from "pinia";
import { ConversationProps } from "../types";
import { db } from "../db";

export interface ConversationStore {
  items: ConversationProps[];
}

export const useConversationStore = defineStore("conersation", {
  state: (): ConversationStore => {
    return {
      items: [],
    };
  },
  actions: {
    async fetchConversations() {
      this.items = await db.conversations.toArray();
    },
    async createConversation(createdData: Omit<ConversationProps, "id">) {
      const newCId = await db.conversations.add(createdData);
      this.items.push({
        id: newCId,
        ...createdData,
      });
      return newCId;
    },
  },
  getters: {
    totalNumbers: (state) => state.items.length,
    getConversationById: (state) => (id: number) => {
      return state.items.find((item) => item.id === id);
    },
  },
});
