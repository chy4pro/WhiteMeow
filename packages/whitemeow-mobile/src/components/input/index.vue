<script setup>
import Eye from "~/login/eye.png";
import EyeActive from "~/login/eye-active.png";
import Close from "~/login/close.png";

import { reactive, ref, onMounted, nextTick } from "vue";

const emit = defineEmits([
  "handleInputEmit",
  "handleSendCodeEmit",
  "handleInputBlurEmit",
]);

const props = defineProps({
  isError: {
    type: Boolean,
  },
  isPsd: {
    type: Boolean,
  },
  isCode: {
    type: Boolean,
  },
  placeholder: {
    type: String,
  },
  isCanSendBool: {
    type: Boolean,
    default: true,
  },
  keyword: {
    type: String,
    default: "",
  },
});

const state = reactive({
  isEyeActive: false,
  isFocus: false,
  isSend: false,
  count: 60,
  timer: null,
});

const inpRef = ref(null);

const handleFocus = () => {
  state.isFocus = true;
};

const handleBlur = () => {
  state.isFocus = false;

  emit("handleInputBlurEmit");
};

const handleChangeEye = () => {
  state.isEyeActive = !state.isEyeActive;

  inpRef.value.focus();
};

const handleInput = (e) => {
  const { value } = e.target;

  emit("handleInputEmit", value);
};

const handleSend = () => {
  if (!props.isCanSendBool) {
    return;
  }

  state.isSend = true;

  state.timer = setInterval(() => {
    if (state.count <= 1) {
      clearInterval(state.timer);
      state.timer = null;
      state.isSend = false;
      state.count = 60;
      return;
    }
    state.count -= 1;
  }, 1000);

  inpRef.value.focus();

  emit("handleSendCodeEmit");
};

const handleClose = () => {
  inpRef.value.value = "";
  inpRef.value.focus();
  emit("handleInputEmit", "");
};

onMounted(() => {
  nextTick(() => {
    inpRef.value.value = props.keyword;
  });
});
</script>

<template>
  <div :class="['comp', state.isFocus && 'active', props.isError && 'err']">
    <input
      :type="props.isPsd ? (state.isEyeActive ? 'text' : 'password') : 'text'"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      :placeholder="props.placeholder"
      ref="inpRef"
    />

    <div class="icon" v-if="props.isPsd">
      <img
        :src="state.isEyeActive ? EyeActive : Eye"
        alt=""
        @click="handleChangeEye"
      />
    </div>

    <div class="icon code" v-if="props.isCode">
      <img @click="handleClose" :src="Close" alt="" />
      <span @click="handleSend" v-if="!state.isSend">获取验证码</span>
      <span class="send" v-else>重新发送 {{ state.count }} S</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
input::input-placeholder {
  color: rgba(0, 0, 0, 0.2);
  font-size: 1.4rem;
  // font-weight: 500;
}
input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.2);
  font-size: 1.4rem;
  // font-weight: 500;
}

input::-moz-placeholder {
  color: rgba(0, 0, 0, 0.2);
  font-size: 1.4rem;
  // font-weight: 500;
}

input::-ms-input-placeholder {
  color: rgba(0, 0, 0, 0.2);
  font-size: 1.4rem;
  // font-weight: 500;
}

.active {
  background-color: #fff !important;
  border-color: rgba(255, 152, 245, 1) !important;
}

.err {
  background-color: #fff !important;
  border-color: rgba(255, 9, 9, 1) !important;
}

.comp {
  height: 100%;
  background-color: rgba(244, 245, 247, 1);
  padding: 1.2rem 1.6rem;
  display: flex;
  justify-content: space-between;
  border: 0.1rem solid transparent;
  border-radius: 0.6rem;

  .icon {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 2rem;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .code {
    width: 20rem;
    justify-content: flex-end;

    img {
      width: 1.6rem;
      height: 1.6rem;
      margin-right: 0.8rem;
    }

    span {
      font-size: 1.4rem;
      color: rgba(0, 0, 0, 1);
      font-weight: 500;
    }

    .send {
      color: rgba(0, 0, 0, 0.4);
    }
  }

  input {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    background-color: transparent;
    color: rgba(0, 0, 0, 1);
    font-weight: 500;
    font-size: 1.6rem;
    box-shadow: 0 0 0px 1000px transparent inset !important;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  }
}
</style>
