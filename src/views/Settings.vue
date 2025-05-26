<template>
  <div class="w-[80%] mx-auto p-8">
    <!-- Language Setting -->
    <div class="flex items-center gap-8">
      <label class="text-sm font-medium text-gray-700 w-24">
        语言
      </label>
      <SelectRoot v-model="currentConfig.language" class="w-[160px]">
        <SelectTrigger
          class="inline-flex items-center justify-between rounded-md px-3 py-2 text-sm gap-1 bg-white border border-gray-300">
          <SelectValue placeholder="选择语言..." />
          <SelectIcon>
            <Icon icon="radix-icons:chevron-down" />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectContent class="bg-white rounded-md shadow-lg border">
            <SelectViewport class="p-2">
              <SelectGroup>
                <SelectItem value="zh"
                  class="relative flex items-center px-8 py-2 text-sm text-gray-700 rounded-md cursor-default hover:bg-gray-100">
                  <SelectItemText>中文</SelectItemText>
                  <SelectItemIndicator class="absolute left-2 inline-flex items-center">
                    <Icon icon="radix-icons:check" />
                  </SelectItemIndicator>
                </SelectItem>
                <SelectItem value="en"
                  class="relative flex items-center px-8 py-2 text-sm text-gray-700 rounded-md cursor-default hover:bg-gray-100">
                  <SelectItemText>English</SelectItemText>
                  <SelectItemIndicator class="absolute left-2 inline-flex items-center">
                    <Icon icon="radix-icons:check" />
                  </SelectItemIndicator>
                </SelectItem>
              </SelectGroup>
            </SelectViewport>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>
    </div>

    <!-- Font Size Setting -->
    <div class="flex items-center gap-8">
      <label class="text-sm font-medium text-gray-700 w-24">
        字体大小
      </label>
      <NumberFieldRoot v-model="currentConfig.fontSize" class="inline-flex w-[100px]">
        <NumberFieldDecrement
          class="px-2 border border-r-0 border-gray-300 rounded-l-md hover:bg-gray-100 focus:outline-none">
          <Icon icon="radix-icons:minus" />
        </NumberFieldDecrement>
        <NumberFieldInput
          class="w-10 px-2 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 text-center"
          :min="12" :max="20" />
        <NumberFieldIncrement
          class="px-2 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-100 focus:outline-none">
          <Icon icon="radix-icons:plus" />
        </NumberFieldIncrement>
      </NumberFieldRoot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { AppConfig } from '../types'

import {
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  NumberFieldRoot,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement
} from 'radix-vue'

const currentConfig = reactive<AppConfig>({
  language: 'zh',
  fontSize: 14,
  providerConfigs: {}
})

onMounted(async () => {
  const config = await window.electronAPI.getConfig()
  Object.assign(currentConfig, config)
})

// 监听配置变化并自动保存
watch(currentConfig, async (newConfig) => {
  // 创建一个普通对象来传递配置
  const configToSave = {
    language: newConfig.language,
    fontSize: newConfig.fontSize
  }
  await window.electronAPI.updateConfig(configToSave)
}, { deep: true })
</script>