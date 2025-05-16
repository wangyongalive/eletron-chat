<template>
  <div class="flex items-center justify-between h-screen">
    <div class="bg-gray-200 text-gray-700 w-[300px] h-full border-r border-gray-300">
      <div class="h-[90%] overflow-y-auto">
        <ConversationList :items="conversations" />
      </div>
      <div class="h-[10%] grid grid-cols-2 gap-2 p-2">
        <RouterLink to="/">
          <Button icon-name="radix-icons:chat-bubble" class="w-full">
            新建聊天
          </Button>
        </RouterLink>
        <RouterLink to="/settings">
          <Button icon-name="radix-icons:gear" plain class="w-full">
            应用设置
          </Button>
        </RouterLink>
      </div>
    </div>
    <div class="h-full flex-1">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ConversationList from "./components/ConversationList.vue";
import Button from './components/Button.vue';
import { db, initProviders } from "./db";
import { ConversationProps } from "./types";

const conversations = ref<ConversationProps[]>([])

onMounted(async () => {
  await initProviders();
  conversations.value = await db.conversations.toArray(); // 只有加载初始化的时候，才会赋值。响应式有问题
})

</script>