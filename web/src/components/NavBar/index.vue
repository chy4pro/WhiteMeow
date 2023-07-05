<template>
  <div class="nav-bar">
    <div class="logo" :style="{'visibility': (props.showLogo ? 'visible' : 'hidden')}"  @click="goHome">
      <Image name="catpaw.png" alt="" />
      <div class="logo-text">GQ Tech</div>
    </div>
    <div class="btn-group">
      <div class="icon-wrap" @click="goHome">
        <Image name="home.png" alt="" />
      </div>
      <div class="icon-wrap" @click="goFeedBack">
        <Image name="email.png" alt="" />
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
const router = useRouter();

const props = defineProps({
  showLogo: {
    type: Boolean,
    default: false
  }
});

const goHome = () => {
  router.push({ path: '/' });
};
const goFeedBack = () => {
  router.push({ path: '/feedBack' });
};

</script>

<style lang="scss" scoped>
.nav-bar{
  width: 100%;
  height: auto;
  position: fixed;
  left: 0;
  top: 0;
  padding: 10px 20px;
  box-sizing: border-box;
  @include flex-between;
  .logo{
    text-align: center;
    cursor: pointer;
    img{
      width: 60px;
      height: auto;
    }
    .logo-text{
      font-size: 20px;
      font-weight: bold;
      color: $green_1;
    }
  }
}
.btn-group{
  @include flex-start;
  justify-self: flex-end;
  .icon-wrap{
    width: 40px;
    height: 40px;
    margin-right: 15px;
    cursor: pointer;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>