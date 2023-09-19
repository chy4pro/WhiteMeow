<template>
  <div class="wh-full flex flex-col-center">
    <div class="relative">
      <Star :status="2"/>

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
            font-400
            text-2.4rem
            line-height-normal
            text-center
          ">
            <div>你的朋友等候多时了～</div>
            <div>快快加入吧</div>
          </div>
          <div class="
            mt-10.4rem
            normal-input-container
          ">
            <a-input
            class="normal-input"
            v-model:value="formState.roomNumber"
            placeholder="输入房间号"
            allow-clear
            ></a-input>
          </div>
          <a-button class="
            mt-1.6rem
            mb-4rem
            rounded-6px
            w-full
            h-5.6rem
            l-btn-black
            "
            :loading="loadingJoin"
            :disabled="disabledEnter"
            @click="joinRoom"
            >
            加入游戏
          </a-button>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Star from './components/Star.vue'
import { chatroomJoin, chatRoomGetById } from '@manage/shared/apis/game'
import { userMessage, useLoginStore, useChatStore, useCounterStore } from '@manage/shared/store/index.ts';
import { genId, genIdForMsg } from "@manage/shared/utils/idGenerator.js";

const router = useRouter();
const loginStore = useLoginStore()

const stepStatus = ref(1)
let disabledEnter = ref(true);
const loadingJoin = ref(false)
const formState = reactive({
  roomNumber: ''
})

watch(
  () => formState.roomNumber,
  (newVal) => {
    // 检查 formState.roomNumber 是否有值，如果有值则将 disabledEnter 设置为 false，否则设置为 true
    disabledEnter.value = !newVal;
  }
);

const realUserId = computed(()=>{
  let result = ''
  result = window.localStorage.getItem('token') as string ? window.localStorage.getItem('newUserId') as string : window.localStorage.getItem('userId') as string || genId('userId',1) as string;

  return result;
})

//加入房间
const joinRoom = async() =>{
  loadingJoin.value = true
  let roomData = await getChanelId()
  console.log(roomData);
  
  let params = {
    user: realUserId.value,
    channel_id: roomData.channel_id
  }

  loadingJoin.value = false

  let { data, code } = await chatroomJoin(params)
  
  if(code === 200 && data){
    router.push({ name: 'waitingRoom', query: {'channel_id': roomData.channel_id, 'id': roomData.id, 'invite': '1'}});
  }
}

// 根据房间号获取channelId
const getChanelId = async() =>{
  let params = {
    id: formState.roomNumber
  }

  let { data, code } = await chatRoomGetById(params)
  
  if(code === 200 && data){
    return data
  }
}
</script>

<style scoped>
/* css部分 */
.normal-input-container{
  --at-apply: relative;
}
.normal-input{
  --at-apply: h-5.6rem border-[#000];
}
:deep .ant-input-affix-wrapper >input.ant-input{
  --at-apply: text-center;
}


</style>

