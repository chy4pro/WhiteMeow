<script setup>
import { reactive, ref } from "vue";

import Lucky from "~/test/lucky.png";
import Can from "~/test/can.png";
import Cant from "~/test/cant.png";
import StarBg from "~/test/star-bg.png";
import Star from "~/test/star.png";
import Card from "~/test/cover.png";
import Btn from "~/test/btn.png";
import Text from "~/test/text.png";
import Pic1 from "~/test/pic1.png";
import Pic2 from "~/test/pic2.png";
import Pic3 from "~/test/pic3.png";
import Pic4 from "~/test/pic4.png";

import LoginDialog from "./comp/loginDialog.vue";
import { useIndexStore } from "@/store/index";
import { message } from "@/utils/index";

import { useRouter } from "vue-router";

const router = useRouter();
const store = useIndexStore();

import lunisolar from "lunisolar";
import zhCn from "lunisolar/locale/zh-cn";
lunisolar.config({
  lang: "zhCn", // 设换默认语言
});
import theGods from "lunisolar/plugins/theGods";
import theGodsZhCn from "lunisolar/plugins/theGods/locale/zh-cn";
lunisolar.locale(zhCn).locale(theGodsZhCn);
lunisolar.extend(theGods);

const lsr = lunisolar();

const todayGood = lsr.theGods.query("good act 3");
const todayBad = lsr.theGods.query("bad act 3");

//将数组限定为长度为最大为7的数组
const splitArr = (arr, size = 5) => {
  let result = [];
  if (arr.length <= size) return arr;

  result = arr.slice(0, size);
  return result;
};

const goodArr = ref(splitArr(todayGood));
const badArr = ref(splitArr(todayBad));

const state = reactive({
  card: [
    {
      label: "小喵解梦",
      desc: "好梦还是恶兆？",
      path: "/chat/testChat/interpretationDream",
      imgUrl: Pic1,
      active: false,
    },
    {
      label: "心理沙盘",
      desc: "感应性的治愈机制",
      path: "/chat/testChat/sandPlay",
      imgUrl: Pic2,
      active: false,
    },
    {
      label: "肠道健康测试",
      desc: "肥胖、抑郁、慢性病等风险评",
      path: "",
      imgUrl: Pic3,
      active: false,
    },
    {
      label: "MBTI",
      desc: "16型人格测试",
      path: "",
      imgUrl: Pic4,
      active: false,
    },
  ],
  timer: null,
  timer2: null,
  timer3: null,
  isTurnBool: true,
});

const handleLink = (path, idx) => {
  if (!path) {
    message({
      type: "info",
      text: "暂未上线，敬请期待...",
    });
    return;
  }

  if (idx) {
    state.card[idx].active = true;
  }

  if (state.timer) {
    clearTimeout(state.timer);
  }

  state.timer = setTimeout(() => {
    if (idx) {
      state.card[idx].active = false;
    }

    router.push({
      path,
    });
  }, 300);
};

onMounted(() => {
  state.timer2 = setInterval(() => {
    state.isTurnBool = false;

    state.timer3 = setTimeout(() => {
      state.isTurnBool = true;
    }, 2000);
  }, 4000);
});

onUnmounted(() => {
  if (state.timer2) {
    clearInterval(state.timer2);
  }
  if (state.timer) {
    clearTimeout(state.timer);
  }
  if (state.timer3) {
    clearTimeout(state.timer3);
  }
});
</script>

