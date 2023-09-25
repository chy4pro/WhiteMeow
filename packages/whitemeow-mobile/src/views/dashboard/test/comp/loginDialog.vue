<script setup>
import Avatar from "~/test/avatar.png";
import X from "~/test/x.png";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  isShow: {
    type: Boolean,
  },
});

const handleClick = () => {
  router.back()
}
</script>

<template>
  <div class="dialog-index" v-if="props.isShow">
    <div class="content">
      <img class="x" :src="X" @click="handleClick" alt="" />
      <img class="info" :src="Avatar" alt="" />
      <div class="desc">
        <div>请先登录</div>
        <div>解锁测试喵</div>
      </div>
      <div class="btn" @click="router.push({ path: '/login' })">点击跳转</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dialog-index {
  width: 100%;
  height: calc(100% - 5.6rem);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.6rem;
  background-image: url("~/test/modal.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 100% 100%;

  .content {
    background-color: #fff;
    padding: 1.6rem;
    border-radius: 1rem;
    width: 100%;
    z-index: 4;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .desc {
      color: rgba(0, 0, 0, 1);
      font-size: 1.6rem;
      font-weight: 500;
      margin-top: 1.5rem;
      margin-bottom: 2.5rem;

      div {
        text-align: center;
      }
    }

    .info {
      width: 8rem;
      height: 8rem;
    }

    .x {
      position: absolute;
      width: 1.6rem;
      height: 1.6rem;
      right: 1.6rem;
      top: 1.6rem;
    }

    .btn {
      width: 100%;
      height: 4.4rem;
      border-radius: 0.8rem;
      background-color: rgba(0, 0, 0, 1);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 1.6rem;
      font-weight: 800;
      font-family: RedHatDisplayBold;
    }

    .btn:active {
      background-color: rgba(0, 0, 0, 0.8);
    }
  }
}
</style>
