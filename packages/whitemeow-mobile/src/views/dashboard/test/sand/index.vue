<style lang="scss" scoped>
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

.sand-index {
  height: 100%;

  .main {
    height: calc(100% - 5.6rem);
    overflow-y: auto;
    background-color: rgba(242, 242, 242, 1);
    padding: 1.6rem;

    .date {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.4rem;
      color: rgba(102, 102, 104, 1);
    }

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

      .btn {
        border-radius: 4.5rem;
        background-color: rgba(227, 227, 227, 1);
        color: rgba(0, 0, 0, 1);
        height: 4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.4rem;
        font-weight: 500;
        margin-top: 0.8rem;
        border: 1px solid transparent;
      }

      .active {
        color: rgba(255, 106, 240, 1);
        border-color: rgba(255, 106, 240, 1);
        font-weight: 700;
        background-color: rgba(255, 223, 252, 0.5);
      }
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
      position: relative;

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

<template>
  <ResultDialog :message="currentMessage.content" v-show="showDialog" />
  <TipDialog :isShow="chatStore.showOnlyOne" />

  <div class="sand-index" v-show="!showDialog">
    <div class="main" ref="messageList">
      <div class="messageList">
        <div v-for="[date, logs] in chatLogsMap" :key="date">
          <div class="date">
            {{ date }}
          </div>

          <div v-for="(message, index) in logs" :key="index" class="comm">
            <div class="isCat" v-if="message.answer_or_question === 1">
              <div class="cat-img">
                <img :src="Cat" alt="" />
              </div>
              <div class="text">
                <div v-if="index === 2">好的，让我们开始吧！</div>

                {{ message.content }}

                <div v-if="index === 0 && showButtons">
                  <div
                    :key="idx"
                    v-for="(tagItem, idx) in btns"
                    @click="handleSelectTag(tagItem.value)"
                    :class="['btn', current === tagItem.value && 'active']"
                  >
                    {{ tagItem.value }}
                  </div>
                </div>
              </div>
            </div>

            <div class="isMe" v-if="message.answer_or_question === 2">
              <div class="text">
                {{ message.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="send-box">
      <input
        @keyup.enter="carriageReturn"
        v-model="newMessage"
        type="text"
        ref="inputBoxRef"
        @blur="handleBlur"
        @focus="handleFocus"
        placeholder="你想和我聊些什么？......"
      />
      <img @click="sendMessage" :src="Send" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useChatStore } from "@manage/shared/store/index.js";

import Socket from "@manage/shared/utils/http/websocket.js";
import { genId, genIdForMsg } from "@manage/shared/utils/idGenerator.js";
import { useToggleButtons } from "@manage/shared/hooks/toggleButtons";
import {
  evaluationGetSocket,
  getConfig,
} from "@manage/shared/apis/testChat.ts";

import Send from "~/chat/send.png";
import Cat from "~/chat/cat2.png";
import { message } from "@/utils/index";
import ResultDialog from "./result.vue";
import TipDialog from "../comp/tipDialog.vue";

const chatStore = useChatStore();

const showDialog = ref(false);
const buttonMap = ref([""]); //['亲密关系','人格','事业','爱情','友情']
let { current, handleButtonClick } = useToggleButtons(buttonMap.value);
let btns: any = ref([]);
const showButtons = ref(true);

var chatLogsMap = reactive(new Map<string, Message[]>());
const messageList = ref<any>(null);
let ws: any = null;

let isEnd = ref(true);

const newMessage = ref("");
const stepStatus = ref(0);
const relationId = ref(0);
const pageTotal = ref(0);
const isConnect = ref(false); //是否连接websocket
const messages = ref<any>([]);
const scrollBottomFlag = ref(false);
const recordList = reactive({
  user: window.localStorage.getItem("token")
    ? window.localStorage.getItem("newUserId")
    : window.localStorage.getItem("userId") || genId("userId", 1),
  open_kf_id: "lGVmDRmK6W30ROG5eSN8wOlXlroy0D6t",
});

const inputBoxRef = ref<any>();

function getFormattedDate(format = "date") {
  const formatNumber = (number: any) => {
    return number < 10 ? "0" + number : number;
  };
  const now = new Date();

  const year = now.getFullYear();
  const month = formatNumber(now.getMonth() + 1); // Month is zero-based
  const day = formatNumber(now.getDate());
  const hours = formatNumber(now.getHours());
  const minutes = formatNumber(now.getMinutes());
  const seconds = formatNumber(now.getSeconds());

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  const formattedDate = `${year}-${month}-${day}`;

  if (format === "time") {
    return formattedDateTime;
  } else {
    return formattedDate;
  }
}

const handleSelectTag = (value: string) => {
  handleButtonClick(value);
  newMessage.value = value;
  showButtons.value = false;
  sendMessage();
};

const isValidText = (text: string) => {
  //只做非空判断
  const regex = /\S/;
  let str = text.trim();

  return regex.test(str);
};
const carriageReturn = (event: any) => {
  if (event.keyCode == 13) {
    if (!event.metaKey) {
      event.preventDefault();
      sendMessage();
    } else {
      newMessage.value = newMessage.value + "\n";
    }
  }
};
// 发送消息
const sendMessage = () => {
  if (!isConnect.value) {
    message({
      type: "info",
      text: "白小喵正在上线中...",
    });
    return;
  }

  if (!isEnd.value) {
    message({
      type: "info",
      text: "请等等哦~",
    });
    return;
  }

  if (isConnect.value === true) {
    if (isValidText(newMessage.value)) {
      const today = getFormattedDate();
      let messageId = genIdForMsg(2, 20);
      messages.value.push({
        created_at: getFormattedDate("time"),
        content: newMessage.value,
        emoji: 0,
        answer_or_question: 2,
        message_id: messageId,
      });
      if (!chatLogsMap.has(today)) {
        chatLogsMap.set(today, []);
      }

      let getToday = chatLogsMap.get(today);
      if (getToday) {
        getToday.push({
          created_at: getFormattedDate("time"),
          content: newMessage.value,
          emoji: 0,
          answer_or_question: 2,
          message_id: messageId,
        });

        if (getToday.length === 2) {
          stepStatus.value = 0;
        } else if (getToday.length === 4) {
          stepStatus.value = 1;
          relationId.value = getToday[2].relation_id || 0;
        } else if (getToday.length === 6) {
          stepStatus.value = 2;
          relationId.value = getToday[4].relation_id || 0;
        } else if (getToday.length === 8) {
          stepStatus.value = 3;
          currentMessage.content = "";
          relationId.value = getToday[6].relation_id || 0;
          showDialog.value = true;
        }
      }

      // 发送消息
      let sendData = {
        message_id: messageId,
        message: newMessage.value,
        status: stepStatus.value,
        relation_id: relationId.value,
        user: window.localStorage.getItem("token")
          ? window.localStorage.getItem("newUserId")
          : window.localStorage.getItem("userId") || genId("userId", 1),
        open_kf_id: "lGVmDRmK6W30ROG5eSN8wOlXlroy0D6t", //"wkWpQ2GQAAPtHdT-Jdk4ltXYZKlnHoSA"
      };
      ws.sendMsg(sendData);
      newMessage.value = "";
      scrollBottomFlag.value = true;
      isEnd.value = false;
      scrollToBottom();
    } else {
      message({
        type: "info",
        text: "请输入点什么吧~",
      });
    }
  }
};

// 设置信息
const setEvaluationStatus = async (result: any = null) => {
  if (!result) {
    return;
  }

  let status = result.status;
  switch (status) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    default:
      break;
  }
};

const scrollToBottom = async () => {
  await nextTick();
  const container = messageList._value;
  if (container) {
    container.scrollTop = container.scrollHeight;
    scrollBottomFlag.value = false;
  }
};

const scrollToTop = async () => {
  await nextTick();
  const container = messageList._value;
  if (container) {
    container.scrollTop = 0;
    scrollBottomFlag.value = false;
  }
};

let currentMessage: any = { content: "" };
const initData = () => {
  scrollBottomFlag.value = true;
};

const initWebSocket = () => {
  let current_message_id: string = "";

  // scoket连接
  ws = reactive(
    new Socket({
      url: import.meta.env.VITE_API_WEBSOCKET_URL + "/evaluation/socket", //'ws://43.153.76.9:8888/customer/chat',
      name: "", // name
      isHeart: true, // 是否心跳
      isReconnection: true, // 是否断开重连
      received: function (data: any) {
        // 监听服务器返回信息
        let dataFormat = JSON.parse(data);
        const today = getFormattedDate();

        if (!chatLogsMap.has(today)) {
          chatLogsMap.set(today, []);
        } else {
          const chatLogs = chatLogsMap.get(today);
          if (chatLogs) {
            if (
              dataFormat.message_id !== "" &&
              dataFormat.is_end === false &&
              dataFormat.message !== ""
            ) {
              if (dataFormat.message_id === current_message_id) {
                const index = chatLogs.findIndex(
                  (item: any) =>
                    item.message_id === current_message_id &&
                    item.answer_or_question === 1
                );
                currentMessage = chatLogs[index];
                currentMessage.content += dataFormat.message;
              } else {
                chatLogs.push({
                  content:
                    dataFormat.error_message.length > 0
                      ? dataFormat.error_message
                      : dataFormat.message,
                  created_at: getFormattedDate("time"),
                  message_id: dataFormat.message_id,
                  answer_or_question: 1,
                  status_is_end: dataFormat.status_is_end,
                  relation_id: dataFormat.relation_id,
                });
              }

              current_message_id = dataFormat.message_id
                ? dataFormat.message_id
                : "";
              scrollToBottom();
            }

            // update emoji
            if (dataFormat.is_end === true) {
              if (dataFormat.error_message.length > 0) {
                message({
                  type: "error",
                  text: dataFormat.error_message,
                });
              } else {
                if (dataFormat.message_id === current_message_id) {
                  const index = chatLogs.findIndex(
                    (item: any) =>
                      item.message_id === current_message_id &&
                      item.answer_or_question === 1
                  );
                  currentMessage = chatLogs[index];

                  isEnd.value = dataFormat.is_end;
                  currentMessage.relation_id = dataFormat.relation_id;
                }
              }
            }
          }
        }
      },
    })
  );
  ws.init();
  ws.connect();
};

const sayHello = () => {
  const today = getFormattedDate();
  let messageId = genIdForMsg(2, 20);
  let helloWord = "你好，请问你今天想测什么？";
  messages.value.push({
    created_at: getFormattedDate("time"),
    content: helloWord,
    answer_or_question: 1,
    message_id: messageId,
  });
  if (!chatLogsMap.has(today)) {
    chatLogsMap.set(today, []);
  }

  let getToday = chatLogsMap.get(today);
  if (getToday) {
    getToday.push({
      created_at: getFormattedDate("time"),
      content: helloWord,
      answer_or_question: 1,
      message_id: messageId,
    });
  }
};
onMounted(() => {
  initData();
  getButtons();
  getChatRecord();
  initWebSocket();

  // 监听连接状态变化
  watch(
    () => ws.status,
    async (newValue, oldValue) => {
      if (newValue === "open") {
        isConnect.value = true;
      } else {
        isConnect.value = false;
      }
    }
  );

  //根据messages的长度是否为大于1来判断showButtons是否为true
  watch(
    () => messages.value.length,
    async (newValue, oldValue) => {
      if (newValue > 1) {
        showButtons.value = false;
      } else {
        showButtons.value = true;
      }

      if (newValue === 9) {
        showDialog.value = true;
        currentMessage = messages.value[8];
        chatStore.showOnlyOne = true;
      }
    }
  );
});

nextTick(() => {
  inputBoxRef?.value.focus();
});

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
  status_is_end?: boolean;
  message_type?: number;
  created_at?: string;
  updated_at?: string;
  evaluateIcon?: string;
  isUser?: boolean;
  showHoverIcon?: boolean;
  hoverIcon?: string;
}

const chatLogsSplit = (chatLogs: Message[]): Map<string, Message[]> => {
  chatLogs.forEach((log) => {
    let date: string = "";
    if (log && log.created_at) {
      date = log.created_at.split(" ")[0]; // 取日期部分
    }

    if (!chatLogsMap.has(date)) {
      chatLogsMap.set(date, []);
    }

    const logs = chatLogsMap.get(date);
    if (logs) {
      logs.push(log);
    }
  });

  //按照key值排序，按照日期 yyyy-mm-dd 正序排列
  let chatLogsMapSort = new Map(
    [...chatLogsMap.entries()].sort((a, b) => {
      return Date.parse(a[0]) - Date.parse(b[0]);
    })
  );
  chatLogsMap = chatLogsMapSort;

  return chatLogsMap;
};

const getButtons = async () => {
  const result = (await getConfig({ config_type: 3 })) as any;
  buttonMap.value = result.data.list.map((item: any) => {
    return item.value;
  });

  btns.value = useToggleButtons(buttonMap.value).buttons;
  current = useToggleButtons(buttonMap.value).current;

  handleButtonClick = useToggleButtons(buttonMap.value).handleButtonClick;
};
// 获取聊天记录
const getChatRecord = async () => {
  try {
    const result = await evaluationGetSocket(recordList);

    if (result && result.list && result.list.length > 0) {
      if (messages.value.length > 0) {
        let resultList = result.list.map((item: any) => {
          return {
            ...item,
          };
        });
        messages.value = resultList.concat(messages.value);
      } else {
        messages.value = result.list.map((item: any) => {
          return {
            ...item,
          };
        });
      }

      chatLogsSplit(messages.value);
      pageTotal.value = result.total as number;

      if (scrollBottomFlag.value === true) {
        scrollToBottom();
      } else {
        scrollToTop();
      }
    } else {
      sayHello();
    }

    return result;
  } catch (err) {
  } finally {
  }
};

const handleBlur = () => {
  chatStore.handleSetKeypress(false);
};

const handleFocus = () => {
  chatStore.handleSetKeypress(true);
};
</script>

