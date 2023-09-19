<script setup>
import Icon from "~/error/icon.png";

import { useRouter } from "vue-router";

const router = useRouter();

const handleLink = () => {
  router.push({
    path: "/",
  });
};
</script>

<template>
  <div class="error-index">
    <div class="main">
      <img :src="Icon" alt="" />
      <div class="bold">OOPS!!!</div>
      <div class="tip">糟糕，页面找不到了～</div>
      <div @click="handleLink" class="btn">返回主页</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-index {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(255, 223, 252, 1);

  .main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 33.5rem;
      height: 27rem;
      margin-bottom: 2.4rem;
    }

    .bold {
      height: 7.8rem;
      line-height: 7.8rem;
      font-size: 6.4rem;
      font-weight: 700;
      color: rgba(0, 0, 0, 1);
    }

    .tip {
      color: rgba(0, 0, 0, 0.8);
      font-size: 2.2rem;
      font-weight: 500;
      height: 3.2rem;
      line-height: 3.2rem;
    }

    .btn {
      background-color: rgba(0, 0, 0, 1);
      height: 4.4rem;
      border-radius: 0.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1.4rem;
      font-weight: 700;
      width: 33rem;
      margin-top: 8rem;
    }

    .btn:active {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }
}
</style>
