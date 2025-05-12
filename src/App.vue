<template>
    <div class="flex items-center justify-between h-screen">
        <div class="bg-gray-300 text-gray-700 w-[300px] h-full hover:bg-yellow-300">sidebar</div>
        <div class="bg-green-300 text-blue-700 h-full flex-1">content
            <input type="text" placeholder="Search" class="placeholder:text-blue-300" />
        </div>
    </div>
</template>

<script setup>
console.log('👋 This message is being logged by "App.vue", included via Vite');
</script>