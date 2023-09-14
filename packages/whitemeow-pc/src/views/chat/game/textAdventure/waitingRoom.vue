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
          <div class="absolute right-1.6rem top-1.6rem cursor-pointer" @click="$router.push('createRoom')">
            <SvgImage name="icon_close.svg" class="w-2.4rem h-2.4rem"></SvgImage>
          </div>

          <div class="
            mt-4rem
            text-2.4rem
            font-700
            line-height-normal
            text-center
          ">
            房间号：{{ roomNumber }}
          </div>

          <div class="flex-row-start mt-9.6rem">
            <div v-for="(item,index) in playerList" :key="index">
              <div 
              class="
              relative
              w-16.4rem
              h-10.2rem
              border-4px
              border-solid
              rounded-6px
              mr-2.4rem
              "
              v-if="item.userId"
              :style="[`background-color:${item.bgColor}`, `border-color:${item.borderColor}`]"
              >
                <div class="
                w-8rem
                h-8rem
                absolute
                top--4rem
                left-50%
                translate-x--50%
                border-4px
                border-solid
                rd-50%
                color-white
                text-2.6rem
                font-700
                flex-col-center
                "
                :style="[`background-color:${item.bgColor}`, `border-color:${item.borderColor}`]"
                >
                <span v-if="item.userId === realUserId">我</span>
                <span v-else>{{ item.userName }}</span>
                </div>
                <div class="
                absolute
                bottom-1.3rem
                left-50%
                translate-x--50%
                color-white
                text-2.6rem
                font-700
                ">玩家{{ item.userName }}</div>
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
              mr-2.4rem
              "
              v-else
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
                ">玩家{{ item.userName }}</div>
              </div>
            </div>

          </div>

          <div
          class="
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
            v-if="readyStatus && !isInvite"
            @click="startGame"
          >
          开始游戏
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
            v-else-if="!isInvite"
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
          "
          @click="$router.push('hasRoom')"
          >已有房间，加入好友</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import Socket from "@manage/shared/utils/http/websocket.js";
import Star from './components/Star.vue'
import messageBox from '@manage/shared/components/MessageBox/index.ts';
import { gameUserMap } from '../../gameUserMap'
import { genId, genIdForMsg } from "@manage/shared/utils/idGenerator.js";

import { chatroomAdd } from '@manage/shared/apis/game'
import { userMessage, useLoginStore, useChatStore, useCounterStore } from '@manage/shared/store/index.ts';
const loginStore = useLoginStore()
const router = useRouter();
let ws:any = null
const isConnect = ref(true);//是否连接websocket

const stepStatus = ref(2)
const source = window.location.href + '&invite=1'
const { text, copy, copied, isSupported } = useClipboard({ source })
const roomNumber = ref('')
const channelId = ref('')
const userName = ref('')
const isInvite = ref(false)
const readyStatus = ref(false)
const realUserId = computed(()=>{
  let result = ''
  result = loginStore.token ? loginStore.newUserId : loginStore.userId;

  return result;
})

interface PlayerList {
  userName?: string; 
  bgColor?: string; 
  borderColor?: string;
  userId?: string
}
let playerList = ref<PlayerList[]>([{},{}])

const shareLink = () => {
  messageBox.success('成功复制，快去分享链接吧')
  copy(source)
}

const initWebSocket = () => {
  // scoket连接
  ws = reactive(new Socket({
    url: `${import.meta.env.VITE_API_WEBSOCKET_URL}/chatroom/socket?user=${loginStore.token ? loginStore.newUserId : loginStore.userId}&name=${userName.value}`,
    name: '',			// name
    isHeart:true,			// 是否心跳
    isReconnection:true,		// 是否断开重连
    received: function(data:any){
      // 监听服务器返回信息
      console.log("received",data)
      let dataFormat = JSON.parse(data)
      let tempArr:any = []
      
      if(dataFormat){
        let type = dataFormat.type
        if(type === 8){
          if(dataFormat.to_user_id === realUserId){
            router.push({ name: 'textAdventure', query: {'channel_id': channelId.value,'user_name': userName.value}});
          }
        }
        else{
          dataFormat.users.forEach((item:any)=>{
            tempArr.push({
              'user': item.user,
              'user_name': item.user_name
            })
          })
          tempArr.forEach((item:any)=>{
            addPlayer(item)
          })
        }

      }

      console.log('---123---',playerList);
      
    }
  }));
  ws.connect();
}

// 发送消息
const sendMessage = (type:number,userName:string) => {
  let messageId = genIdForMsg(2 ,20);

  let sendData = {
    'typeStatus': 'sendMsg',
    'channel_id': channelId.value,
    // 'message_id': messageId,
    'user': window.localStorage.getItem('token') ? window.localStorage.getItem('newUserId') : window.localStorage.getItem('userId') || genId('userId',1),
    'user_name': userName,
    'kf_id': 'uqTIN13j6HKg2nYSyuTay6mHRQULNRSU',
    'open_kf_id': 'uqTIN13j6HKg2nYSyuTay6mHRQULNRSU',
    'type': type,
    "heartbeat": false
  }
  ws.sendMsg(sendData)
};

const getCurrentRouter = () => {
  let query = router.currentRoute.value.query
  if(query.id){roomNumber.value = query.id as string}
  if(query.channel_id){channelId.value = query.channel_id as string}  
  if(query.invite){isInvite.value = query.invite as string === '1'? true : false}
}

// 添加玩家
const addPlayer = (data:any) =>{
  let onceFlag = true
    playerList.value.forEach((item,index)=>{
      if(item.userId === '' && onceFlag){
        item.userId = data.user
        item.userName = data.user_name
        onceFlag = false
      }
    })
}


const initEmptyPlayer = ()=>{
  playerList.value.forEach((item,index)=>{
    item.userName = gameUserMap[index].name
    item.userId = ''
    item.bgColor = gameUserMap[index].bgColor
    item.borderColor = gameUserMap[index].borderColor
  })
}

// 是否满人
const isFullPlayer = (list:PlayerList[]) => {
  let onlinePlayer = list.filter((item)=>{
    if(item.userId && item.userId!=''){
      return item.userId
    }
  })
  console.log(onlinePlayer);
  
  if(onlinePlayer && onlinePlayer.length === 2){
    readyStatus.value = true
  }
}

// 开始游戏
const startGame = () => {
  console.log('start');
  sendMessage(8,userName.value)
  
}

const initData = () =>{
  if(isInvite.value){
    userName.value = 'B'
  }
  else{
    userName.value = 'A'
  }

  initWebSocket()
  initEmptyPlayer()
}

onMounted(()=>{
  getCurrentRouter()
  initData()

  // 监听连接状态变化
  watch(()=> ws.status, async(newValue) => {
    console.log('myVariable 变化了:', newValue);
    if(newValue === 'open'){
      isConnect.value = true;
      //sendMessage(4,)
      if(isInvite.value){
        sendMessage(5,userName.value)
      }
      else{
        sendMessage(4,userName.value)
      }
    }
    else{
      isConnect.value = false;
    }
  });

  // 监听连接状态变化
  watch(()=> playerList, async(newValue) => {
    console.log('----',newValue);
    if(newValue && newValue.value){
      isFullPlayer(newValue.value)
    }
  }, { deep: true });
})
</script>

<style scoped>
/* css部分 */


</style>

