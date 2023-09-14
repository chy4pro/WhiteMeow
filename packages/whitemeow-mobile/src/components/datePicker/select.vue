<script setup>
import { reactive, onMounted } from "vue";

import Left from "~/login/left.png";

const emit = defineEmits(["handleEmit"]);

const props = defineProps({
  year: {
    type: String,
  },
  month: {
    type: String,
  },
});

const state = reactive({
  year: [],
  y: "",
  m: "",
  text: "",
  isYearBool: true,
  month: [
    {
      label: "一月",
      value: "1",
    },
    {
      label: "二月",
      value: "2",
    },
    {
      label: "三月",
      value: "3",
    },
    {
      label: "四月",
      value: "4",
    },
    {
      label: "五月",
      value: "5",
    },
    {
      label: "六月",
      value: "6",
    },
    {
      label: "七月",
      value: "7",
    },
    {
      label: "八月",
      value: "8",
    },
    {
      label: "九月",
      value: "9",
    },
    {
      label: "十月",
      value: "10",
    },
    {
      label: "十一月",
      value: "11",
    },
    {
      label: "十二月",
      value: "12",
    },
  ],
});

const handleYear = (type, y) => {
  const x = type === "-" ? y - 10 : y + 10;
  const a = [];

  for (let i = y; type === "-" ? i > x : i < x; type === "-" ? i-- : i++) {
    a.push({
      label: i,
      value: String(i),
      active: String(state.y) === String(i) ? true : false,
    });
  }

  if (type === "-") {
    a.reverse();
  }

  state.text = `${a[0].label} - ${a[a.length - 1].label}`;

  state.year = a;
};

const handleGo = (type) => {
  if (state.isYearBool) {
    if (type === "-") {
      handleYear("-", Number(state.year[0].value));
      return;
    }

    handleYear("+", Number(state.year[state.year.length - 1].value));

    return;
  }

  if (type === "-") {
    state.y -= 1;
  } else {
    state.y = Number(state.y) + 1;
  }

  state.text = state.y;
};

const handleSel = (val) => {
  if (state.isYearBool) {
    state.y = val;
    state.text = val;
    state.isYearBool = false;

    return;
  }

  state.m = val;

  emit("handleEmit", {
    y: state.y,
    m: state.m,
  });
};

onMounted(() => {
  state.y = props.year;
  state.m = props.month;
  
  handleYear("-", Number(props.year));
});
</script>

<template>
  <div class="select-index">
    <div class="top">
      <img @click="handleGo('-')" :src="Left" alt="" />
      <span>{{ state.text }}</span>
      <img @click="handleGo('+')" :src="Left" alt="" />
    </div>

    <div class="bottom">
      <div
        :class="[
          'item',
          item.active && 'active',
          item.value === state.m && 'active',
        ]"
        v-for="(item, idx) in state.isYearBool ? state.year : state.month"
        :key="idx"
        @click="handleSel(item.value)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.select-index {
  .bottom {
    padding: 0 3.5rem;
    display: flex;
    flex-wrap: wrap;

    .item {
      width: 25%;
      height: 6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(106, 106, 109, 1);
      font-size: 1.4rem;
    }
    .active {
      color: rgba(255, 106, 240, 1);
      font-weight: 700;
    }
  }
  .top {
    height: 2.4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgb(2, 2, 2);
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 4rem;

    img {
      width: 2.4rem;
      height: 2.4rem;
    }

    img:nth-child(3) {
      transform: rotate(180deg);
    }
  }
}
</style>
