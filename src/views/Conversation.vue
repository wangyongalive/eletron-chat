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
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MessageInput from '../components/MessageInput.vue'
import MessageList from '../components/MessageList.vue'
import { ConversationProps, MessageProps, MessageStatus } from '../types'
import { db } from '../db'

const route = useRoute()
const conversation = ref<ConversationProps>()
const filteredMessages = ref<MessageProps[]>([])
let conversationId = parseInt(route.params.id as string)
const initMessageId = parseInt(route.query.init as string)
let lastQuestion = ''
const createInitialMessage = async () => {
  const createData: Omit<MessageProps, "id"> = {
    content: "",
    conversationId,
    type: "answer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'loading'
  }
  const newMessageId = await db.messages.add(createData)
  filteredMessages.value.push({
    id: newMessageId,
    ...createData,
  })
  if (conversation.value) {
    const provider = await db.providers.where({ id: conversation.value.providerId }).first()
    if (provider) {
      console.log('start chat', lastQuestion)
      await window.electronAPI.startChat({
        content: lastQuestion,
        providerName: provider.name,
        selectedModel: conversation.value?.selectedModel || '',
        messageId: newMessageId,
      })
    }
  }
}

watch(() => route.params.id, async (newId) => {
  conversationId = parseInt(newId as string);
  conversation.value = await db.conversations.where({ id: conversationId }).first()
  filteredMessages.value = await db.messages.where({ conversationId }).toArray()
})

onMounted(async () => {
  conversation.value = await db.conversations.where({ id: conversationId }).first()
  filteredMessages.value = await db.messages.where({ conversationId }).toArray()
  if (initMessageId) {
    const lastMessage = await db.messages.where({ conversationId }).last()
    lastQuestion = lastMessage?.content || '';
    await createInitialMessage()
  }
  window.electronAPI.onUpdateMessage(async (streamData) => {
    const { messageId, data } = streamData
    const currentMessage = await db.messages.where({ id: messageId }).first()
    if (currentMessage) {
      const updatedData = {
        content: currentMessage.content + data.result,
        status: data.is_end ? 'finished' : 'loading' as MessageStatus,
        updatedAt: new Date().toISOString(),
      }
      await db.messages.update(messageId, updatedData)
      const index = filteredMessages.value.findIndex(message => message.id === messageId)
      if (index !== -1) {
        filteredMessages.value[index] = {
          ...filteredMessages.value[index],
          ...updatedData,
        }
      }
    }
  })
})

</script>

<style scoped></style>