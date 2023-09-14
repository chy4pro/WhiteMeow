<script setup>
import { onMounted, onUnmounted } from "vue";

import info from "~/message/info.png";
import success from "~/message/success.png";
import error from "~/message/error.png";
import loading from "~/message/loading.png";
import warn from "~/message/warn.png";

const emit = defineEmits(["handleEmit"]);

const props = defineProps({
  type: {
    type: String,
  },
  text: {
    type: String,
  },
});

const state = {
  info,
  success,
  error,
  loading,
  warn,
};

let timer = null;

onMounted(() => {
  timer = setTimeout(() => {
    emit("handleEmit");
  }, 1500);
});

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>

<template>
  <div class="msg-index">
    <img :src="state[props.type]" alt="" />
    {{ props.text }}
  </div>
</template>

<style scoped lang="scss">
.msg-index {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.4rem;
  font-weight: 700;
  box-shadow: 0px 8px 28px 0px rgba(32, 22, 61, 0.1);
  border-radius: 0.6rem;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  padding: 1.6rem 2.4rem;

  img {
    margin-right: 0.8rem;
    width: 2.4rem;
    height: 2.4rem;
  }
}
</style>
