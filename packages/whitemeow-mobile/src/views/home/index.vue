<script setup>
import { onMounted, onUnmounted } from "vue";

import Logo from "~/home/logo.png";
import Bg from "~/home/bg.png";

import { useRouter } from "vue-router";

const router = useRouter();

let timer = null;

onMounted(() => {
  timer = setTimeout(() => {
    router.push({
      path: "/chat/freeChat",
    });
  }, 2000);
});

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>

<template>
  <div class="wrapper">
    <div class="main">
      <img class="logo" :src="Logo" alt="" />
      <div class="name">白小喵</div>
      <div class="desc">你的专属聊愈宠物</div>
    </div>

    <div class="bottom">
      <img :src="Bg" alt="" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 223, 252, 1);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  .bottom {
    position: absolute;
    bottom: 0;
    height: 35rem;
    width: 100%;
    display: flex;

    img {
      max-height: 100%;
      width: 100%;
    }
  }

  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9;
    margin-top: -30rem;

    .desc {
      height: 1.8rem;
      line-height: 1.8rem;
      font-size: 1.6rem;
      color: rgba(0, 0, 0, 0.6);
    }

    .name {
      height: 6rem;
      font-size: 5rem;
      font-weight: 900;
      line-height: 6rem;
      color: rgba(46, 20, 46, 1);
      margin-bottom: 0.8rem;
      font-family: RedHatDisplayBold !important;
    }
    .logo {
      width: 16rem;
      height: 16rem;
    }
  }
}
</style>
