<template>
  <div class="dream-index">
    <TipDialog :isShow="formState.status === 2 && chatStore.showOnlyOne" />
    <div v-show="formState.status === 0">
      <div class="chat-bg">
        <div class="chat1">
          <img :src="Chat1" alt="" />
          <div>请认真回答以下问题：</div>
        </div>

        <div class="chat2 bg1">
          <div>
            <span>{{ formState.message }}</span>
          </div>
        </div>
      </div>

      <div class="answer" v-show="formState.status === 0">
        <strong>我的回答：</strong>
        <span>(尽可能详细的描述你的梦境)</span>
      </div>

      <div>
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
              placeholder="eg：我梦到了一个深井冰追着我跑"
              class="customer-textarea"
              :autoSize="false"
              :maxlength="200"
            />
          </a-form-item>
        </a-form>

        <div @click="handleSubmit(1)" class="check">查看解析</div>
      </div>
    </div>

    <div v-show="formState.status === 1">
      <div class="chat-bg">
        <div class="chat1">
          <img :src="Chat1" alt="" />
          <div>解梦结果:</div>
        </div>

        <div class="chat2 bg2">
          <div>
            <span>{{ formState.message }}</span>
          </div>
        </div>
      </div>

      <div class="answer">
        <div><strong>再次补充：</strong></div>
        <span>(只有一次补充机会，请尽可能的补充梦境的所有内容)</span>
      </div>

      <div>
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
              placeholder="eg：我梦到了一个深井冰追着我跑"
              class="customer-textarea-small"
              :autoSize="false"
              :maxlength="200"
            />
          </a-form-item>
        </a-form>

        <div class="check" @click="handleSubmit(2)">查看解析</div>
      </div>
    </div>

    <div v-show="formState.status === 2">
      <div class="chat-bg">
        <div class="chat1">
          <img :src="Chat1" alt="" />
          <div>解梦结果:</div>
        </div>

        <div class="chat2 bg3">
          <div>
            <span>{{ formState.message }}</span>
          </div>
        </div>
      </div>

      <div
        class="check"
        v-if="formState.status === 2"
        @click="$router.push('/dashboard')"
      >
        更多测试
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import { type FormInstance } from "ant-design-vue";
import { useChatStore } from "@manage/shared/store/index.js";

import { getEvaluation } from "@manage/shared/apis/testChat.ts";
import Socket from "@manage/shared/utils/http/websocket.js";
import { genId, genIdForMsg } from "@manage/shared/utils/idGenerator.js";

import Chat1 from "~/test/chat1.png";
import { message } from "@/utils/index";
import TipDialog from "../comp/tipDialog.vue";

const chatStore = useChatStore();
const spinning = ref<boolean>(false);
let ws: any = null;
let isEnd = ref(true);
const formRef = ref<FormInstance>();
const relationId = ref(0);
const isConnect = ref(false); //是否连接websocket
const recordList = reactive({
  user: window.localStorage.getItem("token")
    ? window.localStorage.getItem("newUserId")
    : window.localStorage.getItem("userId") || genId("userId", 1),
  open_kf_id: "uIcMlmqSXJQ6259n6I3QMfSODVeFOwk5",
});
const formState = reactive({
  user: "",
  content: "",
  relation_id: "0",
  status: 0,
  tarot: "",
  tarot_image: "",
  tarot_name: "",
  tarot_info: "",
  message: "",
  question: "",
  answer: "",
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
        open_kf_id: "uIcMlmqSXJQ6259n6I3QMfSODVeFOwk5",
      };
      spinning.value = true;
      const { data, code } = await getEvaluation(params);
      if (code === 200) {
        return resolve(data);
      } else {
        return resolve(null);
      }
    });
  } catch (error) {
  } finally {
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
      spinning.value = false;
      formState.status = 0;
      formState.message =
        "喵喵～家人你好！我是来自好喵星球的粉贱贱大师。梦到了奇奇怪怪的事情？说吧，昨晚梦见啥了，给粉贱贱来解解看～喵~🐾🌌🐟";
      formState.content = "";
      break;
    case 1:
      spinning.value = false;

      if (result) {
        formState.status = 1;
        formState.message = result.message;
        formState.content = "";
      }
      break;
    case 2:
      spinning.value = false;
      if (result) {
        formState.status = 2;
        formState.message = result.message;
        chatStore.showOnlyOne = true;
      }
      break;
    default:
      break;
  }
};

// 发送问题，进入步骤，得出最终结果
const handleSubmit = (status: number) => {
  if (formRef && formRef.value) {
    formRef.value
      .validate()
      .then(async () => {
        if (isEnd.value === true) {
          spinning.value = true;
          formState.status = status;
          formState.message = "";
          sendMessage();
        } else {
          message({
            type: "info",
            text: "请等待分析结果",
          });
        }
      })
      .catch((err) => {
        message({
          type: "info",
          text: "请填写您的回答",
        });
      });
  }
};
// 发送消息
const sendMessage = () => {
  if (isConnect.value === true) {
    let messageId = genIdForMsg(2, 20);

    let sendData = {
      message_id: messageId,
      message: formState.content,
      status: formState.status,
      relation_id: relationId.value,
      user: window.localStorage.getItem("token")
        ? window.localStorage.getItem("newUserId")
        : window.localStorage.getItem("userId") || genId("userId", 1),
      open_kf_id: "uIcMlmqSXJQ6259n6I3QMfSODVeFOwk5",
    };
    ws.sendMsg(sendData);
    formState.content = "";
    isEnd.value = false;
  }
};

const initStatus = async () => {
  spinning.value = true;
  let result: any = await getEvaluationInfo();
  setEvaluationStatus(result);
};

const initWebSocket = () => {
  spinning.value = true;

  // scoket连接
  ws = reactive(
    new Socket({
      url: import.meta.env.VITE_API_WEBSOCKET_URL + "/evaluation/socket", //'ws://43.153.76.9:8888/customer/chat',
      name: "", // name
      isHeart: true, // 是否心跳
      isReconnection: true, // 是否断开重连
      received: function (data: any) {
        // 监听服务器返回信息
        spinning.value = false;

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
  ws.connect();
};

onMounted(() => {
  initWebSocket();
  initStatus();

  //监听连接状态变化
  watch(
    () => ws.status,
    async (newValue) => {
      if (newValue === "open") {
        isConnect.value = true;
      } else {
        isConnect.value = false;
      }
    }
  );
});
</script>

<style scoped lang="scss">
.dream-index {
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

  .answer {
    color: rgba(255, 223, 252, 1);
    font-size: 1.6rem;
    margin-bottom: 1rem;

    span {
      font-size: 1.3rem;
    }
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
textarea.ant-input.customer-textarea-small {
  --at-apply: w-full h-10rem bg-[#fff] outline-none resize-none border-none;
}
</style>

