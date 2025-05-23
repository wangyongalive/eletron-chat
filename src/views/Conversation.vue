<template>
  <div class="h-[10%] bg-gray-200 border-b border-gray-300 flex items-center px-3 justify-between" v-if="conversation">
    <h3 class="font-semibold  text-gray-900">{{ conversation.title }}</h3>
    <span class="text-sm text-gray-500">{{ conversation.updatedAt }}</span>
  </div>
  <div class="w-[80%] mx-auto h-[75%] overflow-y-auto pt-2">
    <MessageList :messages="filteredMessages" ref="messageListRef" />
  </div>
  <div class="w-[80%] mx-auto h-[15%] flex items-center">
    <MessageInput @create="sendNewMessage" v-model="inputValue" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import MessageInput from '../components/MessageInput.vue'
import MessageList from '../components/MessageList.vue'
import { MessageProps, MessageListInstance } from '../types'
import { db } from '../db'
import { useConversationStore } from '../stores/conversation'
import { useMessageStore } from '../stores/message'

const inputValue = ref('')
const messageListRef = ref<MessageListInstance>()

const route = useRoute()
const conversationStore = useConversationStore();
const messageStore = useMessageStore();
const filteredMessages = computed(() => messageStore.items)
const sendedMessages = computed(() => filteredMessages.value
  .filter(message => message.status !== 'loading')
  .map(message => {
    return {
      role: message.type === 'question' ? 'user' : 'assistant',
      content: message.content,
    }
  })
)
let conversationId = ref(parseInt(route.params.id as string)) // 路由参数
const initMessageId = parseInt(route.query.init as string) // 初始化标记
const conversation = computed(() => conversationStore.getConversationById(conversationId.value))
let lastQuestion = computed(() => messageStore.getLastQuestion(conversationId.value)) // 获取最后一条问题

const sendNewMessage = async (question: string) => {
  if (question) {
    const date = new Date().toISOString()
    await messageStore.createMessage({
      content: question,
      conversationId: conversationId.value,
      createdAt: date,
      updatedAt: date,
      type: 'question',

    })
    inputValue.value = ''
    creatingInitialMessage()
  }
}

const messageScrollToBottom = async () => {
  await nextTick() // 等待下一次DOM更新完成后再执行滚动操作 以确保元素已经渲染到页面上
  if (messageListRef.value) {
    messageListRef.value.ref.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }
}

const creatingInitialMessage = async () => {
  const createdData: Omit<MessageProps, "id"> = {
    content: "",
    conversationId: conversationId.value,
    type: "answer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'loading'
  }
  const newMessageId = await messageStore.createMessage(createdData)
  await messageScrollToBottom()
  if (conversation.value) {
    const provider = await db.providers.where({ id: conversation.value.providerId }).first()
    if (provider) {
      console.log('start chat', lastQuestion)
      // 调用electronAPI的startChat方法
      await window.electronAPI.startChat({
        providerName: provider.name,
        selectedModel: conversation.value?.selectedModel || '',
        messageId: newMessageId,
        messages: sendedMessages.value
      })
    }
  }
}

watch(() => route.params.id, async (newId) => {
  conversationId.value = parseInt(newId as string);
  await messageStore.fetchConversations(conversationId.value) // 使用store的actions替换
  await messageScrollToBottom()
})

onMounted(async () => {
  await messageStore.fetchConversations(conversationId.value) // 要添加await 否则滑动到底部会失效
  await messageScrollToBottom()
  if (initMessageId) {
    await creatingInitialMessage()
  }
  window.electronAPI.onUpdateMessage(async (streamData) => {
    console.log('streamData', streamData)
    messageStore.updateMessage(streamData)
  })
})

</script>

<style scoped></style>