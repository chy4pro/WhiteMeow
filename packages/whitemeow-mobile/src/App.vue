<script setup>
import { onMounted } from "vue";
import { handleHtmlFontSize } from "@manage/shared/utils/index.ts";

onMounted(() => {
  handleHtmlFontSize();
});
</script>

<template>
  <router-view></router-view>
</template>

<style scoped lang="scss">
</style>
