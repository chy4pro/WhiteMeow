<script setup>
import { reactive, watch, onMounted, onUnmounted } from "vue";

import arrowIcon from "@/assets/images/login/arrow.png";
import arrowActiveIcon from "@/assets/images/login/arrow-active.png";

const emit = defineEmits(["handleSelectEmit"]);

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
});

const state = reactive({
  isFocus: false,
});

const handleFocus = () => {
  state.isFocus = !state.isFocus;
};

const handleSelect = (str) => {
  emit("handleSelectEmit", String(str));

  state.isFocus = false;
};

const handleListen = (e) => {
  const d = [...e.target.classList]
    if (!d.includes('ta-hidden-select')) {
        state.isFocus = false;
    }
};

onMounted(() => {
  document.addEventListener("click", handleListen, false);
});

onUnmounted(() => {
  document.removeEventListener("click", handleListen, false);
});
</script>

<template>
  <div class="wrapper">
    <div
      @click="handleFocus"
      :class="['main', state.isFocus && 'active', 'ta-hidden-select']"
    >
      {{ item }}
      <img
        width="16"
        height="16"
        :src="state.isFocus ? arrowActiveIcon : arrowIcon"
        alt=""
        class="ta-hidden-select"
      />
    </div>
    <div class="dialog" v-if="state.isFocus">
      <div
        :class="[
          'dialog-item',
          item === String(el) && 'focus',
          'ta-hidden-select',
        ]"
        @click="handleSelect(el)"
        v-for="(el, idx) in data"
        :key="idx"
      >
        {{ el }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  position: relative;
  width: 100%;
  border-radius: 6px;

  .dialog {
    position: absolute;
    width: 100%;
    left: 0;
    top: 45px;
    background-color: #fff;
    z-index: 999;
    box-shadow: 0 6px 27px;
    border-radius: 6px;
    max-height: 180px;
    overflow-y: scroll;

    .dialog-item {
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }

    .focus {
      background-color: rgba(211, 211, 211, 1) !important;
    }

    .dialog-item:hover {
      background-color: rgba(255, 223, 252, 0.2) !important;
    }
  }

  .main {
    height: 40px;
    padding: 0 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    border: 1px solid transparent;

    img {
      margin-left: 20px;
    }
  }

  .active {
    background-color: rgba(255, 223, 252, 0.2) !important;
    color: rgba(255, 106, 240, 1) !important;
    border-color: rgba(255, 106, 240, 1) !important;
  }
}
</style>