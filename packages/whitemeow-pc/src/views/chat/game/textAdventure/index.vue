<template>
  <div class="wh-full flex flex-col-center">
    <div class="relative">
      <Star :status="stepStatus"/>
      <div class="absolute top--10rem left-50% translate-x--50% z-666">
        <SvgImage name="cat_white.svg" class="w-26.1rem h-30.8rem"></SvgImage>
      </div>

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
            mt-4rem
            text-2.4rem
            font-700
            line-height-normal
            text-center
          ">
            房间号：123456
          </div>
          <div class="flex-row-start mt-5.6rem">
            <div class="
            relative
            w-16.4rem
            h-10.2rem
            border-4px
            border-solid
            border-black
            rounded-6px
            bg-[var(--pink-02)]
            mr-2.4rem
            ">
              <div class="
              w-8rem
              h-8rem
              absolute
              top--4rem
              left-50%
              translate-x--50%
              border-4px
              border-solid
            border-black
              rd-50%
              bg-[var(--pink-02)]
              color-white
              text-2.6rem
              font-700
              flex-col-center
              ">
              我
              </div>
              <div class="
              absolute
              bottom-1.3rem
              left-50%
              translate-x--50%
              color-white
              text-2.6rem
              font-700
              ">玩家A</div>
            </div>
            <div class="
            relative
            w-16.4rem
            h-10.2rem
            border-4px
            border-dashed
            border-#BEBEBE
            rounded-6px
            bg-[rgba(255,255,255,0.64)]
            "
            v-show="false"
            >
              <div class="
              w-8rem
              h-8rem
              absolute
              top--4rem
              left-50%
              translate-x--50%
              border-4px
              border-dashed
            border-#BEBEBE
              rd-50%
              bg-#f8f7f6
              color-black
              text-4.5rem
              font-700
              flex-col-center
              ">?</div>
              <div class="
              absolute
              bottom-1.3rem
              left-50%
              translate-x--50%
              color-black
              text-2.6rem
              font-700
              ">玩家</div>
            </div>
            <div class="
            relative
            w-16.4rem
            h-10.2rem
            border-4px
            border-solid
            border-white
            rounded-6px
            bg-#000
            mr-2.4rem
            ">
              <div class="
              w-8rem
              h-8rem
              absolute
              top--4rem
              left-50%
              translate-x--50%
              border-4px
              border-solid
            border-white
              rd-50%
              bg-#000
              color-white
              text-2.6rem
              font-700
              flex-col-center
              ">
              我
              </div>
              <div class="
              absolute
              bottom-1.3rem
              left-50%
              translate-x--50%
              color-white
              text-2.6rem
              font-700
              ">玩家B</div>
            </div>
          </div>
          <div class="
            mt-4rem
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
            @click="shareLink"
            >
            立即邀请
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
import messageBox from '@manage/shared/components/MessageBox/index.ts';

const stepStatus = ref(2)

const shareLink = () => {
  messageBox.success('成功复制，快去分享链接吧')
}
</script>

<style scoped>
/* css部分 */


</style>

