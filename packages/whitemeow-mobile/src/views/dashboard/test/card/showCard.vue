<template>
  <div class="card-index">
    <TipDialog :isShow="formState.status === 3 && chatStore.showOnlyOne" />
    <div class="box1 comm" v-show="loadingFlipped">
      <div class="card" @click="isFlipped = !isFlipped">
        <div class="card-inner">
          <div class="card-front">
            <img :src="CardBack" alt="" />
          </div>
        </div>
      </div>
      <div class="text">翻牌中...</div>
    </div>

    <div
      v-show="
        !loadingFlipped && (formState.status === 1 || formState.status === 3)
      "
      class="box2 comm"
    >
      <div>
        <div class="close">
          <img
            :src="Close"
            alt=""
            @click="
              router.push({
                path: '/dashboard',
              })
            "
          />
        </div>
        <div class="img-wrapper">
          <img :src="formState.tarot_image" />
          {{ formState.tarot_name }}
        </div>

        <div class="text">
          {{ formState.message }}
        </div>

        <div v-show="formState.status === 1">
          <div class="jx">
            <img @click="getQuestion()" :src="Jx" alt="" />
            了解此牌面的今日指示
          </div>
        </div>
      </div>
    </div>

    <div v-show="!loadingFlipped && formState.status === 2" class="box3 comm">
      <div class="chat-bg">
        <div class="chat1">
          <img :src="Chat1" alt="" />
          <div>请认真回答以下问题：</div>
        </div>

        <div class="chat2">
          <img :src="Chat2" alt="" />
          <div>
            {{ formState.message }}
          </div>
        </div>
      </div>

      <div class="answer">我的回答:</div>

      <div class="text">
        <a-form
          ref="formRef"
          name="custom-validation"
          :model="formState"
          :rules="rules"
          layout="vertical"
          autocomplete="off"
        >
          <a-form-item ref="content" name="content" validateStatus="" help="">
            <a-textarea
              v-model:value="formState.content"
              placeholder="请输入您的答案..."
              class="customer-textarea"
              :autoSize="false"
              :maxlength="200"
            />
          </a-form-item>
        </a-form>

        <div class="commit">
          <img @click="handleSubmit" :src="Commit" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import {
  evaluationGetSocket,
  getEvaluation,
} from "@manage/shared/apis/testChat.ts";
import { useChatStore } from "@manage/shared/store/index.js";
const chatStore = useChatStore();

import Socket from "@manage/shared/utils/http/websocket.js";
import { type FormInstance } from "ant-design-vue";
import { genId, genIdForMsg } from "@manage/shared/utils/idGenerator.js";

import CardBack from "~/test/card-back.png";
import Jx from "~/test/jx.png";
import Commit from "~/test/commit.png";
import Chat1 from "~/test/chat1.png";
import Chat2 from "~/test/chat2.png";
import Close from "~/test/close.png";

import { message } from "@/utils/index";
import TipDialog from "../comp/tipDialog.vue";

let ws: any = null;

const newMessage = ref("");
let isEnd = ref(true);
const isConnect = ref(false); //是否连接websocket
const recordList = reactive({
  user: window.localStorage.getItem("token")
    ? window.localStorage.getItem("newUserId")
    : window.localStorage.getItem("userId") || genId("userId", 1),
  open_kf_id: "oLet5ixVLgOqflofOJqjXqSJg0zYlF7U",
});
const router = useRouter();
const isFlipped = ref(false);
const loadingFlipped = ref<boolean>(false);
const formRef = ref<FormInstance>();

let formState = reactive({
  user: "",
  content: "",
  relation_id: 0,
  status: 0,
  tarot: "",
  tarot_image: "",
  tarot_name: "",
  tarot_info: "",
  message: "",
  question: "",
});

const rules: Record<string, Rule[]> = {
  content: [{ required: true, message: "请填写您的回答", trigger: "blur" }],
};

// 获取状态
const getEvaluationInfo = async () => {
  try {
    return new Promise(async (resolve, reject) => {
      let params = {
        user: recordList.user,
        open_kf_id: "oLet5ixVLgOqflofOJqjXqSJg0zYlF7U",
      };
      loadingFlipped.value = true;
      const { data, code } = await getEvaluation(params);
      if (code === 200) {
        return resolve(data);
      }
    });
  } catch (error) {
  } finally {
  }
};

const isValidText = (text: string) => {
  //只做非空判断
  const regex = /\S/;
  let str = text.trim();

  return regex.test(str);
};

// 发送消息
const sendMessage = () => {
  if (isConnect.value === true) {
    // 处理非空的 messages.value
    let messageId = genIdForMsg(2, 20);

    // 发送消息
    let sendData = {
      message_id: messageId,
      message: formState.content,
      status: formState.status,
      relation_id: formState.relation_id,
      user: window.localStorage.getItem("token")
        ? window.localStorage.getItem("newUserId")
        : window.localStorage.getItem("userId") || genId("userId", 1),
      open_kf_id: "oLet5ixVLgOqflofOJqjXqSJg0zYlF7U",
    };
    ws.sendMsg(sendData);
    newMessage.value = "";
    isEnd.value = false;
  }
};

