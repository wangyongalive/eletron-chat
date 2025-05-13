<template>
  <div class="h-[10%] bg-gray-200 border-b border-gray-300 flex items-center px-3 justify-between" v-if="convsersation">
    <h3 class="font-semibold  text-gray-900">{{ convsersation.title }}</h3>
    <span class="text-sm text-gray-500">{{ convsersation.updatedAt }}</span>
  </div>
  <div class="w-[80%] mx-auto h-[75%] overflow-y-auto pt-2">
    <MessageList :messages="filteredMessages" />
  </div>
  <div class="w-[80%] mx-auto h-[15%] flex items-center">
    <MessageInput />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MessageInput from '../components/MessageInput.vue'
import MessageList from '../components/MessageList.vue'
import { messages, conversations } from '../testData'
const route = useRoute()
// 响应式
let conversationId = ref(parseInt(route.params.id as string))

watch(() => route.params.id, (newId) => {
  conversationId.value = parseInt(newId as string)
})

const filteredMessages = computed(() => {
  return messages.filter(message => message.conversationId === conversationId.value)
})

const convsersation = computed(() => {
  return conversations.find(conversation => conversation.id === conversationId.value)
})

</script>

<style scoped></style>