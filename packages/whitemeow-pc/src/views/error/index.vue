<script setup>
import arrow from "@manage/shared/assets/images/back-arrow.png";
import error from "@manage/shared/assets/images/error-show.png";
import { useRouter } from "vue-router";

const router = useRouter();

const handleLinkHome = () => {
  router.push({ path: "/" });
};
</script>

<template>
  <div class="ta-wrapper">
    <div class="left">
      <div class="bold">OOPS!!!</div>
      <div class="normal">糟糕，页面找不到了～</div>
      <div class="link" @click="handleLinkHome">
        <img :src="arrow" alt="" />
        返回主页
      </div>
    </div>
    <div class="right">
      <img :src="error" alt="" />
    </div>
  </div>
</template>

  <style lang="scss">
.ta-wrapper {
  display: flex;

  .right {
    width: 650px;
    height: 450px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-height: 100%;
      max-width: 100%;
    }
  }

  .left {
    display: flex;
    flex-direction: column;
    padding-top: 100px;

    .bold {
      font-size: 10rem;
      font-weight: 700;
      margin-bottom: 2rem;
    }

    .normal {
      font-size: 2.5rem;
      margin-bottom: 6rem;
      color: rgba(0, 0, 0, 0.8);
    }

    .link {
      font-size: 1.6rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      cursor: pointer;
      z-index: 999999;

      img {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>