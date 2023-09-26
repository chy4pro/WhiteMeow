<script setup>
import { reactive, defineAsyncComponent, watch, onMounted } from "vue";

import CheckActive from "~/login/check-active.png";

import {
  fetchPicCode,
  fetchCode,
  fetchCodeLogin,
  fetchUserInfo,
  fetchPsdLogin,
} from "@/api/login.js";
import { genId, message } from "@/utils/index";

import { useIndexStore } from "@/store/index";

import { useRouter } from "vue-router";

const indexStore = useIndexStore();
const router = useRouter();

const InputComp = defineAsyncComponent(() =>
  import("@/components/input/index.vue")
);

const ErrorTextComp = defineAsyncComponent(() =>
  import("@/components/errorText/index.vue")
);

const DialogComp = defineAsyncComponent(() =>
  import("@/components/confirmDialog/index.vue")
);

const XyComp = defineAsyncComponent(() => import("../xy/index.vue"));

const state = reactive({
  tab: "1",
  mobile: "",
  mobileErrorBool: false,
  mobileErrorText: "",
  password: "",
  passwordErrorBool: false,
  passwordErrorText: "",
  isRememberBool: false,
  isSubmitBool: false,
  isReadBool: false,
  code: "",
  codeErrorBool: false,
  codeErrorText: "",
  isShowDialog: false,
  isShowXy: false,
  xyCategory: "1",
  picCode: "",
  picCodeErrorBool: false,
  picCodeErrorText: "",
  isCanSend: false,
  captcha: "",
  captcha_id: "",
  captcha_length: 4,
});

watch(
  () => [
    state.mobileErrorBool,
    state.codeErrorBool,
    state.picCodeErrorBool,
    state.passwordErrorBool,
    state.mobile,
    state.code,
    state.picCode,
    state.password,
    state.isReadBool,
  ],
  () => {
    const { tab } = state;
    if (tab === "1") {
      const n = [
        [state.mobileErrorBool, state.codeErrorBool, state.picCodeErrorBool],
        [state.mobile, state.code, state.picCode],
        [state.isReadBool],
      ];

      if (
        n[0].filter((item) => !item).length === n[0].length &&
        n[1].filter((item) => item !== "").length === n[1].length &&
        n[2].includes(true)
      ) {
        state.isSubmitBool = true;
      } else {
        state.isSubmitBool = false;
      }
      return;
    }

    // const n = [
    //   [state.mobileErrorBool, state.passwordErrorBool, state.picCodeErrorBool],
    //   [state.mobile, state.password, state.picCode],
    //   [state.isReadBool],
    // ];

    const n = [
      [state.mobileErrorBool, state.passwordErrorBool],
      [state.mobile, state.password],
      [state.isReadBool],
    ];

    if (
      n[0].filter((item) => !item).length === n[0].length &&
      n[1].filter((item) => item !== "").length === n[1].length &&
      n[2].includes(true)
    ) {
      state.isSubmitBool = true;
    } else {
      state.isSubmitBool = false;
    }
  }
);

watch(
  () => [
    [
      [state.mobileErrorBool, state.picCodeErrorBool],
      [state.mobile, state.picCode],
    ],
  ],
  () => {
    const n = [
      [state.mobileErrorBool, state.picCodeErrorBool],
      [state.mobile, state.picCode],
    ];

    if (
      n[0].filter((item) => !item).length === n[0].length &&
      n[1].filter((item) => item !== "").length === n[1].length
    ) {
      state.isCanSend = true;
    } else {
      state.isCanSend = false;
    }
  }
);

const handleChangeTab = (str) => {
  state.tab = str;

  // state.mobile = "";
  state.code = "";
  state.password = "";
  state.picCode = "";
  state.picCodeErrorBool = false;
  state.mobileErrorBool = false;
  state.codeErrorBool = false;
  state.passwordErrorBool = false;
};

const handleMobile = (str) => {
  state.mobile = str;
  state.mobileErrorBool = false;
};

const handlePsd = (str) => {
  state.password = str;
  state.passwordErrorBool = false;
};

const handleLink = (str) => {
  state.xyCategory = str;
  state.isShowXy = true;
};

