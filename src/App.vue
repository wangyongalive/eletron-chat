<template>
  <div class="flex items-center justify-between h-screen">
    <div class="bg-gray-200 text-gray-700 w-[300px] h-full border-r border-gray-300">
      <div class="h-[90%] overflow-y-auto">
        <ConversationList :items="items" />
      </div>
      <div class="h-[10%] grid grid-cols-2 gap-2 p-2">
        <button class="shadow-sm inline-flex items-center justify-center bg-green-700 text-white hover:bg-green-700/90
        border border-green-700 h-[32px] py-[8px] px-[15px] text-sm rounded-[4px]">
          <Icon icon="radix-icons:chat-bubble" class="mr-2"></Icon>
          新建聊天
        </button>
        <button class="shadow-sm inline-flex items-center justify-center bg-green-50 text-green-700 hover:bg-green-700
        border border-green-700 h-[32px] py-[8px] px-[15px] text-sm rounded-[4px]">
          <Icon icon="radix-icons:gear" class="mr-2"></Icon>
          应用设置
        </button>
      </div>
    </div>
    <div class="h-full flex-1 flex items-center">
      <div class="w-[80%] mx-auto">
        {{ currentModel }}
        <ProviderSelect :items="providers" v-model="currentModel"></ProviderSelect>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import ConversationList from "./components/ConversationList.vue";
import ProviderSelect from './components/ProviderSelect.vue';
import { ConversationProps, ProviderProps } from "./types";

const items: ConversationProps[] = [
  {
    id: 1,
    title: "title1",
    selectedModel: "string1",
    createdAt: "string1",
    updatedAt: "string1",
    providerId: 1,
  },
  {
    id: 2,
    title: "title2",
    selectedModel: "string2",
    createdAt: "string2",
    updatedAt: "string2",
    providerId: 2,
  },
];

const providers: ProviderProps[] = [
  {
    id: 1,
    name: 'qianfan',
    title: '百度千帆',
    desc: '文心一言 百度出品的大模型',
    models: ['ERNIE-4.0-8K', 'ERNIE-3.5-8K', 'ERNIE-Speed-128K'],
    avatar: 'https://aip-static.cdn.bcebos.com/landing/product/ernie-bote321e5.png',
    createdAt: '2024-07-03',
    updatedAt: '2024-07-03'
  },
  {
    id: 2,
    name: 'dashscope',
    title: '阿里灵积',
    desc: '通义千问',
    // https://help.aliyun.com/zh/dashscope/developer-reference/api-details?spm=a2c4g.11186623.0.0.5bf41507xgULX5#b148acc634pfc
    models: ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-vl-plus'],
    avatar: 'https://qph.cf2.poecdn.net/main-thumb-pb-4160791-200-qlqunomdvkyitpedtghnhsgjlutapgfl.jpeg',
    createdAt: '2024-07-03',
    updatedAt: '2024-07-03'
  },
  {
    id: 3,
    name: 'deepseek',
    title: 'DeepSeek',
    desc: 'DeepSeek',
    // https://api-docs.deepseek.com/zh-cn/
    models: ['deepseek-chat'],
    avatar: 'https://qph.cf2.poecdn.net/main-thumb-pb-4981273-200-phhqenmywlkiybehuaqvsxpfekviajex.jpeg',
    createdAt: '2024-12-27',
    updatedAt: '2024-12-27'
  }
]
const currentModel = ref('1/ERNIE-Speed-128K');
</script>