<style scoped lang="scss">
.room-index {
  width: 100%;
  height: 100%;

  .main {
    height: calc(100% - 5.6rem);
    padding: 0 2.4rem;
    background: linear-gradient(180deg, #fccef5 0%, #cedbfc 100%);
    overflow-y: auto;
    position: relative;

    .back {
      width: 2.4rem;
      height: 2.4rem;
      position: absolute;
      top: 50%;
    }

    .back1 {
      left: 0;
    }

    .back2 {
      transform: rotate(180deg);
      right: 0;
    }

    .top {
      margin-top: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;

      .img-wrapper {
        width: 100%;
        display: flex;
        justify-content: space-between;

        .timer {
          flex: 1;
          display: flex;
          justify-content: center;
          padding-top: 1rem;

          .timer-inner {
            display: flex;
            flex-direction: column;
            align-items: center;

            div {
              font-size: 1.2rem;
              color: rgba(0, 0, 0, 1);
              font-weight: 800;
            }

            .sec {
              border: 3px solid rgba(255, 106, 240, 1);
              border-radius: 50%;
              width: 5rem;
              height: 5rem;
              display: flex;
              align-items: center;
              flex-direction: column;
              justify-content: center;
              color: rgba(0, 0, 0, 1);
              background-color: #fff;
              margin-bottom: 0.3rem;

              .bold {
                font-weight: 800;
                display: inline-block;
                font-size: 2rem;
                font-family: RedHatDisplayBold;
                height: 2rem;
                line-height: 2rem;
              }

              .normal {
                display: inline-block;
                height: 1rem;
                line-height: 1rem;
                font-size: 1rem;
              }
            }
          }
        }
      }

      .cat {
        width: 19rem;
        height: 22rem;
      }

      .close {
        position: absolute;
        width: 2.4rem;
        height: 2.4rem;
        right: 0;
        top: 0;
      }

      .box {
        z-index: 2;
        margin-top: -12rem;
        width: 100%;
        min-height: 30rem;
        max-height: 40rem;
        overflow-y: auto;
        border-radius: 0.6rem;
        background: linear-gradient(
            146.77deg,
            #ffffff 10%,
            rgba(172, 185, 255, 0.2) 100%
          ),
          linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
        padding: 2.4rem 1.6rem;
        font-size: 1.6rem;

        .title {
          text-align: center;
          color: rgba(0, 0, 0, 1);
          font-size: 2rem;
          font-weight: 800;
          font-family: RedHatDisplayBold;
        }

        .pink {
          color: rgba(255, 106, 240, 1);
          margin-top: 0.5rem;
        }
      }
    }

    .chat {
      margin: 2.5rem 0;

      .item {
        margin-bottom: 1.6rem;
      }

      .item:last-child {
        margin-bottom: 0;
      }

      .content {
        padding: 1rem 1.6rem;
        border-radius: 0.8rem;
        color: #fff;
        font-size: 1.4rem;
        max-width: 25rem;
        word-wrap: break-word;
      }

      .avatar {
        width: 4rem;
        height: 4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2.2rem;
        color: #fff;
        font-weight: 800;
        font-family: RedHatDisplayBold;
        border-radius: 50%;
      }

      .user {
        display: flex;
        align-items: flex-end;
      }

      .is-me {
        display: flex;

        .avatar {
          background-color: rgba(255, 106, 240, 1);
        }
        .content {
          background-color: rgba(255, 106, 240, 1);
        }
      }

      .is-other {
        display: flex;

        .avatar {
          background-color: rgba(0, 0, 0, 1);
        }
        .content {
          background-color: rgba(0, 0, 0, 1);
        }
      }
    }

    .action {
      margin: 2.5rem 0;

      .comm {
        height: 4.4rem;
        border-radius: 0.6rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.6rem;
        font-weight: 800;
        font-family: RedHatDisplayBold;
        border: 1px solid transparent;
        color: #fff;
        width: 100%;
      }

      .again {
        color: rgba(0, 0, 0, 1);
        border-color: rgba(0, 0, 0, 1);
        background-color: transparent;
        margin-bottom: 1.5rem;
      }

      .test {
        background-color: rgba(0, 0, 0, 1);
      }
    }
  }

  .send-box {
    height: 5.6rem;
    padding: 0.8rem 1.6rem;
    background-color: rgba(248, 248, 248, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 2.4rem;
      height: 2.4rem;
    }

    .left {
      display: flex;
      align-items: center;
      font-size: 1.6rem;
      font-weight: 800;
      color: rgba(0, 0, 0, 0.8);
      font-family: RedHatDisplayBold;
      flex: 1;
      margin-right: 1rem;
      height: 100%;

      .name {
        margin-right: 0.8rem;
      }

      input {
        width: 75%;
        height: 100%;
        outline: none;
        border: none;
        border-radius: 0.8rem;
        background-color: rgba(255, 255, 255, 1);
        padding: 0.8rem 1.3rem;
        font-size: 1.4rem;
        color: rgba(0, 0, 0, 1);
        font-weight: 800;
        font-family: RedHatDisplayBold;
      }
    }
  }
}
</style>

<template>
  <div
    class="room-index"
    :class="[
      textAdventureStore.pageIndex === 5 ? 'h-100%' : 'h-[calc(100%-10.4rem)]',
    ]"
  >
    <div class="main">
      <img
        class="back back1"
        v-if="textAdventureStore.canShowLeft"
        @click="goLeft"
        :src="Back"
        alt=""
      />
      <img
        class="back back2"
        v-if="textAdventureStore.canShowRight"
        @click="goRight"
        :src="Back"
        alt=""
      />

      <div class="top">
        <img class="close" @click="closeTheRoom" :src="Close" alt="" />
        <div class="img-wrapper">
          <img class="cat" :src="Cat" alt="" />
          <div class="timer" v-if="textAdventureStore.pageIndex < 5">
            <div class="timer-inner">
              <div class="sec">
                <span class="bold">{{ countdown }}</span>
                <span class="normal">Sec</span>
              </div>
              <div>请在倒计时时间内</div>
              <div>完成你的答案</div>
            </div>
          </div>
        </div>

        <div class="box" ref="messageList">
          <div class="title" v-if="textAdventureStore.pageIndex < 5">
            情节{{ chinaNumber }}
          </div>

          <div v-if="textAdventureStore.pageIndex === 5">
            <div class="title">游戏总结</div>
            <div class="title pink">未来的职业发展预测</div>
          </div>

          <div
            style="margin-top: 2rem"
            v-if="textAdventureStore.story[textAdventureStore.pageIndex]"
          >
            {{ textAdventureStore.story[textAdventureStore.pageIndex].content }}
          </div>
        </div>
      </div>

      <div class="chat" v-if="textAdventureStore.pageIndex < 5">
        <div
          v-for="(message, index) in chatLog[textAdventureStore.pageIndex]"
          :key="index"
          class="item"
          :style="{
            display: 'flex',
            justifyContent: message.isUser === true ? 'flex-end' : 'flex-start',
          }"
        >
          <div class="is-me" v-if="message.isUser === true">
            <div class="content">{{ message.content }}</div>
            <div class="user" style="margin-left: 1.5rem">
              <div class="avatar">{{ message.user_name }}</div>
            </div>
          </div>

          <div class="is-other" v-else>
            <div class="user" style="margin-right: 1.5rem">
              <div class="avatar">{{ message.user_name }}</div>
            </div>
            <div class="content">{{ message.content }}</div>
          </div>
        </div>
      </div>

      <div class="action" v-if="textAdventureStore.pageIndex === 5">
        <div class="again comm" @click="startAgain">再来一局</div>
        <div
          class="test comm"
          @click="$router.push('/chat/testChat/dailyHome')"
        >
          更多测试
        </div>
      </div>
    </div>

    <div class="send-box" v-show="textAdventureStore.pageIndex < 5">
      <div class="left">
        <div class="name">玩家{{ userName }}：</div>
        <input
          type="text"
          ref="inputBoxRef"
          @keydown="carriageReturn"
          @input="userTyping"
          v-model="newMessage"
          autofocus
          placeholder="你想和我聊些什么？......"
        />
      </div>
      <img @click="readyToSend" :src="Send" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import messageBox from "@manage/shared/components/MessageBox/index.ts";
