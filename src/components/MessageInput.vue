<template>
  <div class="message-input w-full shadow-sm border rounded-lg border-gray-300 py-1 px-2 focus-within:border-green-700">
    <div class="flex items-center">
      <input type="file" accept="image/*" ref="fileInput" class="hidden">
      <Icon icon="radix-icons:image" width="24" height="24" :class="[
        'mr-2',
        'text-gray-400 cursor-pointer hover:text-gray-600'
      ]" />
      <input class="outline-none border-0 flex-1 bg-white focus:ring-0" type="text" v-model="model">
      <Button icon-name="radix-icons:paper-plane" @click="onCreate">
        发送
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import Button from './Button.vue'
const emit = defineEmits<{
  create: [value: string]
}>()
const model = defineModel<string>()
const onCreate = () => {
  if (model.value && model.value.trim() !== '') {
    emit('create', model.value)
  }
}
</script>