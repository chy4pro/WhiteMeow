<template>
  <div class="wh-full box-border overflow-y-auto relative bg-[url(@manage/shared/assets/images/tarot-bg.png)]">
    <div class="px-6.4rem">
      <div class="
        w-full
        h-46rem
        relative
        mb-5.4rem
        mt-12.1rem
        bg-[url(@manage/shared/assets/images/dialog_box_large.svg)]
        bg-no-repeat
        bg-bottom"
        style="background-size: 100%"
        >
        <Image name="cat_red3.png" class="
          w-full
          h-14rem
          absolute
          left-0rem
          top--11.2rem
        "></Image>
        <div class="
        h-35rem
          absolute
          bottom-34px
          overflow-y-scroll
          pl-1.6rem
          pr-2.5rem
          mr-2rem
          text-2rem
          font-500
          color-black
          z-666
          whitespace-pre-line
          line-height-normal">{{ props.message }}</div>
      </div>
    
      <div class="flex-col-center">
        <a-button class="
          w-14.9rem
          h-6.4rem
          flex-col-center
          text-1.9rem
          font-800
          bg-[var(--text-01)]
          cursor-pointer
          color-white
          rounded-6px
          border-none
          "
          @click="$router.push('/chat/testChat')"
          >更多测试</a-button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
  const props = defineProps({
    message: {
      type: String,
    },
  });
</script>
