<template>
  <div class="wh-full flex flex-col-center">
    <div class="relative">
      <div class="absolute top--10rem left-50% translate-x--50% z-666">
        <SvgImage name="cat_white.svg" class="w-26.1rem h-30.8rem"></SvgImage>
      </div>
      <transition name="slide-fade" 
            enter-active-class="custom-enter-active-class"
            leave-active-class="custom-leave-active-class">
        <div class="absolute right-5rem top--9.7rem" v-if="show">
          <SvgImage name="star.svg" class="w-2.9rem"/>
        </div>
      </transition>
      <transition name="slide-fade" 
            enter-active-class="custom-enter-active-class"
            leave-active-class="custom-leave-active-class">
        <div class="absolute right--7rem top-16.6rem" v-if="show">
          <SvgImage name="star.svg" class="w-2rem"/>
        </div>
      </transition>
      <transition name="slide-fade" 
            enter-active-class="custom-enter-active-class"
            leave-active-class="custom-leave-active-class">
        <div class="absolute left-5rem top--5.6rem" v-if="show">
          <SvgImage name="star.svg" class="w-1rem"/>
        </div>
      </transition>
      <transition name="slide-fade" 
            enter-active-class="custom-enter-active-class"
            leave-active-class="custom-leave-active-class">
        <div class="absolute left--5.4rem top-10.8rem" v-if="show">
          <SvgImage name="star.svg" class="w-1rem"/>
        </div>
      </transition>

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
        <div class="overflow-auto" v-if="stepStatus === 1">
          <div class="
            mt-12rem
            font-500
            line-height-normal
            text-center
          ">
            欢迎来到喵老师的文字冒险游戏，每局游戏共五个情节，邀请你的好友一起来探索你们的隐藏人格了！
          </div>
          <div class="
            mt-8rem
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
            ">
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
        <div class="overflow-auto" v-if="stepStatus === 2">
          <div class="
            mt-4rem
            text-2.4rem
            font-700
            line-height-normal
            text-center
          ">
            房间号：123456
          </div>
          <div class="flex-row-start mt-9.6rem">
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
              ">玩家</div>
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
            ">
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
          </div>
          <div class="
            mt-8rem
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
import SvgImage from '@/components/SvgImage/index.vue'
import messageBox from '@/components/MessageBox/index.ts';

const show = ref(true)
const stepStatus = ref(2)

const shareLink = () => {
  messageBox.success('成功复制，快去分享链接吧')
}
</script>

<style scoped>
/* css部分 */
.custom-enter-active-class {
  animation: bounce-in .5s;
}
.custom-leave-active-class {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

</style>

