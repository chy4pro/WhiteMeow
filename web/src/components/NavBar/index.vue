<template>
  <div class="w-full h-auto fixed left-0 top-0 box-border flex-row-between z-1000 bg-white">
    <div class="cursor-pointer" :style="{'visibility': (props.showLogo ? 'visible' : 'hidden')}"  @click="goHome">
      <Image name="logo.svg" :width="'128px'" :height="'56px'" class="ml-40px my-8px"/>
    </div>
    <div>
      <Image name="personal.svg" alt="" :width="'40px'" :height="'40px'" class="mr-24px cursor-pointer" @click="goHome"/>
      <Image name="comment.svg" alt="" :width="'40px'" :height="'40px'" class="mr-40px cursor-pointer" @click="goFeedBack"/>
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
