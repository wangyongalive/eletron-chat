<template>
  <div class="w-[80%] mx-auto h-full">
    <div class="flex items-center h-[85%]">
      <ProviderSelect :items="providers" v-model="currentProvider" />
    </div>
    <div class="flex items-center h-[15%]">
      <MessageInput @create="createConversation" :disabled="currentProvider === ''" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRouter } from 'vue-router'
import ProviderSelect from '../components/ProviderSelect.vue';
import MessageInput from '../components/MessageInput.vue';
import { db } from '../db'
import { ProviderProps } from "../types";
import { useConversationStore } from '../stores/conversation'

const providers = ref<ProviderProps[]>([])

const router = useRouter()

const conversationStore = useConversationStore();

onMounted(async () => {
  providers.value = await db.providers.toArray()
});

const currentProvider = ref('');
const modelInfo = computed(() => {
  const [providerId, selectedModel] = currentProvider.value.split('/')
  return {
    providerId: parseInt(providerId),
    selectedModel
  }
})

const createConversation = async (question: string, imagePath?: string) => {
  const { providerId, selectedModel } = modelInfo.value;
  const currentDate = new Date().toISOString();
  let copiedImagePath: string | undefined
  if (imagePath) {
    try {
      copiedImagePath = await window.electronAPI.copyImageToUserDir(imagePath)
      console.log('copiedImagePath', copiedImagePath)
    } catch (error) {
      console.error('Failed to copy image:', error)
    }
  }
  const conversationId = await conversationStore.createConversation({
    title: question,
    selectedModel,
    createdAt: currentDate,
    updatedAt: currentDate,
    providerId,
  })

  const newMessageId = await db.messages.add({
    content: question,
    type: "question",
    conversationId,
    createdAt: currentDate,
    updatedAt: currentDate,
    ...(copiedImagePath && { imagePath: copiedImagePath })
  })
  conversationStore.selectedId = conversationId
  router.push(`/conversation/${conversationId}?init=${newMessageId}`)
}
</script>