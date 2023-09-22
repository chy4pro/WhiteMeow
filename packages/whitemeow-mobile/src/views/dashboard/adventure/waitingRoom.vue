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
      margin-top: -14rem;
      width: 100%;
      height: 35rem;
      border-radius: 0.6rem;
      background: linear-gradient(
          146.77deg,
          #ffffff 10%,
          rgba(172, 185, 255, 0.2) 100%
        ),
        linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
      padding: 1.6rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      color: rgba(0, 0, 0, 1);
      font-size: 1.6rem;

      .room-no {
        font-size: 2rem;
        color: rgba(0, 0, 0, 1);
        font-weight: 800;
        font-family: RedHatDisplayBold;
        margin-bottom: 4.5rem;
      }

      .play {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .item {
          width: 18rem;
          height: 10rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 0.4rem dashed rgba(190, 190, 190, 1);
          position: relative;
          border-radius: 0.6rem;
          font-size: 2rem;
          font-weight: 800;
          font-family: RedHatDisplayBold;
          background-color: #fff;

          .icon {
            z-index: 2;
            background-color: #fff;
            position: absolute;
            width: 6.5rem;
            height: 6.5rem;
            border-radius: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 3.2rem;
            border: 0.4rem dashed rgba(190, 190, 190, 1);
          }
        }

        .is-black {
          border: 0.4rem solid #fff !important;
          background-color: black !important;
          color: #fff !important;
        }

        .is-pink {
          border: 0.4rem solid black !important;
          background-color: rgba(255, 106, 240, 1) !important;
          color: #fff !important;
        }
      }
    }
  }

  .bottom {
    .desc {
      text-align: center;
      color: rgba(0, 0, 0, 1);
      font-size: 1.4rem;
      text-decoration: underline;
    }

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
      <img @click="closeTheRoom" class="close" :src="Close" alt="" />
      <img class="cat" :src="Cat" alt="" />
      <div class="box">
        <div class="room-no">房间号：{{ roomNumber }}</div>
        <div class="play">
          <template v-for="(item, index) in playerList" :key="index">
            <div
              v-if="item.userId"
              class="item"
              :class="[item.userName === userName ? 'is-pink' : 'is-black']"
            >
              <div
                class="icon"
                :class="[item.userName === userName ? 'is-pink' : 'is-black']"
              >
                <span v-if="item.userId === realUserId">我</span>
                <span v-else>{{ item.userName }}</span>
              </div>

              <div style="margin-top: 2rem">玩家{{ item.userName }}</div>
            </div>

            <div v-else class="item">
              <div class="icon">?</div>
              <div style="margin-top: 2rem">玩家{{ item.userName }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div
        :class="['btn', 'active']"
        v-if="readyStatus && !isInvite"
        @click="startGame"
      >
        开始游戏
      </div>

      <div :class="['btn', 'active']" v-if="isInvite" @click="closeTheRoom">
        退出游戏
      </div>

      <div
        :class="['btn', 'active']"
        v-if="!readyStatus && !isInvite"
        @click="shareLink"
      >
        立即邀请
      </div>

      <div v-if="!readyStatus" @click="$router.push('hasRoom')" class="desc">
        已有房间，加入好友
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import Socket from "@manage/shared/utils/http/websocket.js";
import messageBox from "@manage/shared/components/MessageBox/index.ts";
import { gameUserMap } from "./gameUserMap";
import { genId, genIdForMsg } from "@manage/shared/utils/idGenerator.js";

import { chatroomAdd, chatroomDelete } from "@manage/shared/apis/game";
import { useLoginStore, useSocketStore } from "@manage/shared/store/index.ts";
import { message } from "ant-design-vue";
import { login } from "@manage/shared/apis/login";

import Cat from "~/adventure/cat.png";
import Close from "~/adventure/close.png";

const socketStore = useSocketStore();
const loginStore = useLoginStore();
const router = useRouter();
const isConnect = ref(true); //是否连接websocket
let realUserId: any = null;

const stepStatus = ref(2);
const source = window.location.href + "&invite=1";
const { text, copy, copied, isSupported } = useClipboard({ source });

const startLoading = ref(false);
const roomNumber = ref("");
const channelId = ref("");
const userName = ref("");
const isInvite = ref(false);
const readyStatus = ref(false);

interface PlayerList {
  userName?: string;
  bgColor?: string;
  borderColor?: string;
  userId?: string;
}
let playerList = ref<PlayerList[]>([{}, {}]);

const shareLink = () => {
  messageBox.success("成功复制，快去分享链接吧");
  copy(source);
};

// 发送消息
const sendMessage = (type: number, userName: string) => {
  // let messageId = genIdForMsg(2 ,20);

  let sendData = {
    typeStatus: "sendMsg",
    channel_id: channelId.value,
    // 'message_id': messageId,
    user: window.localStorage.getItem("token")
      ? window.localStorage.getItem("newUserId")
      : window.localStorage.getItem("userId") || genId("userId", 1),
    user_name: userName,
    kf_id: "uqTIN13j6HKg2nYSyuTay6mHRQULNRSU",
    open_kf_id: "uqTIN13j6HKg2nYSyuTay6mHRQULNRSU",
    type: type,
    heartbeat: false,
  };
  socketStore.ws?.sendMsg(sendData);
};

const getCurrentRouter = () => {
  let query = router.currentRoute.value.query;
  if (query.id) {
    roomNumber.value = query.id as string;
  }
  if (query.channel_id) {
    channelId.value = query.channel_id as string;
  }
  if (query.invite) {
    isInvite.value = (query.invite as string) === "1" ? true : false;
  }
};

// 添加玩家
const addPlayer = (data: any) => {
  let onceFlag = true;
  playerList.value.forEach((item, index) => {
    if (item.userId === "" && onceFlag) {
      if (item.userName === data.user_name) {
        item.userId = data.user;
        //item.userName = data.user_name
        onceFlag = false;
      }
    }
  });
};

const initEmptyPlayer = () => {
  playerList.value.forEach((item, index) => {
    item.userName = gameUserMap[index].name;
    item.userId = "";
    item.bgColor = gameUserMap[index].bgColor;
    item.borderColor = gameUserMap[index].borderColor;
  });
};

// 是否满人
const isFullPlayer = (list: PlayerList[]) => {
  let onlinePlayer = list.filter((item) => {
    if (item.userId && item.userId != "") {
      return item.userId;
    }
  });
  console.log(onlinePlayer);

  if (onlinePlayer && onlinePlayer.length === 2) {
    readyStatus.value = true;
  }
};

// 倒计时3秒
let countIndex = ref(3);
let tempCount: any = null;
function countDownGo() {
  if (countIndex.value === 0) {
    if (tempCount) {
      clearTimeout(tempCount);
    }
    router.push("createRoom");
  } else {
    tempCount = setTimeout(() => {
      countDownGo();
      countIndex.value--;
    }, 1000);
  }
}
// const onReceived2:any = inject('onReceived2')
function onReceived(data: any) {
  // 监听服务器返回信息
  if (data) {
    let dataFormat = JSON.parse(data);
    let tempArr: any = [];

    if (dataFormat) {
      let type = dataFormat.type;
      if (dataFormat.is_stream_end === false) {
        // type为8的跳转准备开始游戏
        if (type === 9) {
          // 代表b进来了
          stepStatus.value = 0;
          sendMessage(2, userName.value);
        } else if (type === 8) {
          if (dataFormat.to_user_id === realUserId.value) {
            startLoading.value = false;

            if (isInvite.value) {
              router.push({
                name: "textAdventure",
                query: {
                  channel_id: channelId.value,
                  user_name: userName.value,
                  invite: 1,
                },
              });
            } else {
              router.push({
                name: "textAdventure",
                query: {
                  channel_id: channelId.value,
                  user_name: userName.value,
                },
              });
            }
          }
        } else if (type === 4 || type === 5) {
          dataFormat.users.forEach((item: any) => {
            tempArr.push({
              user: item.user,
              user_name: item.user_name,
            });
          });

          tempArr.forEach((item: any) => {
            addPlayer(item);
          });
        } else if (type === 6) {
          if (dataFormat.user != realUserId.value) {
            //其它玩家发的退出
            messageBox.info(
              `对面玩家${dataFormat.user_name}退出，即将离开聊天室`
            );
            countDownGo();
            sendMessage(6, userName.value);
          } else {
            //自己发的退出
            messageBox.info(`正在退出，即将离开聊天室`);
            countDownGo();
          }
        }
      }
    }
  }
}
// 关闭并删除聊天室
const closeTheRoom = async () => {
  sendMessage(6, userName.value);
};

// 开始游戏
const startGame = () => {
  console.log("start");
  startLoading.value = true;
  sendMessage(8, userName.value);
};

const initData = () => {
  realUserId = computed(() => {
    let result = "";
    result = (window.localStorage.getItem("token") as string)
      ? (window.localStorage.getItem("newUserId") as string)
      : (window.localStorage.getItem("userId") as string) ||
        (genId("userId", 1) as string);

    return result;
  });

  if (isInvite.value) {
    userName.value = "B";
  } else {
    userName.value = "A";
  }

  //防止用户返回
  if (socketStore.ws) {
    socketStore.ws.close();
  }

  const initSocket = socketStore.initWebSocket(
    realUserId.value,
    userName.value
  );
  initSocket(onReceived);
  socketStore.replaceCallBack(onReceived);
  socketStore.ws.callback = onReceived;
  socketStore.webSocketConnect();
  console.log(socketStore.ws);

  initEmptyPlayer();
};

onMounted(() => {
  getCurrentRouter();
  initData();

  //   window.addEventListener("beforeunload", (event) => {
  //   // Cancel the event as stated by the standard.
  //   event.preventDefault();
  //   sendMessage(6, userName.value)
  //   // Chrome requires returnValue to be set.
  //   event.returnValue = "";
  // });
  if (socketStore.ws) {
    // 监听连接状态变化
    watch(
      () => socketStore.ws.status,
      async (newValue) => {
        console.log(socketStore.ws);

        console.log("myVariable 变化了:", newValue);
        if (newValue === "open") {
          isConnect.value = true;
          //sendMessage(4,)
          if (isInvite.value) {
            sendMessage(5, userName.value);
          } else {
            sendMessage(4, userName.value);
          }
        } else {
          isConnect.value = false;
        }
      }
    );
  }

  // 监听连接状态变化
  watch(
    () => playerList,
    async (newValue) => {
      console.log("----", newValue);
      if (newValue && newValue.value) {
        isFullPlayer(newValue.value);
      }
    },
    { deep: true }
  );
});

// onBeforeUnmount(()=>{
//   window.addEventListener("beforeunload", (event) => {
//   // Cancel the event as stated by the standard.
//   event.preventDefault();
//   sendMessage(6, userName.value)
//   // Chrome requires returnValue to be set.
//   event.returnValue = "";
// });
// })
</script>

