<script setup>
import { reactive, defineAsyncComponent } from "vue";

import Girl from "~/login/girl.png";
import Boy from "~/login/boy.png";

import { useRouter } from "vue-router";

const router = useRouter();

const InputComp = defineAsyncComponent(() =>
  import("@/components/input/index.vue")
);

const state = reactive({
  name: "",
  sex: "",
});

const handleInp = (str) => {
  state.name - str;
};

const handleJump = () => {
    router.push({
        path: '/'
    })
}

const handleConfirm = () => {
    console.log('confirm...')
}
</script>

<template>
  <div class="wrapper">
    <div class="title">个人档案</div>

    <div class="item">
      <div class="name">昵称</div>
      <div class="inp">
        <InputComp @handleInputEmit="handleInp" placeholder="请输入昵称" />
      </div>
    </div>

    <div class="item">
      <div class="name">性别</div>
      <div class="btn-wrapper">
        <div
          :class="['btn', 'left', state.sex === '0' && 'girl-active']"
          @click="state.sex = '0'"
        >
          <img :src="Girl" alt="" />
          女生
        </div>
        <div
          :class="['btn', state.sex === '1' && 'boy-active']"
          @click="state.sex = '1'"
        >
          <img :src="Boy" alt="" />
          男生
        </div>
      </div>
    </div>

    <div class="item" style="margin-bottom: 2.4rem">
      <div class="name">出生年月</div>
      <div>comp</div>
    </div>

    <div class="confirm" @click="handleConfirm">确认</div>
    <div class="jump">
      <span @click="handleJump">跳过</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  .jump {
    margin-top: 1.6rem;
    color: rgba(0, 0, 0, 0.4);
    font-size: 1.4rem;
    font-weight: 500;
    display: flex;
    justify-content: center;
    height: 2.4rem;
    line-height: 2.4rem;

    span {
      text-decoration: underline;
    }
  }
  .confirm {
    font-size: 1.4rem;
    font-weight: 700;
    background-color: rgba(0, 0, 0, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4.4rem;
    border-radius: 0.6rem;
    color: #fff;
  }
  .confirm:active {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .title {
    font-size: 2rem;
    font-weight: 700;
    color: rgba(0, 0, 0, 1);
    height: 1.8rem;
    line-height: 1.8rem;
    margin-bottom: 2.4rem;
  }

  .item {
    margin-bottom: 1.6rem;

    .btn-wrapper {
      display: flex;

      .left {
        margin-right: 1.7rem;
      }

      .btn {
        height: 4.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        color: rgba(0, 0, 0, 0.8);
        font-size: 1.6rem;
        font-weight: 500;
        background-color: rgba(244, 245, 247, 1);
        border-radius: 0.6rem;

        img {
          width: 2.4rem;
          height: 2.4rem;
          margin-right: 0.5rem;
        }
      }

      .boy-active {
        background-color: rgba(223, 232, 255, 1);
      }

      .girl-active {
        background-color: rgba(255, 223, 252, 1);
      }
    }

    .name {
      height: 2.4rem;
      line-height: 2.4rem;
      font-size: 1.4rem;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 500;
      padding-left: 0.5rem;
    }

    .inp {
      height: 4.8rem;
    }
  }
}
</style>
