<template>
    <div class="jal-modal-bg" v-show="chatStore.showOnlyOne">
      <div class="wh-full flex-col-center">
        <div class="w-48rem bg-white rounded-6px">
          <div class="flex-row-start mt-3.6rem mb-3.6rem">
            <div class="mr-1.6rem mb-0.8rem">
              <SvgImage name="message_info.svg" class="w-4.8rem h-4.8rem ml-2.4rem"/>
            </div>
            <div>
              <div class="text-2rem font-700 line-height-2.4rem">每天只能测一次哦，欢迎客官明天再来</div>
              <div class="text-1.4rem font-400 line-height-1.8rem">点击查看今日测试结果～</div>
            </div>
          </div>

          <div class="flex-row-center py-1.3rem border-l-0 border-r-0 border-b-0 border-t border-solid border-[rgba(40,40,143,0.08)]">
            <!-- <div class="mr-0.8rem border-[rgba(0,0,0,0.8)] hover:color-black border border-solid w-8.8rem text-1.4rem line-height-36px text-center rounded-4px cursor-pointer box-border"
            @click="chatStore.showOnlyOne = false"
            >
              取消
            </div> -->
            <div class="w-8.8rem text-1.4rem line-height-36px rounded-4px text-center border border-solid
            cursor-pointer
          bg-black  
          hover:bg-[rgba(0,0,0,0.8)]
          active:bg-[rgba(0,0,0,0.6)]
          disabled:bg-[rgba(0,0,0,0.4)]
          color-white"
          @click="chatStore.showOnlyOne = false"
          >
              确认
            </div>
          </div>
        </div>
      </div>
    </div>
</template>


<script setup lang="ts">
import { useChatStore } from '../..//store/index.ts';
const chatStore = useChatStore()
  const props = defineProps({
    show: {
      type: Boolean,
    },
    message: {
      type: String,
    },
  });
</script>

<style scoped>
.ant-btn-default:not(:disabled):hover{
  color: black;
  border-color: black;
}
.ant-btn-default:not(:disabled):hover{
  color: black;
  border-color: black;
}
</style>