const handleCode = (str) => {
  state.code = str;
  state.codeErrorBool = false;
};

const getUserInfo = async () => {
  try {
    const { code, data, msg } = await fetchUserInfo();

    if (code !== 200) {
      message({
        type: "error",
        text: msg,
      });
      return;
    }

    indexStore.handleSetUserInfo(data);
    indexStore.handleSetUser("");

    router.push({
      path: "/chat",
    });
  } catch (err) {}
};

const handleCodeLogin = async () => {
  const { code: codes, mobile, isRememberBool } = state;

  try {
    const { code, data, msg } = await fetchCodeLogin({
      is_login_free: isRememberBool ? 1 : 0,
      mobile,
      code: codes,
      user: genId("userId", 1),
    });

    if (code !== 200) {
      message({
        type: "error",
        text: msg,
      });
      return;
    }

    if (data.status === 1) {
      indexStore.handleSetToken(data.token);
      indexStore.handleSetNewUser(data.user);

      getUserInfo();
      return;
    }

    indexStore.handleSetUser(data.user);
    indexStore.handleSetNewUser(data.user);

    router.push({
      path: "/login/setPsd",
      query: {
        type: "set",
      },
    });
  } catch (error) {}
};

const handlePsdLogin = async () => {
  const { picCode, captcha_id, isRememberBool, mobile, password } = state;

  try {
    const { code, data, msg } = await fetchPsdLogin({
      captcha: picCode,
      captcha_id,
      is_login_free: isRememberBool ? 1 : 0,
      mobile,
      password,
    });

    if (code !== 200) {
      message({
        type: "error",
        text: msg,
      });
      return;
    }

    indexStore.handleSetToken(data.token);
    indexStore.handleSetNewUser(data.user);
    getUserInfo();
  } catch (error) {}
};

const handleLogin = () => {
  const { tab } = state;

  if (tab === "1") {
    if (!state.mobile) {
      state.mobileErrorBool = true;
      state.mobileErrorText = "请输入手机号";
    }

    if (!state.picCode) {
      state.picCodeErrorBool = true;
      state.picCodeErrorText = "请输入图片验证码";
    }

    if (!state.code) {
      state.codeErrorBool = true;
      state.codeErrorText = "请输入验证码";
    }

    if (!state.isReadBool) {
      state.isShowDialog = true;
    }

    if (state.isSubmitBool) {
      handleCodeLogin();
    }

    return;
  }

  if (!state.mobile) {
    state.mobileErrorBool = true;
    state.mobileErrorText = "请输入手机号";
  }

  if (!state.password) {
    state.passwordErrorBool = true;
    state.passwordErrorText = "请输入密码";
  }

  if (!state.picCode) {
    state.picCodeErrorBool = true;
    state.picCodeErrorText = "请输入图片验证码";
  }

  if (!state.isReadBool) {
    state.isShowDialog = true;
  }

  if (state.isSubmitBool) {
    handlePsdLogin();
  }
};

const handleSendCode = async () => {
  if (state.mobileErrorBool || state.picCodeErrorBool) {
    return;
  }

  const { picCode, captcha_id, mobile } = state;

  try {
    const { code, data, msg } = await fetchCode({
      captcha: picCode,
      captcha_id,
      mobile,
    });

    if (code !== 200) {
      message({
        type: "error",
        text: msg,
      });
      return;
    }
  } catch (error) {}
};

const handleMobileBlur = () => {
  const bool = /^1[3456789]\d{9}$/.test(state.mobile);

  if (!bool) {
    state.mobileErrorBool = true;
    state.mobileErrorText = "请输入有效的手机号码";
  }
};

const handleCodeBlur = () => {
  if (!state.code) {
    state.codeErrorBool = true;
    state.codeErrorText = "请输入有效的验证码";
    return;
  }

  state.codeErrorBool = false;
};

const handleDialog = (bool) => {
  state.isShowDialog = false;

  if (bool) {
    state.isReadBool = true;
  }
};

const handlePsdBlur = () => {
  if (!state.password) {
    state.passwordErrorBool = true;
    state.passwordErrorText = "请输入有效的密码";
    return;
  }

  state.passwordErrorBool = false;
};

