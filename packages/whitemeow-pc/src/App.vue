<template>
  <HeaderLayout />
  <MainLayout />
</template>

<script>
import HeaderLayout from '@/layout/header.vue'
import MainLayout from '@/layout/main.vue'
import { handleHtmlFontSize } from "@manage/shared/utils/index.ts";

export default {
  name: 'App',
  components: {
    HeaderLayout,
    MainLayout
  },
  mounted() {
    handleHtmlFontSize()
  }
}
</script>

<style lang="scss">
@import '@/styles/font.scss';
/* span {
  font-family: $font;
} */
</style>