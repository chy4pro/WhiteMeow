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
    position: relative;

    .close {
      width: 2.4rem;
      height: 2.4rem;
      position: absolute;
      right: 0;
      top: 0;
    }

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

      .tip {
        margin-bottom: 6rem;
        color: rgba(0, 0, 0, 1);
        font-size: 2.4rem;

        div {
          text-align: center;
        }
      }

      .no {
        display: flex;
        flex-direction: column;
        font-size: 2rem;
        font-weight: 800;
        color: rgba(0, 0, 0, 1);

        .bold {
          text-align: center;
        }

        input {
          font-size: 2rem;
          font-weight: 800;
          color: rgba(0, 0, 0, 1);
          margin-top: 1rem;
          text-align: center;
          outline: none;
          width: 20rem;
          height: 5.6rem;
          border-radius: 0.6rem;
          border: 1px solid rgba(0, 0, 0, 1);
        }
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
      background-color: rgba(0, 0, 0, 0.4);
      color: #fff;
      font-size: 1.6rem;
      font-weight: 800;
      border-radius: 0.6rem;
      font-family: RedHatDisplayBold;
      margin-bottom: 2rem;
    }

    .active {
      background-color: rgba(0, 0, 0, 1);
    }
  }
}
</style>

<template>
  <div class="room-index">
    <div class="top">
      <img @click="handleClose" class="close" :src="Close" alt="" />
      <img class="cat" :src="Cat" alt="" />
      <div class="box">
        <div class="tip">
          <div>你的朋友等候多时了～</div>
          <div>快快加入吧</div>
        </div>

        <div class="no">
          <div class="bold">房间号:</div>
          <input
            type="text"
            placeholder="输入房间号"
            v-model="formState.roomNumber"
          />
        </div>
      </div>
    </div>

    <div class="bottom">
      <div :class="['btn', formState.roomNumber && 'active']" @click="joinRoom">
        加入游戏
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { chatroomJoin, chatRoomGetById } from "@manage/shared/apis/game";
import {
  userMessage,
  useLoginStore,
  useChatStore,
  useCounterStore,
} from "@manage/shared/store/index.ts";
import { genId, genIdForMsg } from "@manage/shared/utils/idGenerator.js";

import Cat from "~/adventure/cat.png";
import Close from "~/adventure/close.png";

const router = useRouter();
const loginStore = useLoginStore();

const stepStatus = ref(1);
let disabledEnter = ref(true);
const loadingJoin = ref(false);
const formState = reactive({
  roomNumber: "",
});

watch(
  () => formState.roomNumber,
  (newVal) => {
    // 检查 formState.roomNumber 是否有值，如果有值则将 disabledEnter 设置为 false，否则设置为 true
    disabledEnter.value = !newVal;
  }
);

const realUserId = computed(() => {
  let result = "";
  result = (window.localStorage.getItem("token") as string)
    ? (window.localStorage.getItem("newUserId") as string)
    : (window.localStorage.getItem("userId") as string) ||
      (genId("userId", 1) as string);

  return result;
});

//加入房间
const joinRoom = async () => {
  if (!formState.roomNumber) {
    return;
  }
  if (loadingJoin.value) {
    return;
  }

  loadingJoin.value = true;

  let roomData = await getChanelId();

  let params = {
    user: realUserId.value,
    channel_id: roomData.channel_id,
  };

  loadingJoin.value = false;

  let { data, code } = await chatroomJoin(params);

  if (code === 200 && data) {
    router.push({
      name: "waitingRoom",
      query: { channel_id: roomData.channel_id, id: roomData.id, invite: "1" },
    });
  }
};

// 根据房间号获取channelId
const getChanelId = async () => {
  let params = {
    id: formState.roomNumber,
  };

  let { data, code } = await chatRoomGetById(params);

  if (code === 200 && data) {
    return data;
  }
};

const handleClose = () => {
  router.back();
};
</script>

