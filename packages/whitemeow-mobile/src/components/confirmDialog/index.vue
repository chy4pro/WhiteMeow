<script setup>
const props = defineProps({
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});

const emit = defineEmits(["handleEmit"]);

const handleClick = (bool) => {
  emit("handleEmit", bool);
};
</script>

<template>
  <div class="dialog" @click="handleClick(false)">
    <div class="main" @click.stop>
      <div class="title">
        <div v-html="props.title"></div>
      </div>
      <div class="content">
        <div v-html="props.content"></div>
      </div>

      <div class="btn-wrapper">
        <div class="btn left" @click="handleClick(false)">取消</div>
        <div class="btn" @click="handleClick(true)">确认</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100vw;
  height: 100vh;

  .main {
    background-color: #fff;
    border-radius: 0.8rem;
    width: calc(100% - 4.8rem);
    padding: 2rem 1.6rem;

    .title {
      font-size: 1.7rem;
      color: rgba(0, 0, 0, 1);
      font-weight: 700;
      height: 2.2rem;
      line-height: 2.2rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: center;
    }

    .content {
      color: rgba(0, 0, 0, 1);
      font-weight: 400;
      font-size: 1.4rem;
      height: 1.8rem;
      line-height: 1.8rem;
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .btn-wrapper {
      display: flex;
      justify-content: space-between;

      .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 3.6rem;
        border-radius: 0.6rem;
        font-size: 1.4rem;
        flex: 1;
        border: 1px solid rgba(255, 106, 240, 1);
        color: #fff;
        background-color: rgba(255, 106, 240, 1);
      }

      .left {
        border: 1px solid rgba(144, 147, 153, 1);
        color: rgba(144, 147, 153, 1);
        background-color: #fff;
        margin-right: 1.6rem;
      }
    }
  }
}
</style>
