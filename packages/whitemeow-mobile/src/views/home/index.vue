<script setup>
import Logo from "~/home/logo.png";
import Cat from "~/home/cat.png";
import Star from "~/home/star.png";
import Hi from "~/home/hi.png";

import { useRouter } from "vue-router";

const router = useRouter();

const handleLink = () => {
    router.push({
      path: "/dashboard",
    });
};
</script>

<template>
  <div class="wrapper" @click="handleLink">
    <div class="main">
      <img class="logo" :src="Logo" alt="" />
      <div class="name">白小喵</div>
      <div class="desc">你的专属聊愈宠物</div>
      <div class="hi">
        <img class="star" :src="Star" alt="" />
        <img class="h" :src="Hi" alt="" />
      </div>
    </div>

    <div class="bottom">
      <img :src="Cat" alt="" />
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
    height: 29rem;
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

    .hi {
      display: flex;
      align-items: center;
      position: relative;
      margin-top: 8rem;

      .star {
        width: 2.6rem;
        height: 4.2rem;
        position: absolute;
        left: -7rem;
      }

      .h {
        width: 9.9rem;
        height: 8.3rem;
        margin-left: 5rem;
      }
    }

    .desc {
      height: 1.8rem;
      line-height: 1.8rem;
      font-size: 1.6rem;
      color: rgba(0, 0, 0, 0.6);
    }

    .name {
      height: 6rem;
      font-size: 4.5rem;
      font-weight: 900;
      line-height: 6rem;
      color: rgba(46, 20, 46, 1);
      margin-bottom: 0.8rem;
    }
    .logo {
      width: 16rem;
      height: 16rem;
    }
  }
}
</style>
