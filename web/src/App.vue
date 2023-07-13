<template>
  <HeaderLayout />
  <MainLayout />
</template>

<script>
import HeaderLayout from '@/layout/header.vue'
import MainLayout from '@/layout/main.vue'

export default {
  name: 'App',
  components: {
    HeaderLayout,
    MainLayout
  }
}
</script>

<style lang="scss">
@import '@/styles/font.scss';
/* span {
  font-family: $font;
} */
</style>