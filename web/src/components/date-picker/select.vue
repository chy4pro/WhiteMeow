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
  const d = [...e.target.classList];
  if (!d.includes("ta-hidden-select")) {
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
        :src="arrowIcon"
        alt=""
        class="ta-hidden-select"
      />
    </div>
    <div class="dialog ta-scrollbar" v-if="state.isFocus">
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
.ta-scrollbar::-webkit-scrollbar {
  width: 0.6rem;
}

.ta-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 1.5rem;
  background-color: rgba(203, 203, 203, 1) !important;
}

.ta-scrollbar::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0);
}

.wrapper {
  position: relative;
  width: 100%;
  border-radius: 0.6rem;

  .dialog {
    position: absolute;
    width: 100%;
    left: 0;
    top: 4.5rem;
    background-color: #fff;
    z-index: 999;
    box-shadow: 0 0.6rem 2.7rem;
    border-radius: 0.6rem;
    max-height: 18rem;
    overflow-y: scroll;

    .dialog-item {
      height: 3.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-size: 1.4rem;
      font-weight: 500;
      cursor: pointer;
    }

    .focus {
      background-color: rgba(211, 211, 211, 1) !important;
    }

    .dialog-item:hover {
      background-color: rgba(211, 211, 211, 1) !important;
    }
  }

  .main {
    height: 4rem;
    padding: 0 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000;
    font-size: 1.4rem;
    font-weight: 700;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 0.6rem;

    img {
      margin-left: 2rem;
    }
  }

  .active {
    background-color: rgba(255, 223, 252, 1) !important;
    color: rgba(0, 0, 0, 1) !important;
    border-color: rgba(0, 0, 0, 1) !important;
  }
}
</style>