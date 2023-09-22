<template>
  <div class="w-full flex-col-start overflow-y-auto" :class="[textAdventureStore.pageIndex === 5 ? 'h-100%' : 'h-[calc(100%-10.4rem)]']">
    <div class="relative mt-130px">
      <div class="absolute top--100px z-666" :class="{'left-50% translate-x--50%':textAdventureStore.pageIndex === 5, 'left-0':textAdventureStore.pageIndex < 5}">
        <SvgImage name="cat_white.svg" class="w-26.1rem h-30.8rem"></SvgImage>
      </div>
      <div class="absolute top--100px z-666" :class="{'left-50% translate-x--50%':textAdventureStore.pageIndex === 5, 'left-0':textAdventureStore.pageIndex < 5}">
        <SvgImage name="star_group.svg" class="w-23rem h-9rem"></SvgImage>
      </div>
      <div class="absolute top--114px right-48px z-666" v-if="textAdventureStore.pageIndex < 5">
        <div class="flex-row-start">
          <div class="
            mr-16px
            text-16px
            font-500
          ">请在倒计时时间内完成你的答案</div>
          <div>
            <a-progress
            type="circle"
            :percent="percentage"
            :strokeWidth="8"
            :size="100"
            :steps="60"
            trailColor="#EEE"
            strokeColor="#FF6AF0"
            gapPosition="right"
            strokeLinecap="square">
              <template #format="percent">
                <div class="w-84px h-84px bg-white absolute top--42px left-8px flex-col-center rounded-50%">
                  <div class="text-40px font-700">{{ countdown }}</div>
                  <div class="text-14px font-400">Sec</div>
                </div>
              </template>
            </a-progress>
          </div>
        </div>
      </div>
      <div class="absolute right-0 top--58px cursor-pointer" @click="closeTheRoom">
        <SvgImage name="icon_close.svg" class="w-24px h-24px"></SvgImage>
      </div>
      <div class="absolute left--3.2rem top-50% translate-y--50% cursor-pointer" v-if="textAdventureStore.canShowLeft" @click="goLeft">
        <SvgImage name="icon_arrow_left.svg" class="w-2.4rem h-2.4rem"></SvgImage>
      </div>
      <div class="absolute right--3.2rem top-50% translate-y--50% cursor-pointer" v-if="textAdventureStore.canShowRight" @click="goRight">
        <SvgImage name="icon_arrow_right.svg" class="w-2.4rem h-2.4rem"></SvgImage>
      </div>

      <div class="
        relative
        z-777
        w-80rem
        overflow-y-auto
        box-border
        rounded-8px
        backdrop-blur-78px
        bg-[rgba(255,255,255,0.4)]
      "
      :class="[textAdventureStore.pageIndex === 5 ? 'h-46.5rem': 'h-31rem']"
      ref="messageList"
      >
        <div class="px-2.4rem py-2.4rem">
          <div class="text-2.8rem font-700 mb-1.6rem" v-if="textAdventureStore.pageIndex < 5">情节{{ chinaNumber }}</div>
          <div class="text-center mb-2.4rem" v-if="textAdventureStore.pageIndex === 5">
            <div class="text-2.8rem font-700 line-height-normal">游戏总结</div>
            <div class="text-2rem font-700 color-#FF6AF0">未来的职业发展预测</div>
          </div>
          
          <div class="text-2rem font-400 line-height-normal whitespace-pre-line" v-if="textAdventureStore.story[textAdventureStore.pageIndex]">
            {{ textAdventureStore.story[textAdventureStore.pageIndex].content }}
          </div>
        </div>
      </div>
    </div>

    <div class="w-full mt-2.4rem" v-if="textAdventureStore.pageIndex < 5">
        
        <div 
        >
        <div
        class="
        flex
        flex-items-end
        mb-1.6rem
        flex-nowrap
        px-3rem"
        v-for="(message, index) in chatLog[textAdventureStore.pageIndex]"
        :key="index"
        :class="message.isUser === true ? 'flex-justify-end' : 'flex-justify-start'">
        <div class="
          w-4rem
          h-4rem
          mr-1.6rem
          rounded-50%
          line-height-4rem
          text-center
          color-white
          font-700
          text-2.2rem
        "
        :class="message.isUser === true ? 'bg-[var(--pink-02)] order-2' : 'bg-black order-1'"
        >{{ message.user_name }}</div>

        <div class="
          color-[#000c]
          max-w-1/2
          b-rd-[8px]
          relative
          mr-1.6rem
          "
          :class="[message.isUser === true ? 'flex-self-start bg-[var(--pink-02)] order-1': 'bg-black order-2']">
          <div class="
            whitespace-pre-line
            color-white
            text-1.6rem
            font-400
            px-1.6rem
            py-0.8rem
            line-height-2.4rem
          ">
            <div>{{ message.content }}</div>
          </div>
        </div>
        </div>
      </div>
    </div>

    <div class="w-full mt-1.4rem flex-row-end" v-if="textAdventureStore.pageIndex === 5">
      <div class="
      w-14.9rem
      rounded-6px
      bg-transparent
      h-6.4rem
      color-black
      text-2rem
      border-solid
      border-1px
      line-height-6.4rem
      text-center
      font-700
      cursor-pointer
      mr-1.6rem
      "
      @click="startAgain"
      >再来一局</div>
      <div class="
      w-14.9rem
      rounded-6px
      bg-black
      h-6.4rem
      color-white
      text-2rem
      line-height-6.4rem
      text-center
      font-700
      cursor-pointer
      mr-4rem
      "
      @click="$router.push('/chat/testChat')"
      >更多测试</div>
    </div>

    <div class="footer" v-show="textAdventureStore.pageIndex < 5">
      <div class="whitespace-nowrap mr-1.6rem text-2.4rem font-700">玩家{{ userName }}：</div>
      <div class="bg-white h-56px rounded-8px w-full mr-3rem flex-col-center relative pr-75px">
        <textarea 
          resize="none"
          class="w-full h-36px outline-none border-none rounded-8px indent-2.4rem text-1.4rem line-height-32px"
          placeholder="你想和我聊些什么？......"
          show-count
          :maxlength="100"
          v-model="newMessage"
          ref="inputBoxRef"
          @keydown="carriageReturn"
          @input="userTyping" autofocus></textarea>
          <div class="
          absolute
          right-16px
          top-50%
          translate-y--50%
          text-1.6rem
          font-400
          color-[var(--text-04)]">{{ wordCount }}/100</div>
      </div>

      <button @click="readyToSend" :disabled="disabledSend" class="
            cursor-pointer
            outline-none
            border-none
            bg-transparent
            w-2.4rem
            h-2.4rem
            bg-[url(@manage/shared/assets/images/icon_send_normal.svg)]
            bg-cover
            bg-no-repeat
            bg-center
            hover:bg-[url(@manage/shared/assets/images/icon_send_hover.svg)]
            active:bg-[url(@manage/shared/assets/images/icon_send_active.svg)]
            disabled:bg-[url(@manage/shared/assets/images/icon_send_disable.svg)]
            ">
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import messageBox from '@manage/shared/components/MessageBox/index.ts';
import { useMySocket } from '@manage/shared/hooks/mySocket';
import { getFormattedDate } from '@manage/shared/utils/util'
import { genId, genIdForMsg } from "@manage/shared/utils/idGenerator.js";
import Socket from "@manage/shared/utils/http/websocket.js";
import { useLoginStore, useSocketStore } from '@manage/shared/store/index.ts';
import { useTextAdventureStore } from '@manage/shared/store/game.ts';
import { chatroomDelete } from '@manage/shared/apis/game'
import { login } from '@manage/shared/apis/login';

const loginStore = useLoginStore()
const socketStore = useSocketStore()
const textAdventureStore = useTextAdventureStore()
let currentStatus = ref<number>(0)
const router = useRouter();
interface Message {
  id?: number,
  relation_id?: number,
  user?: string,
  user_name?: string,
  message_id?: string,
  open_kf_id?: string,
  open_kf_name?: string,
  agent_id?: number,
  content?: string,
  emoji?: number,
  chat_type?: number,
  answer_or_question?: number,
  message_type?: number,
  created_at?: string,
  updated_at?: string,
  evaluateIcon?: string,
  isUser?: boolean,
  showHoverIcon?: boolean,
  hoverIcon?: string,
  dialogue_id?: string,
  status?: number,
  type?: number,
}

let chatLog = reactive<any>([])
let story:any = ref([])
let chapter = ref(0)
let realUserId:any = null
const messages = ref<Message[]>([
  // {
  //   created_at: getFormattedDate('time'),
  //   content: '',
  //   user: '',
  //   user_name: 'A',
  //   message_id: ''
  // },
  // {
  //   created_at: getFormattedDate('time'),
  //   content: '',
  //   user: '',
  //   user_name: 'B',
  //   message_id: ''
  // }
])

let countdownInterval:any = null//保存计时器
let wordCount = computed<number>(()=>{
  return newMessage.value.length | 0
})
const stepStatus = ref(1)
const newMessage = ref('');
const isConnect = ref(true);//是否连接websocket
const messageList = ref<any>(null);

const roomNumber = ref('')
const isInvite = ref(false)
const channelId = ref('')
const userName = ref('')

let dialogueId = ref('')

let isEnd = ref(true);
let isSend = ref(false)//当前用户是否发送
let tempLock = ref(false);
// let ws:any = null

// 倒计时3秒
let countIndex = ref(3)
let tempCount:any = null
function countDownGo(){
  if(countIndex.value === 0){
    if(tempCount){
      clearTimeout(tempCount)
    }
    router.push('createRoom')
  }
  else{
    tempCount = setTimeout(()=>{
      countDownGo()
      countIndex.value --;
    },1000)
  }
}
// 关闭并删除聊天室
const closeTheRoom = async() =>{
  sendMessage(6)
  if(socketStore.ws){
    socketStore.ws.close()
  }
  router.push('createRoom')  
}

const backToWaitingRoom = () => {
  if(isInvite.value){
    router.push({ name: 'waitingRoom', query: {'channel_id': channelId.value,'user_name': userName.value, 'invite': 1, 'id': roomNumber.value}});
  }
  else{
    router.push({ name: 'waitingRoom', query: {'channel_id': channelId.value,'user_name': userName.value, 'id': roomNumber.value}});
  }
}
//再来一盘
const startAgain = () =>{
  stepStatus.value = 0
  dialogueId.value = genIdForMsg(2, 18)
  textAdventureStore.reset()
  clearInterval(countdownInterval)
  countdownValue.value = 60
  newMessage.value = ''
  chatLog = []
  messages.value = []
  sendMessage(9)
  isEnd.value = false
  tempLock.value = false
  //backToWaitingRoom()
}

// let oneTimeStatus0 = ref(true)
function onReceived2(data:any) {

  // 监听服务器返回信息
  if(data){    
    let dataFormat = JSON.parse(data)
    // console.log('onReceived2',dataFormat);
    let type = dataFormat.type

    if(dataFormat&& dataFormat.is_end === false && dataFormat.is_stream_end === false){
      if(type === 9){
        // 代表b进来了
        stepStatus.value = 0
        dialogueId.value = genIdForMsg(2, 18)
        console.log('isInvite',isInvite.value);
        
        if(!isInvite.value){
          console.log("dialogueId:",dialogueId.value);
          sendMessage(2)
        }
      }
      else if(type === 7){
        // 代表断开链接
        let countIndex = ref(3)
        messageBox.info(`对面玩家离线了，即将离开聊天室（${countIndex.value}s）`)
        let tempCount:any = null
        countDownGo()
        function countDownGo(){
          if(countIndex.value === 0){
            if(tempCount){
              clearTimeout(tempCount)
            }
            router.push('createRoom')
          }
          else{
            tempCount = setTimeout(()=>{
              countDownGo()
              countIndex.value --;
            },1000)
          }
        }
        
      }
      else if(type === 6){
          if(dataFormat.user != realUserId.value){
            //其它玩家发的退出
            messageBox.info(`对面玩家${dataFormat.user_name}退出，即将离开聊天室`)
            countDownGo()
            sendMessage(6)
          }
          else{
            //自己发的退出
            messageBox.info(`正在退出，即将离开聊天室`)
            countDownGo()
          }
        }
      else if(type === 3){
        if(dataFormat.detail && dataFormat.detail.user_name !== userName.value){
          if(messages.value.length === 0){
            messages.value.push(
              {
                content: '输入中...',
                user: dataFormat.detail.user,
                user_name: dataFormat.detail.user_name,
                message_id: ''
              })
          }
          else{
            messages.value.forEach((item,index)=>{
            if(dataFormat.detail.user_name !== item.user_name){
              messages.value[index].content = '输入中...'
              messages.value[index].user_name = userName.value
              messages.value[index].user = realUserId.value
            }
            else{
              messages.value.push(
              {
                content: '输入中...',
                user: dataFormat.detail.user,
                user_name: dataFormat.detail.user_name,
                message_id: ''
              })
            }
          })
          }

        }
        //messages[0]
      }
      else if(type === 1){
        let status = dataFormat.status
        
        if(dataFormat.is_kf === true){
        //这里作用是用于控制pageIndex显示情节
        textAdventureStore.pageIndex = status
        currentStatus.value = status

        textAdventureStore.addContent(dataFormat.content)

        }

        //接受用户发送数据
        if (!dataFormat.is_kf) {
          if (messages.value.length === 0) {
            messages.value.push({
              content: dataFormat.content,
              user: dataFormat.user,
              user_name: dataFormat.user_name,
              isUser: dataFormat.user === realUserId.value ? true : false,
            })
          } else {
            messages.value.forEach((item: any, index: number) => {
              if (dataFormat.user_name === item.user_name) {
                console.log(item.user_name)
                messages.value[index].content = dataFormat.content
                messages.value[index].user_name = dataFormat.user_name
                messages.value[index].user = dataFormat.user
                messages.value[index].isUser = dataFormat.user === realUserId.value ? true : false
              } else {
                if(messages.value.length < 2){
                  messages.value.push({
                    content: dataFormat.content,
                    user: dataFormat.user,
                    user_name: dataFormat.user_name,
                    isUser: dataFormat.user === realUserId.value ? true : false,
                  })
                }
              }
            })
          }

          chatLog[currentStatus.value] = messages.value
        }

        startScrollInterval();
      }
    }

    if(dataFormat.is_stream_end === true){
      if(dataFormat.type === 1){
        if(dataFormat.is_kf === true){
          console.log('dataFormat',dataFormat);
          
          clearInterval(countdownInterval); // 清除之前的倒计时
          countdownValue.value = 60; // 重置倒计时值
          countdownInterval = setInterval(updateCountdown, 1000); // 以1秒间隔更新倒计时
          tempLock.value = false //解锁
          isEnd.value = true
          isSend.value = false
        }
      }
    }

    if(dataFormat.is_end === true){
      if(dataFormat.type === 1){
      let status = dataFormat.status
      dialogueId.value = dataFormat.dialogue_id
      
      switch(status){
          case 0:
            break;
          case 1:
            stepStatus.value = 1 
            break;
          case 2:
            stepStatus.value = 2 
            break;
          case 3:
            stepStatus.value = 3 
            break;
          case 4:
            stepStatus.value = 4
            break;
          case 5:
            stepStatus.value = 5 
            break;
          case 6:
            break;
          default:
            break;
        }
      }
    }
  }
}

const goLeft = () =>{
  textAdventureStore.goLeft()
}
const goRight = () =>{
  textAdventureStore.goRight()
}

let disabledSend = computed(() => {
  return !isConnect.value || tempLock.value || !isEnd.value
})

const chinaNumber= computed(() => {
  let map = ['一','二','三','四','五','六']
  return map[textAdventureStore.pageIndex]
})

let duration = ref(60); // 总倒计时时间（秒）
let countdownValue = ref(60); // 当前剩余时间（秒）
// 计算倒计时百分比
let percentage = computed(() => {
  let time = (countdownValue.value / duration.value) * 100  
  return time;
})

// 计算倒计时文本
const countdown = computed(() => {
  return Math.ceil(countdownValue.value);
})

// 更新倒计时
const updateCountdown = () => {
  if (countdownValue.value > 0) {
    countdownValue.value--;
  }
  else{
    // 没发送，那么就需要发
    if(isSend.value === false){
      readyToSend()
    }
    clearInterval(countdownInterval)
  }
}

const carriageReturn = (event:any) => {
  if (event.keyCode == 13) {
    if (!event.metaKey) {
      event.preventDefault();
      // stepStatus.value = 1;
      sendMessage(1);
    } else {
      newMessage.value = newMessage.value + "\n";
    }
  }
}

const readyToSend = () =>{
  // stepStatus.value = 2;
  sendMessage(1)
}


// 发送消息
const sendMessage = (type:number) => {
  if(isConnect.value === false){
    connectFail()
  }

  if(disabledSend.value){
    return
  }

  let sendData = {
    'typeStatus': 'sendMsg',
    'channel_id': channelId.value,
    // 'message_id': messageId,''
    'dialogue_id': dialogueId.value,
    'content': '',
    'user': window.localStorage.getItem('token') ? window.localStorage.getItem('newUserId') : window.localStorage.getItem('userId') || genId('userId',1),
    'user_name': userName.value,
    'kf_id': 'uqTIN13j6HKg2nYSyuTay6mHRQULNRSU',
    'open_kf_id': 'uqTIN13j6HKg2nYSyuTay6mHRQULNRSU',
    'type': type,
    'status': stepStatus.value,
    "heartbeat": false
  }

  if(type === 1){
    tempLock.value = true
    sendData.content = newMessage.value
    isSend.value = true
    isEnd.value = false;
    newMessage.value = ''
  }

  if(type === 2){
    isEnd.value = false;
  }
  
  console.log(socketStore.ws);
  
  if(socketStore.ws){
    socketStore.ws?.sendMsg(sendData)
  }
};

const scrollToBottom = async() => {
  await nextTick()
  const container = messageList._value;
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
};
let scrollInterval: NodeJS.Timeout | null = null;

const startScrollInterval = () => {
  scrollInterval = setInterval(scrollToBottom, 1000);
};

const stopScrollInterval = () => {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
};

watchEffect(() => {
  if (messageList._value) {
    messageList._value.addEventListener('scroll', stopScrollInterval);
  }
});

const inputBoxRef = ref<any>();
nextTick(() => {
  inputBoxRef?.value.focus()
})

const userTyping = () => {
  checkOverflow()
  // sendMessage(3)
}

const checkOverflow = () =>{
  const inputBox:any = inputBoxRef.value;
  
  if(inputBox){
    const lineHeight = parseInt(window.getComputedStyle(inputBox).height, 10);    
    const lines = inputBox.scrollHeight / lineHeight;
    
    if (lines > 1) {
      inputBox.classList.add('h-full');
      inputBox.classList.remove('h-36px');
    } else {
      inputBox.classList.add('h-36px');
      inputBox.classList.remove('h-full');
    }
  }

}



const getCurrentRouter = () => {
  let query = router.currentRoute.value.query
  
  if(query.id){roomNumber.value = query.id as string}
  if(query.channel_id){channelId.value = query.channel_id as string}  
  if(query.user_name){userName.value = query.user_name as string}
  if(query.invite){isInvite.value = query.invite as string === '1'? true : false}
}


const handlerUnload = (event:any) => {
  // Cancel the event as stated by the standard.
  // event.preventDefault();
  // event.returnValue = ''
  // // Chrome requires returnValue to be set.
  // event.returnValue = '离开将不保存当前数据，如需重开右上角关闭房间';
}

const connectFail = () => {
  messageBox.info('该房间断开，请重新开始')
  router.push('createRoom')
}

const handlerWebsocket = () =>{
  textAdventureStore.reset()
  if(socketStore.ws){
    socketStore.replaceCallBack(onReceived2)  
    socketStore.ws.callback = onReceived2
  }
}
onMounted(()=>{
  //socketStore.initWebSocket(realUserId.value, userName.value, onReceived);
  window.addEventListener("beforeunload", handlerUnload);
  window.addEventListener('unload', handlerUnload);
  realUserId = computed(()=>{
    let result = ''
    result = window.localStorage.getItem('token') as string ? window.localStorage.getItem('newUserId') as string : window.localStorage.getItem('userId') as string || genId('userId',1) as string;

    return result;
  })

  handlerWebsocket()
  getCurrentRouter()
  
  watch(()=> currentStatus.value, (newValue, oldValue)=>{
    console.log('newValue123:',newValue);
    messages.value = []
    clearInterval(countdownInterval); // 清除之前的倒计时
    countdownValue.value = 60; // 重置倒计时值
  })

  // watch(()=> isConnect.value, async(newValue) => {    
  //   if(newValue === false){
  //     connectFail()
  //   }
  // });

  if(socketStore.ws){
    // 监听连接状态变化
    watch(()=> socketStore.ws.status, async(newValue) => {
      console.log('myVariable 变化了:', newValue);
      if(newValue === 'open'){
        isConnect.value = true;
      }
      else{
        isConnect.value = false;
        connectFail();
      }
    });
  }
  else{
    isConnect.value = false;
    connectFail();
  }


  if(isInvite.value){
    sendMessage(9)
  }
})

onBeforeUnmount(()=>{
  window.addEventListener('beforeunload', handlerUnload);
})

// onBeforeRouteLeave((to, from, next) => {
//   if(socketStore.ws && to.path !== '/waitingRoom'){
//     sendMessage(6)
//     socketStore.ws.close();
//   }
//   next();
// })
</script>

<style scoped>
/* css部分 */


</style>