import { useMySocket } from "@manage/shared/hooks/mySocket";
import { getFormattedDate } from "@manage/shared/utils/util";
import { genId, genIdForMsg } from "@manage/shared/utils/idGenerator.js";
import Socket from "@manage/shared/utils/http/websocket.js";
import {
  useLoginStore,
  useSocketStore,
  useChatStore,
} from "@manage/shared/store/index.ts";
import { useTextAdventureStore } from "@manage/shared/store/game.ts";
import { chatroomDelete } from "@manage/shared/apis/game";
import { login } from "@manage/shared/apis/login";

import Send from "~/adventure/send.png";
import Cat from "~/adventure/cat.png";
import Close from "~/adventure/close.png";
import Back from "~/adventure/back.png";

const chatStore = useChatStore();

const loginStore = useLoginStore();
const socketStore = useSocketStore();
const textAdventureStore = useTextAdventureStore();
let currentStatus = ref<number>(0);
const router = useRouter();
interface Message {
  id?: number;
  relation_id?: number;
  user?: string;
  user_name?: string;
  message_id?: string;
  open_kf_id?: string;
  open_kf_name?: string;
  agent_id?: number;
  content?: string;
  emoji?: number;
  chat_type?: number;
  answer_or_question?: number;
  message_type?: number;
  created_at?: string;
  updated_at?: string;
  evaluateIcon?: string;
  isUser?: boolean;
  showHoverIcon?: boolean;
  hoverIcon?: string;
  dialogue_id?: string;
  status?: number;
  type?: number;
}

