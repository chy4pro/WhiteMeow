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
          <a-button class="
            mt-10.4rem
            rounded-6px
            bg-black
            w-full
            h-5.6rem
            color-white
            text-2rem
            text-center
            font-700
            cursor-pointer
            "
            :loading="loadingCreate"
            @click="createRoom"
            >
            创建房间
          </a-button>
          <div class="
            text-1.6rem
            font-500
            text-center
            mt-1.8rem
            color-black
            pb-4rem
            cursor-pointer
          "
          @click="$router.push('hasRoom')"
          >已有房间，加入好友</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Star from './components/Star.vue'
import { chatroomAdd } from '@manage/shared/apis/game'
import { genId, genIdForMsg } from "@manage/shared/utils/idGenerator.js";
import { userMessage, useLoginStore, useChatStore, useCounterStore } from '@manage/shared/store/index.ts';
const router = useRouter();

const loginStore = useLoginStore()
const stepStatus = ref(1)
const loadingCreate = ref(false)
const realUserId = computed(()=>{
  let result = ''
  result = window.localStorage.getItem('token') as string ? window.localStorage.getItem('newUserId') as string : window.localStorage.getItem('userId') as string || genId('userId',1) as string;

  return result;
})

//创建房间
const createRoom = async() =>{
  loadingCreate.value = true

  let params = {
    user: realUserId.value,
    open_kf_id: 'uqTIN13j6HKg2nYSyuTay6mHRQULNRSU'
  }

  loadingCreate.value = false

  let { data, code } = await chatroomAdd(params)
  
  if(code === 200 && data){
    router.push({ name: 'waitingRoom', query: {'channel_id': data.channel_id, 'id': data.id}});
  }
}
</script>

<style scoped>
/* css部分 */


</style>

