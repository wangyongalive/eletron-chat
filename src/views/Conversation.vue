<template>
  <div class="h-[10%] bg-gray-200 border-b border-gray-300 flex items-center px-3 justify-between" v-if="conversation">
    <h3 class="font-semibold  text-gray-900">{{ conversation.title }}</h3>
    <span class="text-sm text-gray-500">{{ dayjs(conversation.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
  </div>
  <div class="w-[80%] mx-auto h-[75%] overflow-y-auto pt-2 scrollbar-thin">
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
import { MessageProps, MessageListInstance, MessageStatus, updatedStreamData } from '../types'
import { db } from '../db'
import { useConversationStore } from '../stores/conversation'
import { useMessageStore } from '../stores/message'
import dayjs from 'dayjs'

let currentMessageListHeight = 0
const inputValue = ref('')
const messageListRef = ref<MessageListInstance>()

const route = useRoute()
const conversationStore = useConversationStore();
const messageStore = useMessageStore();
const filteredMessages = computed(() => messageStore.items)
const sendedMessages = computed(() => filteredMessages.value
  .filter(message => message.status !== 'loading' && message.status !== 'error')
  .map(message => {
    return {
      role: message.type === 'question' ? 'user' : 'assistant',
      content: message.content,
      ...(message.imagePath && { imagePath: message.imagePath })
    }
  })
)
let conversationId = ref(parseInt(route.params.id as string)) // 路由参数
const initMessageId = parseInt(route.query.init as string) // 初始化标记
const conversation = computed(() => conversationStore.getConversationById(conversationId.value))
let lastQuestion = computed(() => messageStore.getLastQuestion(conversationId.value)) // 获取最后一条问题

const sendNewMessage = async (question: string, imagePath?: string) => {
  if (question) {
    let copiedImagePath: string | undefined
    if (imagePath) {
      try {
        copiedImagePath = await window.electronAPI.copyImageToUserDir(imagePath)
        console.log('copiedImagePath', copiedImagePath)
      } catch (error) {
        console.error('Failed to copy image:', error)
      }
    }
    const date = new Date().toISOString()
    await messageStore.createMessage({
      content: question,
      conversationId: conversationId.value,
      createdAt: date,
      updatedAt: date,
      type: 'question',
      ...(copiedImagePath && { imagePath: copiedImagePath })
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
  currentMessageListHeight = 0
})

onMounted(async () => {
  await messageStore.fetchConversations(conversationId.value) // 要添加await 否则滑动到底部会失效
  await messageScrollToBottom()
  if (initMessageId) {
    await creatingInitialMessage()
  }
  let streamContent = ''
  const checkAndScrollToBottom = async () => {
    if (messageListRef.value) {
      const newHeight = messageListRef.value.ref.clientHeight
      // console.log('the newHeight', newHeight)
      // console.log('the currentMessageListHeight', currentMessageListHeight)
      if (newHeight > currentMessageListHeight) {
        // console.log('scroll to bottom')
        currentMessageListHeight = newHeight
        await messageScrollToBottom()
      }
    }
  }

  window.electronAPI.onUpdateMessage(async (streamData) => {
    console.log('streamData', streamData)
    const { messageId, data } = streamData
    streamContent += data.result

    const getMessageStatus = (data: any): MessageStatus => {
      if (data.is_error) {
        return 'error'
      } else if (data.is_end) {
        return 'finished'
      } else {
        return 'streaming'
      }
    }

    const updatedData = {
      content: streamContent,
      status: getMessageStatus(data),
      updatedAt: new Date().toISOString()
    }
    // update database
    // update filteredMessages
    await messageStore.updateMessage(messageId, updatedData)
    await nextTick()
    await checkAndScrollToBottom()
    if (data.is_end) {
      streamContent = ''
    }
  })
})

</script>

<style scoped></style>