let chatLog = reactive<any>([]);
let story: any = ref([]);
let chapter = ref(0);
let realUserId: any = null;
const messages = ref<Message[]>([
  // {
  //   created_at: getFormattedDate('time'),
  //   content: '',
  //   user: '',
  //   user_name: 'A',
  //   message_id: ''
  // },
  // {
  //   created_at: getFormattedDate('time'),
  //   content: '',
  //   user: '',
  //   user_name: 'B',
  //   message_id: ''
  // }
]);

let countdownInterval: any = null; //保存计时器
let wordCount = computed<number>(() => {
  return newMessage.value.length | 0;
});
const stepStatus = ref(1);
const newMessage = ref("");
const isConnect = ref(true); //是否连接websocket
const messageList = ref<any>(null);

const roomNumber = ref("");
const isInvite = ref(false);
const channelId = ref("");
const userName = ref("");

let dialogueId = ref("");

let isEnd = ref(true);
let isSend = ref(false); //当前用户是否发送
let tempLock = ref(false);
// let ws:any = null

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
// 关闭并删除聊天室
const closeTheRoom = async () => {
  sendMessage(6);
};

//再来一盘
const startAgain = () => {
  stepStatus.value = 0;
  dialogueId.value = genIdForMsg(2, 18);
  textAdventureStore.reset();
  clearInterval(countdownInterval);
  countdownValue.value = 60;
  newMessage.value = "";
  chatLog = [];
  isEnd.value = false;
  tempLock.value = false;
  if (!isInvite.value) {
    sendMessage(2);
  }
};

