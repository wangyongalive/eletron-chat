<template>
  <div class="h-[10%] bg-gray-200 border-b border-gray-300 flex items-center px-3 justify-between" v-if="conversation">
    <h3 class="font-semibold  text-gray-900">{{ conversation.title }}</h3>
    <span class="text-sm text-gray-500">{{ conversation.updatedAt }}</span>
  </div>
  <div class="w-[80%] mx-auto h-[75%] overflow-y-auto pt-2">
    <MessageList :messages="filteredMessages" />
  </div>
  <div class="w-[80%] mx-auto h-[15%] flex items-center">
    <MessageInput />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import MessageInput from '../components/MessageInput.vue'
import MessageList from '../components/MessageList.vue'
import { MessageProps, MessageStatus } from '../types'
import { db } from '../db'
import { useConversationStore } from '../stores/conversation'
import { useMessageStore } from '../stores/message'

const route = useRoute()
const conversationStore = useConversationStore();
const messageStore = useMessageStore();
const filteredMessages = computed(() => messageStore.items)
let conversationId = ref(parseInt(route.params.id as string))
const initMessageId = parseInt(route.query.init as string)
const conversation = computed(() => conversationStore.getConversationById(conversationId.value))
let lastQuestion = computed(() => messageStore.getLastQuestion(conversationId.value)) // 获取最后一条问题
const createInitialMessage = async () => {
  const createdData: Omit<MessageProps, "id"> = {
    content: "",
    conversationId: conversationId.value,
    type: "answer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'loading'
  }
  const newMessageId = await messageStore.createMessage(createdData)
  if (conversation.value) {
    const provider = await db.providers.where({ id: conversation.value.providerId }).first()
    if (provider) {
      console.log('start chat', lastQuestion)
      await window.electronAPI.startChat({
        content: lastQuestion.value?.content || '',
        providerName: provider.name,
        selectedModel: conversation.value?.selectedModel || '',
        messageId: newMessageId,
      })
    }
  }
}

watch(() => route.params.id, async (newId) => {
  conversationId.value = parseInt(newId as string);
  messageStore.fetchConversations(conversationId.value) // 使用store的actions替换
})

onMounted(async () => {
  messageStore.fetchConversations(conversationId.value)
  if (initMessageId) {
    await createInitialMessage()
  }
  window.electronAPI.onUpdateMessage(async (streamData) => {
    messageStore.updateMessage(streamData)
  })
})

</script>

<style scoped></style>