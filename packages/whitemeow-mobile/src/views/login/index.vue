<script setup>
import Logo from "~/login/logo.png";
</script>

<template>
  <div class="login-index">
    <div class="logo-wrapper">
      <img :src="Logo" alt="" />
    </div>
    <div class="children">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-index {
  width: 100%;
  height: 100%;

  .children {
    height: calc(100% - 14rem);
    padding: 0 2.4rem;
  }

  .logo-wrapper {
    height: 14rem;
    padding-top: 4.8rem;
    padding-bottom: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 22rem;
      max-height: 100%;
    }
  }
}
</style>
