<template>
  <div class="wh-full flex flex-col-center">
    <div class="relative">
      <Star :status="stepStatus"/>

      <div class="
        relative
        z-777
        w-43.2rem
        px-4rem
        box-border
        rounded-8px
        backdrop-blur-78px
      bg-[rgba(255,255,255,0.4)]
      ">
        <div class="overflow-auto">
          <div class="
            mt-12rem
            font-500
            line-height-normal
            text-center
          ">
            欢迎来到喵老师的文字冒险游戏，每局游戏共五个情节，邀请你的好友一起来探索你们的隐藏人格了！
          </div>
          <div class="
            mt-10.4rem
            rounded-6px
            bg-black
            w-full
            h-5.6rem
            color-white
            text-2rem
            line-height-5.6rem
            text-center
            font-700
            cursor-pointer
            "
            @click="$router.push('adtRoom')"
            >
            创建房间
          </div>
          <div class="
            text-1.6rem
            font-500
            text-center
            mt-1.8rem
            color-black
            pb-4rem
            cursor-pointer
          ">已有房间，加入好友</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Star from './components/Star.vue'
const stepStatus = ref(1)

</script>

<style scoped>
/* css部分 */


</style>

