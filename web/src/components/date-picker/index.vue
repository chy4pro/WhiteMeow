<script setup>
import { reactive, watch, onMounted, defineAsyncComponent } from "vue";

const SelectComp = defineAsyncComponent(() =>
  import("@/components/date-picker/select.vue")
);

const emit = defineEmits(["handleCloseEmit"]);

const props = defineProps({
  isShow: {
    type: Boolean,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
});

watch(
  () => props.isShow,
  (n) => {
    // console.log(props);
  },
  {
    immediate: true,
  }
);

const state = reactive({
  y: "",
  m: "",
  d: "",
  yData: [],
  mData: [],
});

const handleClose = () => {
  emit("handleCloseEmit", {
    y: state.y,
    m: String(Number(state.m) + 1),
    d: state.d,
  });
};

const initDatePicker = () => {
  // 日历
  let daysArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const yearArr = [];

  const y = props.year ? Number(props.year) : new Date().getFullYear();
  const m = props.month ? Number(props.month - 1) : new Date().getMonth();
  const d = props.day ? props.day : new Date().getDate();

  for (let i = y - 40; i <= y; i++) {
    yearArr.push(i);
  }

  for (let i = y + 1; i < y + 1; i++) {
    yearArr.push(i);
  }

  state.yData = yearArr;
  state.mData = daysArr;
  state.y = String(y);
  state.m = String(m);
  state.d = String(d);

  const daysDom = document.querySelector(".days");

  getWeenkDays(String(y), m); // 触发

  // 点击事件
  daysDom.addEventListener("click", function (e) {
    const clickDays = document.querySelectorAll(".days span");
    clickDays.forEach((item) => {
      item.classList.remove("active");
    });

    if (e.target.tagName === "SPAN" && !e.target.getAttribute("noclick")) {
      e.target.classList.add("active");

      state.d = e.target.innerHTML;
    }
  });
};

const handleMonthEmit = (str) => {
  state.m = String(Number(str) - 1);

  getWeenkDays(state.y, state.m);
};

const handleYearEmit = (str) => {
  state.y = str;

  getWeenkDays(state.y, state.m);
};

// 页面渲染
function renderDom(data) {
  const daysDom = document.querySelector(".days");

  daysDom.innerHTML = "";
  data.forEach((item) => {
    const domSpan = document.createElement("div");
    domSpan.className = item.color ? item.color : "";
    domSpan.setAttribute("noclick", item.color ? item.color : "");

    if (item.color) {
      domSpan.innerHTML = item.day;
    } else {
      domSpan.innerHTML = `<span class="wisas ${item.isActive && "active"}">${
        item.day
      }</span>`;
    }

    daysDom.appendChild(domSpan);
  });
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
      item.color = "gay";
    });
    daysArrNew.push(...fistArr);
    daysArrNew.push(...newAwwArr);
    const lens =
      7 - (daysArrNew?.length - Math.floor(daysArrNew?.length / 7) * 7);
    const lastArr = downAwwArr.slice(0, lens);
    lastArr.forEach((item) => {
      item.color = "gay";
    });
    daysArrNew.push(...lastArr);
  } else if (weenkAwwNum === 1) {
    // 周一
    daysArrNew.push(...newAwwArr);
    const lens =
      7 - (daysArrNew?.length - Math.floor(daysArrNew?.length / 7) * 7);
    const lastArr = downAwwArr.slice(0, lens);
    lastArr.forEach((item) => {
      item.color = "gay";
    });
    daysArrNew.push(...lastArr);
  } else if (weenkAwwNum === 0) {
    // 周天
    const fistArr = oldAwwArr.slice(-6);
    fistArr.forEach((item) => {
      item.color = "gay";
    });
    daysArrNew.push(...fistArr);
    daysArrNew.push(...newAwwArr);
    const lens =
      7 - (daysArrNew?.length - Math.floor(daysArrNew?.length / 7) * 7);
    const lastArr = downAwwArr.slice(0, lens);
    lastArr.forEach((item) => {
      item.color = "gay";
    });
    daysArrNew.push(...lastArr);
  }

  renderDom(daysArrNew);
}

// 获取上月 当月 下月数据 合并当前月份展示数据
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
  for (let i = 1; i <= newAww; i++) {
    let bool = false;

    if (state.d) {
      if (
        String(i) === String(state.d) &&
        String(Number(state.m) + 1) === props.month
      ) {
        bool = true;
      }
    } else {
      if (
        i === new Date().getDate() &&
        String(new Date().getMonth()) === String(n)
      ) {
        bool = true;
      }
    }

    newAwwArr.push({
      day: i,
      isActive: bool,
    });
  }
  const downAwwArr = [];
  for (let i = 1; i <= downAww; i++) {
    downAwwArr.push({ day: i });
  }

  return { oldAwwArr, newAwwArr, downAwwArr, weenkAwwNum };
}

onMounted(() => {
  initDatePicker();
});
</script>

<template>
  <div class="wrapper">
    <div class="ta-select">
      <div class="n n1">
        <SelectComp
          @handleSelectEmit="handleMonthEmit"
          :data="state.mData"
          :item="String(Number(state.m) + 1)"
        />
      </div>
      <div class="n">
        <SelectComp
          @handleSelectEmit="handleYearEmit"
          :data="state.yData"
          :item="state.y"
        />
      </div>
    </div>
    <div class="calendar">
      <ul class="week">
        <li>Mo</li>
        <li>Tu</li>
        <li>We</li>
        <li>Th</li>
        <li>Fir</li>
        <li>Sat</li>
        <li>Sun</li>
      </ul>
      <div class="days"></div>
    </div>

    <div class="date-picker-confirm" @click="handleClose">确认</div>
  </div>
</template>

<style>
.ta-select {
  display: flex;
}
.n {
  flex: 1;
}
.n1 {
  margin-right: 10px;
}
.date-picker-confirm {
  background-color: rgba(0, 0, 0, 1);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 30px;
  height: 32px;
}
.calendar {
  width: 100%;
  font-size: 12px;
  color: #000;
}

.week {
  display: flex;
  padding-left: 0;
}

.week li {
  width: 30px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
  color: rgba(255, 152, 245, 1);
}

.days {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.days div {
  height: 24px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.days div span {
  padding: 2px 10px;
}

.days .wisas:hover {
  background-color: rgba(255, 106, 240, 1);
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
}

.active {
  background-color: rgba(255, 106, 240, 1);
  color: #fff;
  border-radius: 5px;
}

.days .gay {
  color: #ccc;
}
</style>