// let oneTimeStatus0 = ref(true)
function onReceived2(data: any) {
  // 监听服务器返回信息
  if (data) {
    let dataFormat = JSON.parse(data);
    // console.log('onReceived2',dataFormat);
    let type = dataFormat.type;

    if (
      dataFormat &&
      dataFormat.is_end === false &&
      dataFormat.is_stream_end === false
    ) {
      if (type === 9) {
        // 代表b进来了
        stepStatus.value = 0;
        dialogueId.value = genIdForMsg(2, 18);
        if (!isInvite.value) {
          sendMessage(2);
        }
      } else if (type === 7) {
        // 代表断开链接
        let countIndex = ref(3);
        messageBox.info(
          `对面玩家离线了，即将离开聊天室（${countIndex.value}s）`
        );
        let tempCount: any = null;
        countDownGo();
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
      } else if (type === 6) {
        if (dataFormat.user != realUserId.value) {
          //其它玩家发的退出
          messageBox.info(
            `对面玩家${dataFormat.user_name}退出，即将离开聊天室`
          );
          countDownGo();
          sendMessage(6);
        } else {
          //自己发的退出
          messageBox.info(`正在退出，即将离开聊天室`);
          countDownGo();
        }
      } else if (type === 3) {
        if (
          dataFormat.detail &&
          dataFormat.detail.user_name !== userName.value
        ) {
          if (messages.value.length === 0) {
            messages.value.push({
              content: "输入中...",
              user: dataFormat.detail.user,
              user_name: dataFormat.detail.user_name,
              message_id: "",
            });
          } else {
            messages.value.forEach((item, index) => {
              if (dataFormat.detail.user_name !== item.user_name) {
                messages.value[index].content = "输入中...";
                messages.value[index].user_name = userName.value;
                messages.value[index].user = realUserId.value;
              } else {
                messages.value.push({
                  content: "输入中...",
                  user: dataFormat.detail.user,
                  user_name: dataFormat.detail.user_name,
                  message_id: "",
                });
              }
            });
          }
        }
        //messages[0]
      } else if (type === 1) {
        let status = dataFormat.status;

        if (dataFormat.is_kf === true) {
          //这里作用是用于控制pageIndex显示情节
          textAdventureStore.pageIndex = status;
          currentStatus.value = status;

          textAdventureStore.addContent(dataFormat.content);
        }

        //接受用户发送数据
        if (!dataFormat.is_kf) {
          if (messages.value.length === 0) {
            messages.value.push({
              content: dataFormat.content,
              user: dataFormat.user,
              user_name: dataFormat.user_name,
              isUser: dataFormat.user === realUserId.value ? true : false,
            });
          } else {
            messages.value.forEach((item: any, index: number) => {
              if (dataFormat.user_name === item.user_name) {
                console.log(item.user_name);
                messages.value[index].content = dataFormat.content;
                messages.value[index].user_name = dataFormat.user_name;
                messages.value[index].user = dataFormat.user;
                messages.value[index].isUser =
                  dataFormat.user === realUserId.value ? true : false;
              } else {
                if (messages.value.length < 2) {
                  messages.value.push({
                    content: dataFormat.content,
                    user: dataFormat.user,
                    user_name: dataFormat.user_name,
                    isUser: dataFormat.user === realUserId.value ? true : false,
                  });
                }
              }
            });
          }

          chatLog[currentStatus.value] = messages.value;
        }

        startScrollInterval();
      }
    }

    if (dataFormat.is_stream_end === true) {
      if (dataFormat.type === 1) {
        if (dataFormat.is_kf === true) {
          console.log("dataFormat", dataFormat);

          clearInterval(countdownInterval); // 清除之前的倒计时
          countdownValue.value = 60; // 重置倒计时值
          countdownInterval = setInterval(updateCountdown, 1000); // 以1秒间隔更新倒计时
          tempLock.value = false; //解锁
          isEnd.value = true;
          isSend.value = false;
        }
      }
    }

    if (dataFormat.is_end === true) {
      if (dataFormat.type === 1) {
        let status = dataFormat.status;
        dialogueId.value = dataFormat.dialogue_id;

        switch (status) {
          case 0:
            break;
          case 1:
            stepStatus.value = 1;
            break;
          case 2:
            stepStatus.value = 2;
            break;
          case 3:
            stepStatus.value = 3;
            break;
          case 4:
            stepStatus.value = 4;
            break;
          case 5:
            stepStatus.value = 5;
            break;
          case 6:
            break;
          default:
            break;
        }
      }
    }
  }
}
// provide('onReceived2', onReceived2)
const goLeft = () => {
  textAdventureStore.goLeft();
};
const goRight = () => {
  textAdventureStore.goRight();
};

let disabledSend = computed(() => {
  return !isConnect.value || tempLock.value || !isEnd.value;
});

const chinaNumber = computed(() => {
  let map = ["一", "二", "三", "四", "五", "六"];
  return map[textAdventureStore.pageIndex];
});

let duration = ref(60); // 总倒计时时间（秒）
let countdownValue = ref(60); // 当前剩余时间（秒）
// 计算倒计时百分比
let percentage = computed(() => {
  let time = (countdownValue.value / duration.value) * 100;
  return time;
});

// 计算倒计时文本
const countdown = computed(() => {
  return Math.ceil(countdownValue.value);
});

// 更新倒计时
const updateCountdown = () => {
  if (countdownValue.value > 0) {
    countdownValue.value--;
  } else {
    // 没发送，那么就需要发
    if (isSend.value === false) {
      readyToSend();
    }
    clearInterval(countdownInterval);
  }
};

const carriageReturn = (event: any) => {
  if (event.keyCode == 13) {
    if (!event.metaKey) {
      event.preventDefault();
      // stepStatus.value = 1;
      sendMessage(1);
    } else {
      newMessage.value = newMessage.value + "\n";
    }
  }
};

const readyToSend = () => {
  // stepStatus.value = 2;
  sendMessage(1);
};

