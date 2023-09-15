<style lang="scss" scoped>
.result-index {
  padding: 2.4rem;
  background-image: url("~/test/card-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 100% 100%;
  height: 100%;
  overflow-y: auto;
  .check {
    background-color: rgba(0, 0, 0, 1);
    height: 4.4rem;
    border-radius: 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 1.4rem;
    font-weight: 700;
  }

  .check:active {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .chat-bg {
    width: 100%;
    font-weight: 700;
    font-size: 1.4rem;
    margin-bottom: 2.5rem;

    img {
      width: 100%;
      display: block;
    }

    .chat1 {
      position: relative;

      div {
        color: rgba(255, 223, 252, 1);
        position: absolute;
        bottom: 1rem;
        left: 0;
        font-size: 1.6rem;
      }
    }

    .chat2 {
      position: relative;
      margin-top: -1.2rem;
      background-image: url("~/test/chat2.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: 100% 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 1rem;

      div {
        min-height: 10rem;
        max-height: 12rem;
        overflow-y: auto;
        margin-top: 3rem;
        padding: 0 1.6rem;
      }
    }

    .bg3 {
      margin-top: -1.7rem;
      background-image: url("~/test/chat3.png");
      height: 50rem;

      div {
        max-height: 45rem;
      }
    }
  }
}
</style>

<template>
  <div class="result-index">
    <div class="chat-bg">
      <div class="chat1">
        <img :src="Chat1" alt="" />
        <div>心理沙盘解析:</div>
      </div>

      <div class="chat2 bg3">
        <div>
          <span>{{ props.message }}</span>
        </div>
      </div>
    </div>

    <div class="check" @click="$router.push('/dashboard')">更多测试</div>
  </div>
</template>
  
  
  <script setup lang="ts">
import Chat1 from "~/test/chat1.png";

const props = defineProps({
  message: {
    type: String,
  },
});
</script>
  