// 设置信息
const setEvaluationStatus = async (result: any = null) => {
  let status = result.status;
  switch (status) {
    case 1:
      loadingFlipped.value = false;

      if (result) {
        formState.status = 1;
        formState.tarot_image = result.tarot_image;
        formState.tarot_name = result.tarot_name;
        formState.message = result.message;
        formState.relation_id = result.relation_id;
      }
      break;
    case 2:
      if (result) {
        loadingFlipped.value = false;
        formState.status = 2;
        formState.tarot_image = result.tarot_image;
        formState.tarot_name = result.tarot_name;
        formState.message = result.message;
        formState.relation_id = result.relation_id;
      }
      break;
    case 3:
      if (result) {
        loadingFlipped.value = false;
        formState.status = 3;
        formState.tarot_image = result.tarot_image;
        formState.tarot_name = result.tarot_name;
        formState.message = result.message;
        formState.relation_id = result.relation_id;
        chatStore.showOnlyOne = true;
      }
      break;
    default:
      break;
  }
};

// 深入了解，进入步骤2，获取问题
const getQuestion = async () => {
  if (isEnd.value === true) {
    loadingFlipped.value = true;
    formState.message = "";
    formState.status = 2;
    sendMessage();
  } else {
    message({
      type: "info",
      text: "请等待分析结果",
    });
  }
};

// 发送问题，进入步骤3，得出最终结果
const handleSubmit = () => {
  if (formRef && formRef.value) {
    formRef.value
      .validate()
      .then(async () => {
        loadingFlipped.value = true;
        formState.message = "";
        formState.status = 3;
        sendMessage();
      })
      .catch((err) => {
        message({
          type: "info",
          text: "请填写您的回答",
        });
      });
  }
};

const initStatus = async () => {
  let result: any = await getEvaluationInfo();
  if (result && result.status === 0) {
    formState.status = 1;
    sendMessage();
  } else {
    setEvaluationStatus(result);
  }
};

const initWebSocket = () => {
  loadingFlipped.value = true;
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
        loadingFlipped.value = false;

        let dataFormat = JSON.parse(data);
        if (
          dataFormat.message_id !== "" &&
          dataFormat.is_end === false &&
          dataFormat.message !== ""
        ) {
          formState.message += dataFormat.message;
          formState.tarot_image = dataFormat.tarot_image;
          formState.tarot_name = dataFormat.tarot_name;
        }

        // update emoji
        if (dataFormat.is_end === true) {
          if (dataFormat.error_message.length > 0) {
            message({
              type: "error",
              text: dataFormat.error_message,
            });
          } else {
            formState.relation_id = dataFormat.relation_id;
            isEnd.value = dataFormat.is_end;
          }
        }
      },
    })
  );
  ws.init()
  ws.connect();
};

// 获取聊天记录
const getChatRecord = async () => {
  try {
    const result: any = await evaluationGetSocket(recordList);

    if (result && result.list && result.list.length > 0) {
      formState = result.list.map((item: any) => {
        return {
          ...item,
        };
      });
    }

    return result;
  } catch (err) {
  } finally {
  }
};

onMounted(() => {
  initWebSocket();

  //监听连接状态变化
  watch(
    () => ws.status,
    async (newValue, oldValue) => {
      if (newValue === "open") {
        isConnect.value = true;
        initStatus();
      } else {
        isConnect.value = false;
      }
    }
  );
});
</script>

<style lang="scss" scoped>
.card-index {
  background-image: url("~/test/card-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 100% 100%;
  height: 100%;
  overflow-y: auto;

  .comm {
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .box3 {
    padding: 3rem 2.4rem 0;

    .text {
      width: 100%;
    }

    .commit {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      img {
        width: 20rem;
        height: 6rem;
      }
    }

    .answer {
      color: rgba(255, 223, 252, 1);
      font-size: 1.6rem;
      font-weight: 600;
      margin-bottom: 0.8rem;
      text-align: left;
      width: 100%;
      padding-left: 0.8rem;
    }

    .chat-bg {
      width: 100%;
      font-weight: 700;
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
        margin-top: -1.3rem;

        div {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          font-size: 1.4rem;
          color: rgba(0, 0, 0, 1);
        }
      }
    }
  }

  .box2 {
    padding: 0 2.4rem;
    margin: 5rem 0;

    .close {
      display: flex;
      justify-content: flex-end;

      img {
        width: 2.4rem;
        height: 2.4rem;
      }
    }

    .jx {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 1.5rem;
      margin-top: 5rem;

      img {
        width: 20rem;
        height: 6rem;
        margin-bottom: 1.6rem;
      }
    }

    .text {
      color: #fff;
      font-size: 1.2rem;
      line-height: 2.3rem;
      margin-top: 2rem;
    }

    .img-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 3.2rem;
      font-weight: 700;
      color: #fff;

      img {
        width: 8rem;
        height: 14rem;
        margin-bottom: 1rem;
      }
    }
  }

  .box1 {
    justify-content: center;
    .text {
      color: #fff;
      font-size: 2.4rem;
      font-weight: 700;
      margin-top: 3.2rem;
    }
  }
}

.card {
  width: 20rem;
  height: 34.7rem;
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card {
  animation-duration: 5s;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  animation-name: flipped;
  animation-iteration-count: infinite;
}

@keyframes flipped {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(360deg);
  }
  /* 0% {
      transform: rotateY(0deg);
    }
    33%{
      transform: rotateY(45deg);
    }
    66%{
      transform: rotateY(90deg);
    }
    100% {
      transform: rotateY(135deg);
    } */
}
textarea.ant-input.customer-textarea {
  --at-apply: w-full h-21rem bg-[#fff] outline-none resize-none border-none;
}
</style>

