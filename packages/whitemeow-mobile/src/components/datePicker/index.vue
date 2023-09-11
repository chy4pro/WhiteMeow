<script setup>
const emit = defineEmits(["handleEmit"]);

const props = defineProps({
  isShow: {
    type: Boolean,
  },
});

const handleClose = (str) => {
  emit("handleEmit", str);
};
</script>

<template>
  <div class="ta-picker" v-if="props.isShow" @click="handleClose(false)">
    <div class="main" @click.stop>123</div>
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
    height: 33rem;
    background-color: #fff;
    box-shadow: 0px -3px 7px 0px rgba(162, 117, 152, 0.25);
    border-top-left-radius: 0.6rem;
    border-top-right-radius: 0.6rem;
    width: 100%;
    padding: 2.4rem;
  }
}
</style>
