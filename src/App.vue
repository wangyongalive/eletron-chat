<template>
  <div class="flex items-center justify-between h-screen">
    <div class="bg-gray-200 text-gray-700 w-[300px] h-full border-r border-gray-300">
      <div class="h-[90%] overflow-y-auto  scrollbar-thin">
        <ConversationList :items="items" />
        <h3>{{ conversationStore.totalNumbers }}</h3>
      </div>
      <div class="h-[10%] grid grid-cols-2 gap-2 p-2">
        <RouterLink to="/">
          <Button icon-name="radix-icons:chat-bubble" class="w-full">
            {{ t('common.newChat') }}
          </Button>
        </RouterLink>
        <RouterLink to="/settings">
          <Button icon-name="radix-icons:gear" plain class="w-full">
            {{ t('common.settings') }}
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
import { useProviderStore } from './stores/provider'
import { useI18n } from 'vue-i18n'
import { initI18n } from './i18n/index'

const conversationStore = useConversationStore()
const provdierStore = useProviderStore()
const items = computed(() => conversationStore.items)
const { t } = useI18n()

onMounted(async () => {
  await initI18n()
  await initProviders();
  conversationStore.fetchConversations()
  provdierStore.fetchProviders()
})

</script>