<script setup>
import Info from "~/message/info.png";
import { useRouter } from "vue-router";

import { useChatStore } from "@manage/shared/store/index.ts";
const chatStore = useChatStore();

const router = useRouter();

const props = defineProps({
  isShow: {
    type: Boolean,
  },
});

const handleSure = () => {
  // router.push({ path: "/chat/testChat/dailyHome" });
  chatStore.showOnlyOne = false;
};
</script>

<template>
  <div class="dialog-index" v-if="props.isShow">
    <div class="content">
      <img class="info" :src="Info" alt="" />
      <div class="desc">每天只能测一次哦，欢迎客官明天再来</div>
      <div class="btn" @click="handleSure">确定</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dialog-index {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.1);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.6rem;

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
      height: 2.4rem;
      line-height: 2.4rem;
      margin-top: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .info {
      width: 4.8rem;
      height: 4.8rem;
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
