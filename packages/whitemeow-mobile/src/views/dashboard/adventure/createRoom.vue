<style scoped lang="scss">
.room-index {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: linear-gradient(180deg, #fccef5 0%, #cedbfc 100%);
  padding: 0 2.4rem;

  .top {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .cat {
      width: 19rem;
      height: 22rem;
    }

    .box {
      margin-bottom: 2.4rem;
      z-index: 2;
      margin-top: -14rem;
      width: 100%;
      height: 30rem;
      border-radius: 0.6rem;
      background: linear-gradient(
          146.77deg,
          #ffffff 10%,
          rgba(172, 185, 255, 0.2) 100%
        ),
        linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
      padding: 0 2.4rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: rgba(0, 0, 0, 1);
      font-size: 1.6rem;
      font-weight: 800;

      .title {
        font-size: 6.4rem;
        font-weight: 800;
        margin-bottom: 4rem;
        font-family: RedHatDisplayBold;
      }
    }
  }

  .bottom {
    .btn {
      width: 100%;
      height: 4.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 1);
      color: #fff;
      font-size: 1.6rem;
      font-weight: 800;
      border-radius: 0.6rem;
      font-family: RedHatDisplayBold;
      margin-bottom: 2rem;
    }

    .desc {
      text-align: center;
      color: rgba(0, 0, 0, 1);
      font-size: 1.4rem;
      text-decoration: underline;
    }
  }
}
</style>

<template>
  <div class="room-index">
    <div class="top">
      <img class="cat" :src="Cat" alt="" />
      <div class="box">
        <div class="title">冒险喵</div>
        欢迎来到喵老师的文字冒险游戏，每局游戏共五个情节，邀请你的好友一起来探索你们的隐藏人格了！
      </div>
    </div>

    <div class="bottom">
      <div class="btn" @click="createRoom">创建房间</div>
      <div @click="$router.push('hasRoom')" class="desc">
        已有房间，加入好友
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { chatroomAdd } from "@manage/shared/apis/game";
import { genId, genIdForMsg } from "@manage/shared/utils/idGenerator.js";
import {
  userMessage,
  useLoginStore,
  useChatStore,
  useCounterStore,
} from "@manage/shared/store/index.ts";

import Cat from "~/adventure/cat.png";

const router = useRouter();

const loginStore = useLoginStore();
const stepStatus = ref(1);
const loadingCreate = ref(false);
const realUserId = computed(() => {
  let result = "";
  result = (window.localStorage.getItem("token") as string)
    ? (window.localStorage.getItem("newUserId") as string)
    : (window.localStorage.getItem("userId") as string) ||
      (genId("userId", 1) as string);

  return result;
});

//创建房间
const createRoom = async () => {
  loadingCreate.value = true;

  let params = {
    user: realUserId.value,
    open_kf_id: "uqTIN13j6HKg2nYSyuTay6mHRQULNRSU",
  };

  loadingCreate.value = false;

  let { data, code } = await chatroomAdd(params);

  if (code === 200 && data) {
    router.push({
      name: "waitingRoom",
      query: { channel_id: data.channel_id, id: data.id },
    });
  }
};
</script>

