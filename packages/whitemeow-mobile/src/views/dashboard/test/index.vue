<script setup>
import { reactive } from "vue";

import Lucky from "~/test/lucky.png";
import Can from "~/test/can.png";
import Cant from "~/test/cant.png";
import StarBg from "~/test/star-bg.png";
import Star from "~/test/star.png";
import Card from "~/test/cover.png";
import Btn from "~/test/btn.png";
import Text from "~/test/text.png";
import Bg from "~/test/bg.png";

import { useRouter } from "vue-router";

const router = useRouter();

const state = reactive({
  card: [
    {
      label: "小喵解梦",
      desc: "好梦还是恶兆？",
      path: "/dashboard/dream",
    },
    {
      label: "心理沙盘",
      desc: "感应性的治愈机制",
      path: "/dashboard/sand",
    },
    {
      label: "肠道健康测试",
      desc: "肥胖、抑郁、慢性病等风险评",
      path: "",
    },
    {
      label: "MBTI",
      desc: "16型人格测试",
      path: "",
    },
  ],
});

const handleLink = (path) => {
  if (!path) {
    return;
  }

  router.push({
    path,
  });
};
</script>

<template>
  <div class="test-index">
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
            结婚.出行.交易.开业.安床.求子
          </div>
          <div class="item">
            <img :src="Cant" alt="" />
            祈福.安葬.办满月酒.修造.酬神.
          </div>
        </div>
      </div>

      <div class="card">
        <img class="c" :src="StarBg" alt="" />
        <img class="l" :src="Card" alt="" />
        <div class="right">
          <img class="t" :src="Text" alt="" />
          <img
            @click="handleLink('/dashboard/showCard')"
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
          class="item"
          v-for="(item, idx) in state.card"
          :key="idx"
          :style="{ marginRight: (idx + 1) % 2 === 0 ? '0' : '0.7rem' }"
          @click="handleLink(item.path)"
        >
          <img :src="Bg" alt="" />
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
.test-index {
  padding: 1.6rem;

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

          .name {
            font-size: 1.4rem;
            font-weight: 600;
            color: rgba(16, 24, 40, 1);
          }

          .desc {
            font-size: 1rem;
            font-weight: 400;
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
    border-radius: 0.8rem;
    overflow: hidden;
    box-shadow: 0.2rem 0.5rem 1rem rgba(0, 0, 0, 0.2);
  }

  .card {
    height: 22.5rem;
    background: linear-gradient(
      to bottom,
      #fbc4f9 0%,
      rgba(255, 255, 255, 0) 40%
    );
    padding: 2.4rem 1.6rem;
    position: relative;
    display: flex;

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
      }
    }

    .c {
      position: absolute;
      left: 0.6rem;
      width: calc(100% - 1.5rem);
      height: 9.5rem;
    }

    .l {
      width: 10.5rem;
      height: 18rem;
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
        font-size: 1.4rem;
        font-weight: 700;
        height: 2.1rem;
        line-height: 2.1rem;
        text-align: center;
      }

      .item {
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 0.4rem;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

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