<template>
  <div class="test-index">
    <LoginDialog :isShow="!store.state.token" />

    <div class="box1">
      <div class="lucky">
        <img class="l" :src="Lucky" alt="" />
        <div class="right">
          <div class="date">
            {{ new Date().getFullYear() }}年{{ new Date().getMonth() + 1 }}月{{
              new Date().getDate()
            }}日
          </div>
          <div class="item">
            <img :src="Can" alt="" />
            {{ goodArr.join(".") }}
          </div>
          <div class="item">
            <img :src="Cant" alt="" />
            {{ badArr.join(".") }}
          </div>
        </div>
      </div>

      <div class="cards">
        <img class="c" :src="StarBg" alt="" />
        <img
          :class="['l', state.isTurnBool && 'turnmove']"
          :src="Card"
          alt=""
        />
        <div class="right">
          <img class="t" :src="Text" alt="" />
          <img
            @click="handleLink('/chat/testChat/tarot')"
            class="b"
            :src="Btn"
            alt=""
          />
          <img class="star" :src="Star" alt="" />
        </div>
      </div>
    </div>

    <div class="box2">
      <div class="title">更多测试</div>
      <div class="list">
        <div
          :class="['item', item.active && 'scale']"
          v-for="(item, idx) in state.card"
          :key="idx"
          :style="{ marginRight: (idx + 1) % 2 === 0 ? '0' : '0.7rem' }"
          @click="handleLink(item.path, String(idx))"
        >
          <img :src="item.imgUrl" alt="" />
          <div class="bottom">
            <div class="name">{{ item.label }}</div>
            <div class="desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes scaleMove {
  0% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@-webkit-keyframes scaleMove {
  0% {
    transform: scale(1);
  }
  75% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes turnMove {
  0% {
    transform: rotateZ(2deg);
  }
  50% {
    transform: rotateZ(-2deg);
  }
  100% {
    transform: rotateZ(2deg);
  }
}

@-webkit-keyframes turnMove {
  0% {
    transform: rotateZ(2deg);
  }
  50% {
    transform: rotateZ(-2deg);
  }
  100% {
    transform: rotateZ(2deg);
  }
}

.test-index {
  padding: 1.6rem;
  padding-top: 0.5rem;

  .box2 {
    margin-top: 2.4rem;

    .title {
      color: rgba(0, 0, 0, 1);
      height: 2.6rem;
      line-height: 2.6rem;
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1.4rem;
    }

    .list {
      display: flex;
      flex-wrap: wrap;

      .scale {
        transform: scale(1.1);
        transition: all 0.3s;
      }

      .item {
        width: 16.8rem;
        height: 18rem;
        overflow: hidden;
        border-radius: 0.8rem;
        box-shadow: 0.2rem 0.5rem 1rem rgba(0, 0, 0, 0.2);
        margin-bottom: 1.6rem;

        img {
          width: 100%;
          height: 13.2rem;
          display: block;
        }

        .bottom {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: calc(100% - 13.2rem);
          font-family: RedHatDisplayBold;

          .name {
            font-size: 1.5rem;
            font-weight: 800;
            color: rgba(16, 24, 40, 1);
          }

          .desc {
            font-size: 1.2rem;
            color: rgba(71, 84, 103, 1);
            width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            text-align: center;
          }
        }
      }
    }
  }

  .box1 {
    width: 99%;
    border-radius: 0.8rem;
    overflow: hidden;
    box-shadow: 0.2rem 0.5rem 1rem rgba(0, 0, 0, 0.2);
  }

  .cards {
    width: 100%;
    height: 22.5rem;
    background-image: url("~/test/jb.png");
    background-size: 110% 100%;
    background-repeat: no-repeat;
    background-position: 90% 100%;
    padding: 2.4rem 1.6rem;
    position: relative;
    display: flex;

    img {
      display: block;
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      flex: 1;
      position: relative;

      .star {
        position: absolute;
        width: 1.6rem;
        height: 2.5rem;
        bottom: 1.5rem;
        left: 0.5rem;
      }

      .t {
        width: 17.7rem;
        margin-bottom: 2rem;
        margin-top: 2rem;
      }

      .b {
        width: 15rem;
        height: 4rem;
        animation: scaleMove 2s infinite;
        -webkit-animation: scaleMove 2s infinite;
      }
    }

    .c {
      position: absolute;
      left: 0.7rem;
      // width: calc(100% - 1.5rem);
      height: 9.5rem;
    }

    .l {
      width: 10.5rem;
      height: 18rem;
    }

    .turnmove {
      animation: turnMove 0.6s infinite;
      -webkit-animation: turnMove 0.6s infinite;
    }
  }

  .lucky {
    height: 9rem;
    background: linear-gradient(to right, #ff71f1 0%, #850bff 97.87%);
    padding: 0.9rem 1.6rem;
    display: flex;
    justify-content: space-between;

    .l {
      width: 7.2rem;
      height: 7.2rem;
      margin-right: 1.2rem;
    }

    .right {
      flex: 1;

      .date {
        color: #fff;
        font-size: 1.6rem;
        font-weight: 900;
        height: 2.1rem;
        line-height: 2.1rem;
        text-align: center;
        font-family: RedHatDisplayBold;
      }

      .item {
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 0.4rem;
        width: 100%;
        font-size: 1.3rem;
        font-family: RedHatDisplayBold;

        img {
          width: 2.4rem;
          height: 2.4rem;
          vertical-align: middle;
          margin-right: 0.8rem;
        }
      }
    }
  }
}
</style>
