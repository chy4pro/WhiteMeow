<template>
  <div class="w-full h-auto fixed left-0 top-0 px-10 py-20 box-border flex flex-row flex-nowrap justify-between flex-items-center z-1000">
    <div class="text-center cursor-pointer" :style="{'visibility': (props.showLogo ? 'visible' : 'hidden')}"  @click="goHome">
      <Image name="catpaw.png" alt="" :width="60" :height="'auto'"/>
      <div class="text-20 font-700 color-[--green-1]">GQ Tech</div>
    </div>
    <div class="flex flex-row flex-nowrap flex-justify-start flex-items-center">
      <div class="icon-wrap" @click="goHome">
        <Image name="home.png" alt="" :width="40"/>
      </div>
      <div class="icon-wrap" @click="goFeedBack">
        <Image name="email.png" alt="" :width="40"/>
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

<style scoped>
.icon-wrap{
  --at-apply: w-40 h-40 mr-15 cursor-pointer;
}
</style>