const handleXyBack = () => {
  state.isShowXy = false;
};

const handleChangePicCode = async () => {
  try {
    const { code, data, msg } = await fetchPicCode();

    if (code !== 200) {
      message({
        type: "error",
        text: msg,
      });
      return;
    }

    state.captcha = data.captcha;
    state.captcha_id = data.captcha_id;
    state.captcha_length = data.captcha_length;
  } catch (error) {}
};

const handlePicCode = (str) => {
  state.picCode = str;
  state.picCodeErrorBool = false;
};

const handlePicBlur = () => {
  if (state.picCode.length !== state.captcha_length) {
    state.picCodeErrorBool = true;
    state.picCodeErrorText = `图片验证码长度为${state.captcha_length}`;
    return;
  }

  state.picCodeErrorBool = false;
};

const handleForget = () => {
  router.push({
    path: "/login/forget",
  });
};

onMounted(() => {
  handleChangePicCode();
});
</script>

<template>
  <div class="wrapper">
    <XyComp
      v-if="state.isShowXy"
      :category="state.xyCategory"
      @handleBackEmit="handleXyBack"
    />

    <DialogComp
      v-if="state.isShowDialog"
      @handleEmit="handleDialog"
      title="
    <div>用户协议和隐私条款</div>
    "
      content="
    <div>请您阅读并同意 <span style='font-weight: 600;text-decoration: underline;'>用户协议</span> 和 <span style='font-weight: 600;text-decoration: underline;'>隐私政策</span></div>
    "
    />

    <div class="tab-wrapper">
      <div :class="['tab-item', state.tab === '1' && 'tab-active']">
        <span @click="handleChangeTab('1')">验证码登录</span>
        <span v-if="state.tab === '1'" class="line" />
      </div>
      <div :class="['tab-item', state.tab === '2' && 'tab-active']">
        <span @click="handleChangeTab('2')">密码登录</span>
        <span v-if="state.tab === '2'" class="line" />
      </div>
    </div>

    <template v-if="state.tab === '1'">
      <div class="inp-wrapper">
        <div class="inp">
          <InputComp
            @handleInputEmit="handleMobile"
            @handleInputBlurEmit="handleMobileBlur"
            :isError="state.mobileErrorBool"
            :keyword="state.mobile"
            placeholder="请输入电话号码"
          />
        </div>
        <ErrorTextComp
          v-if="state.mobileErrorBool"
          :text="state.mobileErrorText"
        />
      </div>

      <div class="inp-wrapper">
        <div class="inp">
          <div
            style="display: flex; justify-content: space-between; height: 100%"
          >
            <InputComp
              @handleInputEmit="handlePicCode"
              @handleInputBlurEmit="handlePicBlur"
              :isError="state.picCodeErrorBool"
              placeholder="请输入图片验证码"
            />

            <div class="pic-code" @click="handleChangePicCode">
              <img :src="state.captcha" alt="" />
            </div>
          </div>
        </div>
        <ErrorTextComp
          v-if="state.picCodeErrorBool"
          :text="state.picCodeErrorText"
        />
      </div>

      <div class="inp-wrapper">
        <div class="inp">
          <InputComp
            :isError="state.codeErrorBool"
            :isCode="true"
            @handleInputEmit="handleCode"
            @handleSendCodeEmit="handleSendCode"
            @handleInputBlurEmit="handleCodeBlur"
            placeholder="请输入短信验证码"
            :isCanSendBool="state.isCanSend"
          />
        </div>
        <ErrorTextComp v-if="state.codeErrorBool" :text="state.codeErrorText" />
      </div>
    </template>

    <template v-if="state.tab === '2'">
      <div class="inp-wrapper">
        <div class="inp">
          <InputComp
            @handleInputEmit="handleMobile"
            @handleInputBlurEmit="handleMobileBlur"
            :isError="state.mobileErrorBool"
            :keyword="state.mobile"
            placeholder="请输入电话号码"
          />
        </div>
        <ErrorTextComp
          v-if="state.mobileErrorBool"
          :text="state.mobileErrorText"
        />
      </div>

      <div class="inp-wrapper">
        <div class="inp">
          <InputComp
            :isError="state.passwordErrorBool"
            :isPsd="true"
            @handleInputEmit="handlePsd"
            @handleInputBlurEmit="handlePsdBlur"
            placeholder="请输入你的密码"
          />
        </div>

        <ErrorTextComp
          v-if="state.passwordErrorBool"
          :text="state.passwordErrorText"
        />
      </div>

      <!-- <div class="inp-wrapper">
        <div class="inp">
          <div
            style="display: flex; justify-content: space-between; height: 100%"
          >
            <InputComp
              @handleInputEmit="handlePicCode"
              @handleInputBlurEmit="handlePicBlur"
              :isError="state.picCodeErrorBool"
              placeholder="请输入图片验证码"
            />

            <div class="pic-code" @click="handleChangePicCode">
              <img :src="state.captcha" alt="" />
            </div>
          </div>
        </div>
        <ErrorTextComp
          v-if="state.picCodeErrorBool"
          :text="state.picCodeErrorText"
        />
      </div> -->
    </template>

    <div class="sel">
      <div class="left" @click="state.isRememberBool = !state.isRememberBool">
        <img
          class="check-img"
          v-if="state.isRememberBool"
          :src="CheckActive"
          alt=""
        />
        <span class="check" v-else />
        自动登录
      </div>
      <div class="right" v-if="state.tab === '2'" @click="handleForget">
        忘记密码？
      </div>
    </div>

    <div
      :class="['submit', state.isSubmitBool && 'btn-active']"
      @click="handleLogin"
    >
      登录/注册
    </div>

    <div class="xy" @click="state.isReadBool = !state.isReadBool">
      <img
        class="check-img"
        v-if="state.isReadBool"
        :src="CheckActive"
        alt=""
      />
      <span class="check" v-else />
      我已阅读并同意 <span @click.stop="handleLink('1')">《用户协议》</span> 和
      <span @click.stop="handleLink('2')">《隐私条款》</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  position: relative;

  .xy {
    display: flex;
    align-items: center;
    margin-top: 1.6rem;
    color: rgba(0, 0, 0, 1);
    font-size: 1.4rem;

    span {
      color: rgba(55, 74, 245, 1);
    }
  }
  .check {
    display: inline-block;
    width: 1.6rem;
    height: 1.6rem;
    margin-right: 0.8rem;
    border-radius: 0.2rem;
    border: 1px solid rgba(143, 143, 143, 1);
  }

  .check-img {
    width: 1.6rem;
    height: 1.6rem;
    margin-right: 0.8rem;
  }

  .submit {
    border-radius: 0.6rem;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    font-weight: 800;
    color: #fff;
    height: 4.4rem;
    margin-top: 4rem;
    font-family: RedHatDisplayBold;
  }
  .btn-active {
    background-color: rgba(0, 0, 0, 1);
  }

  .btn-active:active {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .sel {
    display: flex;
    justify-content: space-between;
    color: rgba(0, 0, 0, 1);
    font-size: 1.4rem;
    font-weight: 500;

    .right {
      text-decoration: underline;
    }

    .left {
      display: flex;
      align-items: center;
    }
  }

  .inp-wrapper {
    margin-bottom: 1.6rem;

    .inp {
      height: 4.8rem;

      .pic-code {
        width: 10rem;
        height: 100%;
        background-color: rgba(244, 245, 247, 1);
        border-radius: 0.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 5rem;

        img {
          max-height: 100%;
          max-width: 100%;
          display: block;
        }
      }
    }
  }

  .tab-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 2.4rem;

    .tab-item {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      color: rgba(0, 0, 0, 0.5);
      font-size: 1.6rem;
      font-weight: 500;
      flex-direction: column;
      transition: all 0.3s;

      span {
        display: inline-block;
        height: 1.8rem;
        line-height: 1.8rem;
      }

      .line {
        display: inline-block;
        width: 3.2rem;
        height: 0.4rem;
        background-color: rgba(255, 106, 240, 1);
        border-radius: 4rem;
        margin-top: 0.8rem;
      }
    }

    .tab-active {
      font-size: 2.2rem;
      color: rgba(0, 0, 0, 1);
      font-weight: 900;
      justify-content: space-between;
    }
  }
}
</style>
