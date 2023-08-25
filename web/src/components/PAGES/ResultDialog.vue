<template>
  <div class="wh-full box-border overflow-y-auto relative bg-[url(@/assets/images/tarot-bg.png)]">
    <div class="
        w-full
        min-h-45rem
        relative
        mb-5.4rem
        mt-12.1rem
        bg-[url(@/assets/images/dialog_box3.svg)]
        bg-no-repeat
        bg-bottom"
        style="background-size: 100% 100%;"
        >
        <SvgImage name="cat_red3.svg" class="
          w-full
          h-12.1rem
          absolute
          right--4rem
          top--9.5rem
        "></SvgImage>
        <div class="
        h-35rem
        absolute
        bottom-2rem
        overflow-auto
        pl-9.8rem
        pr-9.9rem
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
</template>


<script setup lang="ts">
  const props = defineProps({
    message: {
      type: String,
    },
  });
</script>
