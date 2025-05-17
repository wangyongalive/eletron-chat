<template>
  <div class="flex items-center justify-between h-screen">
    <div class="bg-gray-200 text-gray-700 w-[300px] h-full border-r border-gray-300">
      <div class="h-[90%] overflow-y-auto">
        <ConversationList :items="items" />
        <h3>{{ conversationStore.totalNumbers }}</h3>
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
import { onMounted, computed } from "vue";
import ConversationList from "./components/ConversationList.vue";
import Button from './components/Button.vue';
import { initProviders } from "./db";
import { useConversationStore } from './stores/conversation';

const conversationStore = useConversationStore()
const items = computed(() => conversationStore.items)
onMounted(async () => {
  await initProviders();
  conversationStore.fetchConversations()
})

</script>