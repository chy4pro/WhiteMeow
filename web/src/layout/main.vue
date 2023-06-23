<template>
  <main class="main-layout">
    <router-view />
  </main>
</template>

<script>
export default {
  name:'MainLayout'
}
</script>
<style lang="scss" scoped>
.main-layout {
  width: 100%;
  height: 100%;
  position: relative;
  //flex-direction: column;
  overflow: hidden;
  //align-items: stretch;
  flex: 1 1 0%;
}

</style>