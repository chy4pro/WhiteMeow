<script setup>
import { reactive, nextTick, defineAsyncComponent } from "vue";

import Left from "~/login/left.png";
import Left2 from "~/login/left2.png";

const SelectComp = defineAsyncComponent(() => import("./select.vue"));

const emit = defineEmits(["handleEmit"]);

const props = defineProps({
  isShow: {
    type: Boolean,
  },
  date: {
    type: String,
  },
});

const state = reactive({
  months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  years: [],
  month: "",
  year: "",
  day: "",
  isToday: false,
  isShowSelBool: false,
});

const handleClose = (str) => {
  emit("handleEmit", str);
};

function dateDayFunc(years, n) {
  let date = new Date(years);

  date.setMonth(Number(n), 1);
  let weenkAwwNum = date.getDay(); // 获取当天周几

  // 当月总共天数
  date.setMonth(Number(n) + 1, 0);
  var newAww = date.getDate();

  // 上月总共天数
  date.setMonth(Number(n), 0);
  let oldAww = date.getDate();

  // 下月总共天数
  date.setMonth(Number(n) + 2, 0);
  let downAww = date.getDate();

  const oldAwwArr = [];
  for (let i = 1; i <= oldAww; i++) {
    oldAwwArr.push({ day: i });
  }

  const newAwwArr = [];

  const month = props.date ? props.date.split("/")[1] : "";
  const day = props.date ? props.date.split("/")[2] : "";

  for (let i = 1; i <= newAww; i++) {
    let bool = false;
    if (month) {
      if (String(month - 1) === String(n)) {
        if (state.isToday) {
          const dd = new Date().getDate();
          if (String(i) === String(dd)) {
            bool = true;

            state.isToday = false;
          }
        } else {
          if (String(i) === String(day)) {
            bool = true;
          }
        }
      } else {
        if (state.isToday) {
          const dd = new Date().getDate();
          if (String(i) === String(dd)) {
            bool = true;

            state.isToday = false;
          }
        }
      }
    } else {
      const dd = new Date().getDate();
      const mm = new Date().getMonth();

      if (String(i) === String(dd) && String(n) === String(mm)) {
        bool = true;
      }
    }

    newAwwArr.push({
      day: i,
      isActive: bool ? true : false,
    });
  }

  const downAwwArr = [];
  for (let i = 1; i <= downAww; i++) {
    downAwwArr.push({ day: i });
  }

  return { oldAwwArr, newAwwArr, downAwwArr, weenkAwwNum };
}

// 获取当前日期
function getWeenkDays(years, n) {
  const { oldAwwArr, newAwwArr, downAwwArr, weenkAwwNum } = dateDayFunc(
    years,
    n
  );

  const daysArrNew = [];

  // 不全上下月
  if (weenkAwwNum !== 0 && weenkAwwNum !== 1) {
    // 周二到周六
    const fistArr = oldAwwArr.slice(-weenkAwwNum + 1);
    fistArr.forEach((item) => {
      item.disabled = true;
    });
    daysArrNew.push(...fistArr);
    daysArrNew.push(...newAwwArr);
    const lens =
      7 - (daysArrNew?.length - Math.floor(daysArrNew?.length / 7) * 7);
    const lastArr = downAwwArr.slice(0, lens);
    lastArr.forEach((item) => {
      item.disabled = true;
    });
    daysArrNew.push(...lastArr);
  } else if (weenkAwwNum === 1) {
    // 周一
    daysArrNew.push(...newAwwArr);
    const lens =
      7 - (daysArrNew?.length - Math.floor(daysArrNew?.length / 7) * 7);
    const lastArr = downAwwArr.slice(0, lens);
    lastArr.forEach((item) => {
      item.disabled = true;
    });
    daysArrNew.push(...lastArr);
  } else if (weenkAwwNum === 0) {
    // 周天
    const fistArr = oldAwwArr.slice(-6);
    fistArr.forEach((item) => {
      item.disabled = true;
    });
    daysArrNew.push(...fistArr);
    daysArrNew.push(...newAwwArr);
    const lens =
      7 - (daysArrNew?.length - Math.floor(daysArrNew?.length / 7) * 7);
    const lastArr = downAwwArr.slice(0, lens);
    lastArr.forEach((item) => {
      item.disabled = true;
    });
    daysArrNew.push(...lastArr);
  }

  renderDom(daysArrNew);
}

// 页面渲染
function renderDom(data) {
  const daysDom = document.querySelector(".days");
  daysDom.innerHTML = "";

  data.forEach((item) => {
    const domSpan = document.createElement("div");
    domSpan.setAttribute("noclick", item.disabled ? item.disabled : "");

    domSpan.style.color = item.disabled ? "rgba(213, 213, 214, 1)" : "";
    domSpan.style.height = "4.65rem";
    domSpan.style.width = "4.65rem";
    domSpan.style.display = "flex";
    domSpan.style.justifyContent = "center";
    domSpan.style.alignItems = "center";

    domSpan.innerHTML = item.day;

    if (!item.disabled && item.isActive) {
      domSpan.style.backgroundColor = "rgba(255, 223, 252, 1)";
      domSpan.style.color = "rgba(0, 0, 0, 1)";
      domSpan.style.borderRadius = "50%";
      domSpan.style.fontWeight = 700;
    }

    daysDom.appendChild(domSpan);
  });
}

