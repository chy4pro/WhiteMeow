<script setup>
import { reactive, defineAsyncComponent, watch } from "vue";

import { fetchUpdatePsd, fetchSetInfo } from "@/api/login";

import { useRouter } from "vue-router";

import { useIndexStore } from "@/store/index";
import { message } from "@/utils/index";

const router = useRouter();
const indexStore = useIndexStore();

const InputComp = defineAsyncComponent(() =>
  import("@/components/input/index.vue")
);

const ErrorTextComp = defineAsyncComponent(() =>
  import("@/components/errorText/index.vue")
);

const type = router.currentRoute.value.query.type;
const mobile = router.currentRoute.value.query.mobile;

const state = reactive({
  password: "",
  passwordErrorBool: false,
  passwordErrorText: "",
  password2: "",
  password2ErrorBool: false,
  password2ErrorText: "",
  isCommitBool: false,
});

watch(
  () => [
    state.passwordErrorBool,
    state.password,
    state.password2ErrorBool,
    state.password2,
  ],
  () => {
    const n = [
      [state.passwordErrorBool, state.password2ErrorBool],
      [state.password, state.password2],
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

const handlePsd = (str, val) => {
  if (str === "1") {
    state.password = val;
    state.passwordErrorBool = false;
    return;
  }

  state.password2 = val;

  if (state.password2 !== state.password) {
    state.password2ErrorBool = true;
    state.password2ErrorText = "两次输入密码不一致";
    return;
  }
  state.password2ErrorBool = false;
};

const handleSetPsd = async () => {
  try {
    const { code, data, msg } = await fetchSetInfo({
      user: indexStore.state.user,
      password: state.password,
      status: 3,
    });

    if (code !== 200) {
      message({
        type: "error",
        text: msg,
      });
      return;
    }

    router.push({
      path: "/login/setProfile",
    });
  } catch (error) {}
};

const handlePsdBlur = (str) => {
  if (str === "1") {
    if (!state.password) {
      state.passwordErrorBool = true;
      state.passwordErrorText = "请输入有效的密码";
      return;
    }
    state.passwordErrorBool = false;
    return;
  }

  if (state.password2 !== state.password) {
    state.password2ErrorBool = true;
    state.password2ErrorText = "两次输入密码不一致";
    return;
  }
  state.password2ErrorBool = false;
};

const handleCommit = async () => {
  if (!type) {
    return;
  }

  if (type === "set") {
    handleSetPsd();
    return;
  }

  try {
    const { code, data, msg } = await fetchUpdatePsd({
      mobile,
      password: state.password,
    });

    if (code !== 200) {
      message({
        type: "error",
        text: msg,
      });
      return;
    }

    if (data.message === "ok") {
      router.push({
        path: "/login",
      });
    }
  } catch (error) {}
};

const handleConfirm = () => {
  if (!state.password) {
    state.passwordErrorBool = true;
    state.passwordErrorText = "请输入密码";
  }

  if (!state.password2) {
    state.password2ErrorBool = true;
    state.password2ErrorText = "请输入密码";
  }

  if (state.password2 !== state.password) {
    state.password2ErrorBool = true;
    state.password2ErrorText = "两次输入密码不一致";
  }

  if (state.isCommitBool) {
    handleCommit();
  }
};
</script>

<template>
  <div class="wrapper">
    <div class="title">{{ type === "set" ? "设置密码" : "重新设置密码" }}</div>
    <div class="item">
      <div class="inp">
        <InputComp
          :isError="state.passwordErrorBool"
          :isPsd="true"
          @handleInputEmit="handlePsd('1', $event)"
          @handleInputBlurEmit="handlePsdBlur('1')"
          placeholder="请输入你的密码"
        />
      </div>
      <ErrorTextComp
        v-if="state.passwordErrorBool"
        :text="state.passwordErrorText"
      />
    </div>
    <div class="item">
      <div class="inp">
        <InputComp
          :isError="state.password2ErrorBool"
          :isPsd="true"
          @handleInputEmit="handlePsd('2', $event)"
          @handleInputBlurEmit="handlePsdBlur('2')"
          placeholder="请再次输入以确认"
        />
      </div>
      <ErrorTextComp
        v-if="state.password2ErrorBool"
        :text="state.password2ErrorText"
      />
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
    font-size: 1.6rem;
    font-weight: 800;
    margin-top: 2.4rem;
    color: #fff;
    font-family: RedHatDisplayBold;
  }

  .active {
    background-color: rgba(0, 0, 0, 1);
  }

  .active:active {
    background-color: rgba(0, 0, 0, 0.8);
  }
}
</style>