// 发送消息
const sendMessage = (type: number) => {
  if (isConnect.value === false) {
    connectFail();
  }

  if (disabledSend.value) {
    return;
  }

  let sendData = {
    typeStatus: "sendMsg",
    channel_id: channelId.value,
    // 'message_id': messageId,''
    dialogue_id: dialogueId.value,
    content: "",
    user: window.localStorage.getItem("token")
      ? window.localStorage.getItem("newUserId")
      : window.localStorage.getItem("userId") || genId("userId", 1),
    user_name: userName.value,
    kf_id: "uqTIN13j6HKg2nYSyuTay6mHRQULNRSU",
    open_kf_id: "uqTIN13j6HKg2nYSyuTay6mHRQULNRSU",
    type: type,
    status: stepStatus.value,
    heartbeat: false,
  };

  if (type === 1) {
    tempLock.value = true;
    sendData.content = newMessage.value;
    isSend.value = true;
    isEnd.value = false;
    newMessage.value = "";
  }

  if (type === 2) {
    isEnd.value = false;
  }

  console.log(socketStore.ws);

  if (socketStore.ws) {
    socketStore.ws?.sendMsg(sendData);
  }
};

const scrollToBottom = async () => {
  await nextTick();
  const container = messageList._value;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};
let scrollInterval: NodeJS.Timeout | null = null;

const startScrollInterval = () => {
  scrollInterval = setInterval(scrollToBottom, 1000);
};

const stopScrollInterval = () => {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
};

watchEffect(() => {
  if (messageList._value) {
    messageList._value.addEventListener("scroll", stopScrollInterval);
  }
});

const inputBoxRef = ref<any>();
nextTick(() => {
  inputBoxRef?.value.focus();
});

const userTyping = () => {
  checkOverflow();
  // sendMessage(3)
};

const checkOverflow = () => {
  const inputBox: any = inputBoxRef.value;

  if (inputBox) {
    const lineHeight = parseInt(window.getComputedStyle(inputBox).height, 10);
    const lines = inputBox.scrollHeight / lineHeight;

    if (lines > 1) {
      inputBox.classList.add("h-full");
      inputBox.classList.remove("h-36px");
    } else {
      inputBox.classList.add("h-36px");
      inputBox.classList.remove("h-full");
    }
  }
};

const getCurrentRouter = () => {
  let query = router.currentRoute.value.query;

  if (query.id) {
    roomNumber.value = query.id as string;
  }
  if (query.channel_id) {
    channelId.value = query.channel_id as string;
  }
  if (query.user_name) {
    userName.value = query.user_name as string;
  }
  if (query.invite) {
    isInvite.value = (query.invite as string) === "1" ? true : false;
  }
};

const handlerUnload = (event: any) => {
  chatStore.handleSetKeypress(false);

  // Cancel the event as stated by the standard.
  // event.preventDefault();
  // event.returnValue = ''
  // // Chrome requires returnValue to be set.
  // event.returnValue = '离开将不保存当前数据，如需重开右上角关闭房间';
};

const connectFail = () => {
  messageBox.info("该房间断开，请重新开始");
  router.push("createRoom");
};

const handlerWebsocket = () => {
  textAdventureStore.reset();
  if (socketStore.ws) {
    socketStore.replaceCallBack(onReceived2);
    socketStore.ws.callback = onReceived2;
  }
};
onMounted(() => {
  chatStore.handleSetKeypress(true);

  // return;
  //socketStore.initWebSocket(realUserId.value, userName.value, onReceived);
  window.addEventListener("beforeunload", handlerUnload);
  window.addEventListener("unload", handlerUnload);
  realUserId = computed(() => {
    let result = "";
    result = (window.localStorage.getItem("token") as string)
      ? (window.localStorage.getItem("newUserId") as string)
      : (window.localStorage.getItem("userId") as string) ||
        (genId("userId", 1) as string);

    return result;
  });

  handlerWebsocket();
  getCurrentRouter();

  watch(
    () => currentStatus.value,
    (newValue, oldValue) => {
      console.log("newValue123:", newValue);
      messages.value = [];
      clearInterval(countdownInterval); // 清除之前的倒计时
      countdownValue.value = 60; // 重置倒计时值
    }
  );

  watch(
    () => isConnect.value,
    async (newValue) => {
      if (newValue === false) {
        connectFail();
      }
    }
  );

  if (socketStore.ws) {
    // 监听连接状态变化
    watch(
      () => socketStore.ws.status,
      async (newValue) => {
        console.log("myVariable 变化了:", newValue);
        if (newValue === "open") {
          isConnect.value = true;
        } else {
          isConnect.value = false;
        }
      }
    );
  } else {
    isConnect.value = false;
  }

  if (isInvite.value) {
    sendMessage(9);
  }
});

onBeforeUnmount(() => {
  window.addEventListener("beforeunload", handlerUnload);
});

onBeforeRouteLeave((to, from, next) => {
  if (socketStore.ws) {
    sendMessage(6);
    socketStore.ws.close();
  }
  next();
});
</script>