const handleSelDate = (str) => {
  state.day = str;

  emit("handleEmit", `${state.year}/${state.month}/${state.day}`);
};

const handleInit = () => {
  const yearArr = [];
  const y = props.date ? props.date.split("/")[0] : new Date().getFullYear();
  const m = props.date ? props.date.split("/")[1] - 1 : new Date().getMonth();

  state.year = y;
  state.month = m + 1;
  state.day = props.date ? props.date.split("/")[2] : new Date().getDate();

  for (let i = y - 10; i <= y; i++) {
    yearArr.push(i);
  }

  state.years = yearArr;

  getWeenkDays(String(y), m);

  const daysDom = document.querySelector(".days");
  daysDom.addEventListener("click", function (e) {
    const clickDays = document.querySelectorAll(".days div");

    if (e.target.tagName === "DIV" && e.target.getAttribute("noclick")) {
      return;
    }

    clickDays.forEach((item) => {
      if (!item.getAttribute("noclick")) {
        item.style.backgroundColor = "#fff";
        item.style.color = "rgba(106, 106, 109, 1)";
        item.style.borderRadius = "0";
        item.style.fontWeight = 400;
      }
    });

    if (e.target.tagName === "DIV" && !e.target.getAttribute("noclick")) {
      const item = e.target;

      item.style.backgroundColor = "rgba(255, 223, 252, 1)";
      item.style.color = "rgba(0, 0, 0, 1)";
      item.style.borderRadius = "50%";
      item.style.fontWeight = 700;

      handleSelDate(item.innerHTML);
    }
  });
};

const handleGo = (type, name) => {
  if (type === "+") {
    if (name === "m") {
      if (state.month >= 12) {
        state.year = Number(state.year) + 1;
        state.month = 1;
      } else {
        state.month = Number(state.month) + 1;
      }
    } else {
      state.year = Number(state.year) + 1;
    }

    getWeenkDays(String(state.year), state.month - 1);
    return;
  }

  if (name === "m") {
    if (state.month <= 1) {
      state.year = Number(state.year) - 1;
      state.month = 12;
    } else {
      state.month = Number(state.month) - 1;
    }
  } else {
    state.year = Number(state.year) - 1;
  }

  getWeenkDays(String(state.year), state.month - 1);
};

const handleSel = () => {
  state.isShowSelBool = true;
};

const handleSelEmit = (obj) => {
  state.isShowSelBool = false;
  state.year = obj.y;
  state.month = Number(obj.m);

  getWeenkDays(String(state.year), state.month - 1);
};

watch(
  () => props.isShow,
  (n) => {
    if (n) {
      nextTick(() => {
        state.isShowSelBool = false;

        handleInit();
      });
    }
  }
);
</script>

<template>
  <div class="ta-picker" v-if="props.isShow" @click="handleClose(false)">
    <div class="main" @click.stop v-if="state.isShowSelBool">
      <SelectComp
        @handleEmit="handleSelEmit"
        :year="String(state.year)"
        :month="String(state.month)"
      />
    </div>

    <div class="main" @click.stop v-show="!state.isShowSelBool">
      <div class="sel-top">
        <div class="left">
          <img @click.stop="handleGo('-', 'y')" :src="Left2" alt="" />
          <img @click.stop="handleGo('-', 'm')" :src="Left" alt="" />
        </div>
        <div @click="handleSel">
          <span>{{ state.year }} 年 </span>
          <span>{{ state.month }} 月</span>
        </div>
        <div class="right">
          <img @click.stop="handleGo('+', 'y')" :src="Left2" alt="" />
          <img @click.stop="handleGo('+', 'm')" :src="Left" alt="" />
        </div>
      </div>

      <div class="calendar">
        <ul class="week">
          <li>周一</li>
          <li>周二</li>
          <li>周三</li>
          <li>周四</li>
          <li>周五</li>
          <li>周六</li>
          <li>周日</li>
        </ul>
        <div class="days"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ta-picker {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  z-index: 3;
  display: flex;
  align-items: flex-end;

  .main {
    height: 37.5rem;
    background-color: #fff;
    box-shadow: 0px -3px 7px 0px rgba(162, 117, 152, 0.25);
    border-top-left-radius: 0.6rem;
    border-top-right-radius: 0.6rem;
    width: 100%;
    padding: 2.4rem;

    .calendar {
      .week {
        display: flex;

        li {
          flex: 1;
          display: flex;
          height: 4.2rem;
          align-items: center;
          justify-content: center;
          color: rgba(0, 0, 0, 0.4);
          font-size: 1.2rem;
          font-weight: 500;
        }
      }

      .days {
        display: flex;
        flex-wrap: wrap;
        color: rgba(106, 106, 109, 1);
        font-size: 1.4rem;
      }
    }

    .sel-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 2.4rem;
      color: rgba(2, 2, 2, 1);
      font-size: 1.6rem;
      font-weight: 700;

      img {
        width: 2.4rem;
        height: 2.4rem;
      }

      .right {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
