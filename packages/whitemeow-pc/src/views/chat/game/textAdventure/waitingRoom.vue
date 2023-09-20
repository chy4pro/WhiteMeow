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
        <div class="overflow-hidden">
          <div class="absolute right-1.6rem top-1.6rem cursor-pointer"  @click="closeTheRoom">
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

          <a-button
          class="
            mt-4rem
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
            :loading="startLoading"
            v-if="readyStatus && !isInvite"
            @click="startGame"
          >
          开始游戏
          </a-button>
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

import { chatroomAdd,chatroomDelete } from '@manage/shared/apis/game'
import { useLoginStore, useSocketStore } from '@manage/shared/store/index.ts';

const socketStore = useSocketStore()
const loginStore = useLoginStore()
const router = useRouter();
const isConnect = ref(true);//是否连接websocket

const stepStatus = ref(2)
const source = window.location.href + '&invite=1'
const { text, copy, copied, isSupported } = useClipboard({ source })

const startLoading = ref(false)
const roomNumber = ref('')
const channelId = ref('')
const userName = ref('')
const isInvite = ref(false)
const readyStatus = ref(false)
const realUserId = computed(()=>{
  let result = ''
  result = window.localStorage.getItem('token') as string ? window.localStorage.getItem('newUserId') as string : window.localStorage.getItem('userId') as string || genId('userId',1) as string;

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


// 发送消息
const sendMessage = (type:number,userName:string) => {
  // let messageId = genIdForMsg(2 ,20);

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
  socketStore.ws?.sendMsg(sendData)
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
        if(item.userName === data.user_name){
          item.userId = data.user
          //item.userName = data.user_name
          onceFlag = false

        }

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
// const onReceived2:any = inject('onReceived2')
function onReceived(data:any) {
  console.log('---data---',data);

  // 监听服务器返回信息
  if(data){
    let dataFormat = JSON.parse(data)
    let tempArr:any = []
    
    if(dataFormat){
      let type = dataFormat.type
      if(dataFormat.is_stream_end === false){
        // type为8的跳转准备开始游戏
        if(type === 9){
          // 代表b进来了
          stepStatus.value = 0
          sendMessage(2,userName.value )
        }
        else if(type === 8){
          if(dataFormat.to_user_id === realUserId.value){
            startLoading.value = false

            if(isInvite.value){
              router.push({ name: 'textAdventure', query: {'channel_id': channelId.value,'user_name': userName.value, 'invite': 1}});
            }
            else{
              router.push({ name: 'textAdventure', query: {'channel_id': channelId.value,'user_name': userName.value}});
            }
          }
        }
        else if(type === 4 || type === 5){
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
    }

  }
}
// 关闭并删除聊天室
const closeTheRoom = async() =>{
  router.push('createRoom')
  let params = {
    channel_id: channelId.value
  }
  let result = await chatroomDelete(params);
}

// 开始游戏
const startGame = () => {
  console.log('start');
  startLoading.value = true
  sendMessage(8,userName.value)
  
}

const initData = () =>{
  if(isInvite.value){
    userName.value = 'B'
  }
  else{
    userName.value = 'A'
  }

  //防止用户返回
  if(socketStore.ws){
    socketStore.ws.close()
  }

  const initSocket = socketStore.initWebSocket(realUserId.value, userName.value);
  initSocket(onReceived)
  socketStore.replaceCallBack(onReceived)
  socketStore.ws.callback = onReceived
  socketStore.webSocketConnect();
  console.log(socketStore.ws);
  
  
  initEmptyPlayer()
}

onMounted(()=>{
  getCurrentRouter()
  initData()
//   window.addEventListener("beforeunload", (event) => {
//   // Cancel the event as stated by the standard.
//   event.preventDefault();
//   sendMessage(6, userName.value)
//   // Chrome requires returnValue to be set.
//   event.returnValue = "";
// });
  if(socketStore.ws){
    // 监听连接状态变化
    watch(()=> socketStore.ws.status, async(newValue) => {
      console.log(socketStore.ws);
      
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
  }


  // 监听连接状态变化
  watch(()=> playerList, async(newValue) => {
    console.log('----',newValue);
    if(newValue && newValue.value){
      isFullPlayer(newValue.value)
    }
  }, { deep: true });
})



// onBeforeUnmount(()=>{
//   window.addEventListener("beforeunload", (event) => {
//   // Cancel the event as stated by the standard.
//   event.preventDefault();
//   sendMessage(6, userName.value)
//   // Chrome requires returnValue to be set.
//   event.returnValue = "";
// });
// })
</script>

<style scoped>
/* css部分 */


</style>

