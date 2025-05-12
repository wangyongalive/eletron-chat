<template>
  <div class="flex items-center justify-between h-screen">
    <div class="bg-gray-200 text-gray-700 w-[300px] h-full border-r border-gray-300">
      <ConversationList :items="items" />
    </div>
    <div class="h-full flex-1">content</div>
  </div>
</template>

<script setup lang="ts">
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