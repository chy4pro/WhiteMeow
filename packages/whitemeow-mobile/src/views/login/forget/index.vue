<script setup>
import { reactive, defineAsyncComponent, watch } from "vue";

import { useRouter } from "vue-router";

import { fetchCode, fetchCheckCode } from "@/api/login";
import { message } from "@/utils/index";

const router = useRouter();

const InputComp = defineAsyncComponent(() =>
  import("@/components/input/index.vue")
);

const ErrorTextComp = defineAsyncComponent(() =>
  import("@/components/errorText/index.vue")
);

const state = reactive({
  mobile: "",
  mobileErrorBool: false,
  mobileErrorText: "",
  code: "",
  codeErrorBool: false,
  codeErrorText: "",
  isCommitBool: false,
});

watch(
  () => [state.mobileErrorBool, state.mobile, state.codeErrorBool, state.code],
  () => {
    const n = [
      [state.mobileErrorBool, state.codeErrorBool],
      [state.mobile, state.code],
    ];

    if (
      n[0].filter((item) => !item).length === n[0].length &&
      n[1].filter((item) => item !== "").length === n[1].length
    ) {
      state.isCommitBool = true;
    } else {
      state.isCommitBool = false;
    }
  }
);

const handleInp = (str, val) => {
  if (str === "1") {
    state.mobile = val;
    state.mobileErrorBool = false;
    return;
  }

  state.code = val;
  state.codeErrorBool = false;
};

const handleBlur = (str) => {
  if (str === "1") {
    const bool = /^1[3456789]\d{9}$/.test(state.mobile);

    if (!bool) {
      state.mobileErrorBool = true;
      state.mobileErrorText = "请输入有效的手机号码";
      return;
    }

    state.mobileErrorBool = false;
    return;
  }

  if (!state.code) {
    state.codeErrorBool = true;
    state.codeErrorText = "请输入有效的验证码";
    return;
  }
  state.codeErrorBool = false;
};

const handleCommit = async () => {
  const { code: codes, mobile } = state;

  try {
    const { code, data, msg } = await fetchCheckCode({ code: codes, mobile });

    if (code !== 200) {
      message({
        type: "error",
        text: msg,
      });
      return;
    }

    if (data.data) {
      router.push({
        path: "/login/setPsd",
        query: {
          type: "reset",
          mobile,
        },
      });
    }
  } catch (error) {}
};

const handleConfirm = () => {
  if (!state.mobile) {
    state.mobileErrorBool = true;
    state.mobileErrorText = "请输入手机号码";
  }

  if (!state.code) {
    state.codeErrorBool = true;
    state.codeErrorText = "请输入有效的验证码";
  }

  if (state.isCommitBool) {
    handleCommit();
  }
};

const handleSendCode = async () => {
  if (state.mobileErrorBool) {
    return;
  }

  const { mobile } = state;

  try {
    const { code, msg } = await fetchCode({ mobile });

    if (code !== 200) {
      message({
        type: "error",
        text: msg,
      });
      return;
    }
  } catch (error) {}
};
</script>

<template>
  <div class="wrapper">
    <div class="title">忘记密码</div>
    <div class="item">
      <div class="inp">
        <InputComp
          :isError="state.mobileErrorBool"
          @handleInputEmit="handleInp('1', $event)"
          @handleInputBlurEmit="handleBlur('1')"
          placeholder="请输入手机号码"
        />
      </div>
      <ErrorTextComp
        v-if="state.mobileErrorBool"
        :text="state.mobileErrorText"
      />
    </div>
    <div class="item">
      <div class="inp">
        <InputComp
          :isError="state.codeErrorBool"
          :isCode="true"
          @handleInputEmit="handleInp('2', $event)"
          @handleSendCodeEmit="handleSendCode"
          @handleInputBlurEmit="handleBlur('2')"
          placeholder="请输入短信验证码"
          :isCanSendBool="!state.mobileErrorBool && state.mobile ? true : false"
        />
      </div>
      <ErrorTextComp v-if="state.codeErrorBool" :text="state.codeErrorText" />
    </div>

    <div
      :class="['btn', state.isCommitBool && 'active']"
      @click="handleConfirm"
    >
      确认
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  .title {
    font-size: 2rem;
    font-weight: 700;
    color: rgba(0, 0, 0, 1);
    height: 1.8rem;
    line-height: 1.8rem;
    margin-bottom: 3.5rem;
  }

  .item {
    margin-bottom: 1.6rem;

    .inp {
      height: 4.8rem;
    }
  }

  .btn {
    background-color: rgba(0, 0, 0, 0.4);
    height: 4.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.6rem;
    font-size: 1.4rem;
    font-weight: 700;
    margin-top: 2.4rem;
    color: #fff;
  }

  .active {
    background-color: rgba(0, 0, 0, 1);
  }

  .active:active {
    background-color: rgba(0, 0, 0, 0.8);
  }
}
</style>
