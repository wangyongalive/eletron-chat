<template>
  <div class="conversation-list">
    <div class="item border-gray-300 border-t cursor-pointer bg-white hover:bg-gray-200 p-2" v-for="item in items"
      :key="item.id">
      <a href="">
        <div class="flex justify-between items-center text-sm leading-5 texy-gray-500">
          <span>{{ item.selectedModel }}</span>
          <span>{{ item.updatedAt }}</span>
        </div>
      </a>
      <h2 class="font-semibold leading-9 text-gray-900 truncate"></h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ConversationProps } from "../types";
defineProps<{
  items: ConversationProps[];
}>();
</script>

<style scoped></style>
