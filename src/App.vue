<template>
  <div class="flex items-center justify-between h-screen">
    <div class="bg-gray-200 text-gray-700 w-[300px] h-full border-r border-gray-300">
      <div class="h-[90%] overflow-y-auto">
        <ConversationList :items="items" />
      </div>
      <div class="h-[10%] grid grid-cols-2 gap-2 p-2">
        <button class="shadow-sm inline-flex items-center justify-center bg-green-700 text-white hover:bg-green-700/90
        border border-green-700 h-[32px] py-[8px] px-[15px] text-sm rounded-[4px]">
          <Icon icon="radix-icons:chat-bubble" class="mr-2"></Icon>
          新建聊天
        </button>
        <button class="shadow-sm inline-flex items-center justify-center bg-green-50 text-green-700 hover:bg-green-700
        border border-green-700 h-[32px] py-[8px] px-[15px] text-sm rounded-[4px]">
          <Icon icon="radix-icons:gear" class="mr-2"></Icon>
          应用设置
        </button>
      </div>
    </div>
    <div class="h-full flex-1">content</div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import ConversationList from "./compontents/ConversationList.vue";
import { ConversationProps } from "./types";

const items: ConversationProps[] = [
  {
    id: 1,
    title: "title1",
    selectedModel: "string1",
    createdAt: "string1",
    updatedAt: "string1",
    providerId: 1,
  },
  {
    id: 2,
    title: "title2",
    selectedModel: "string2",
    createdAt: "string2",
    updatedAt: "string2",
    providerId: 2,
  },
];
</script>