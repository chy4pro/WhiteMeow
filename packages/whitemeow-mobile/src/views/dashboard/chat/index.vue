<script setup>
import { reactive } from "vue";

import Send from "~/chat/send.png";
import Cat from "~/chat/cat.png";

const state = reactive({
  keyword: "",
});

const handleSend = (e) => {
  if (e) {
    const { value } = e.target;
    state.keyword = value;
  }

  console.log(state)
};
</script>

<template>
  <div class="chat-index">
    <div class="chat">
      <div class="isCat comm">
        <div class="cat-img">
          <img :src="Cat" alt="" />
        </div>
        <div class="text">
          欢迎来看小喵测测，来看看你当前的心理色彩吧欢迎来看小喵测测，来看看你当前的心理色彩吧
        </div>
      </div>

      <div class="isMe comm">
        <div class="text">
          欢迎来看小喵测测，来看看你当前的心理色彩吧欢迎来看小喵测测，来看看你当前的心理色彩吧
        </div>
      </div>
    </div>
    <div class="send-box">
      <input
        @keyup.enter="handleSend($event)"
        v-model="state.keyword"
        type="text"
        placeholder="你想和我聊些什么？......"
      />
      <img @click="handleSend(false)" :src="Send" alt="" />
    </div>
  </div>
</template>

<style scoped lang="scss">
input::input-placeholder {
  color: rgba(0, 0, 0, 0.4);
  font-size: 1.4rem;
  font-weight: 500;
}
input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.4);
  font-size: 1.4rem;
  font-weight: 500;
}

input::-moz-placeholder {
  color: rgba(0, 0, 0, 0.4);
  font-size: 1.4rem;
  font-weight: 500;
}

input::-ms-input-placeholder {
  color: rgba(0, 0, 0, 0.4);
  font-size: 1.4rem;
  font-weight: 500;
}

.comm:last-child {
  margin-bottom: 0 !important;
}

.chat-index {
  height: 100%;

  .chat {
    height: calc(100% - 5.6rem);
    overflow-y: auto;
    background-color: rgba(242, 242, 242, 1);
    padding: 1.6rem;

    .comm {
      margin-bottom: 4rem;
    }

    .text {
      padding: 1.6rem;
      background-color: #fff;
      border-top-left-radius: 2.4rem;
      border-top-right-radius: 2.4rem;
      border-bottom-right-radius: 2.4rem;
      border-bottom-left-radius: 0.4rem;
      line-height: 2.5rem;
      color: rgba(0, 0, 0, 0.8);
      font-size: 1.4rem;
      max-width: 70%;
    }

    .isMe {
      display: flex;
      justify-content: flex-end;

      .text {
        background: rgba(241, 143, 219, 0.5);
        border-bottom-right-radius: 0.4rem;
        border-bottom-left-radius: 2.4rem;
      }
    }

    .isCat {
      display: flex;

      .cat-img {
        display: flex;
        align-items: flex-end;
        margin-right: 2rem;

        img {
          width: 4rem;
          height: 4rem;
        }
      }
    }
  }

  .send-box {
    height: 5.6rem;
    width: 100%;
    padding: 0.8rem 1.6rem 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(248, 248, 248, 1);

    input {
      outline: none;
      border: none;
      height: 100%;
      padding: 0.8rem;
      border-radius: 0.8rem;
      flex: 1;
      margin-right: 0.8rem;
      color: rgba(0, 0, 0, 1);
      font-size: 1.4rem;
    }

    img {
      width: 2.4rem;
      height: 2.4rem;
    }
  }
}
</style>
