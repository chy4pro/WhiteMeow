<script setup>
import { onMounted } from "vue";
import { handleHtmlFontSize } from "@/utils/index";

onMounted(() => {
  handleHtmlFontSize()
})
</script>

<template>
  <router-view></router-view>
</template>

<style scoped lang="scss">
</style>
