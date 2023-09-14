<template>
  <div class="wh-full flex-col-start">
    <div class="relative mt-130px">
      <div class="absolute top--100px left-0 z-666">
        <SvgImage name="cat_white.svg" class="w-26.1rem h-30.8rem"></SvgImage>
      </div>
      <div class="absolute top--100px left-0 z-666">
        <SvgImage name="star_group.svg" class="w-23rem h-9rem"></SvgImage>
      </div>
      <div class="absolute top--114px right-48px z-666">
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
      <div class="absolute right-0 top--58px cursor-pointer" @click="$router.push('createRoom')">
        <SvgImage name="icon_close.svg" class="w-24px h-24px"></SvgImage>
      </div>
      <div class="absolute left--3.2rem top-50% translate-y--50% cursor-pointer">
        <SvgImage name="icon_arrow_left.svg" class="w-2.4rem h-2.4rem"></SvgImage>
      </div>
      <div class="absolute right--3.2rem top-50% translate-y--50% cursor-pointer">
        <SvgImage name="icon_arrow_right.svg" class="w-2.4rem h-2.4rem"></SvgImage>
      </div>

      <div class="
        relative
        z-777
        w-80rem
        min-h-31rem
        box-border
        rounded-8px
        backdrop-blur-78px
        bg-[rgba(255,255,255,0.4)]
      ">
        <div class="overflow-auto px-2.4rem py-2.4rem">
          <div class="text-2.8rem font-700 mb-1.6rem">情节一</div>
          <div class="text-2rem font-400 line-height-normal">
            当然，欢迎加入这个文字冒险游戏！我将担任你们的Dungeon Master (DM)。这个世界是一个充满魔法、神秘和未知的地方，你们是一队探险家，现在正站在一条分叉的路口。 - 玩家A：一个擅长魔法的年轻巫师。 - 玩家B：一个拥有强大肉体力量的战士。
          </div>
        </div>
      </div>
    </div>

    <div class="w-full mt-2.4rem">
      <div
        class="
        flex
        flex-items-end
        mb-1.6rem
        flex-nowrap
        px-3rem"
        v-for="(message, index) in messages"
        :key="index"
        :class="message.isUser === true ? 'flex-justify-end' : 'flex-justify-start'">
        <div class="
          w-4rem
          h-4rem
          mr-0.8rem
          bg-black
          rounded-50%
          line-height-4rem
          text-center
          color-white
          font-700
          text-2.2rem
        "
        v-if="!message.isUser"
        >B</div>

        <div class="
          flex-self-start
          color-[#000c]
          max-w-1/2
          b-rd-[8px]
          relative
          "
          :class="[message.isUser === true ? 'bg-[var(--pink-02)]' : 'bg-black']">
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

        <div class="
          w-4rem
          h-4rem
          ml-0.8rem
          bg-[var(--pink-02)]
          rounded-50%
          line-height-4rem
          text-center
          color-white
          font-700
          text-2.2rem
        "
        v-if="message.isUser"
        >A</div>
      </div>
    </div>

    <div class="footer">
      <div class="whitespace-nowrap mr-1.6rem text-2.4rem font-700">玩家B：</div>
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
          @input="checkOverflow" autofocus></textarea>
          <div class="
          absolute
          right-16px
          top-50%
          translate-y--50%
          text-1.6rem
          font-400
          color-[var(--text-04)]">{{ wordCount }}/100</div>
      </div>

      <button @click="sendMessage(1)" :disabled="disabledSend" class="
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
import { getFormattedDate } from '@manage/shared/utils/util'
import { genId, genIdForMsg } from "@manage/shared/utils/idGenerator.js";
import Socket from "@manage/shared/utils/http/websocket.js";
import { userMessage, useLoginStore, useChatStore, useCounterStore } from '@manage/shared/store/index.ts';
const loginStore = useLoginStore()
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
}

const messages = ref<Message[]>([
  {
    created_at: getFormattedDate('time'),
    content: '123',
    emoji: 0,
    isUser: true,
    message_id: '1231231312312'
  },
  {
    created_at: getFormattedDate('time'),
    content: '4123',
    emoji: 0,
    isUser: false,
    message_id: '1231231312312'
  }
])

let countDownTime:any = null//保存计时器
let wordCount = ref(0)
const stepStatus = ref(0)
const newMessage = ref('');
const isConnect = ref(true);//是否连接websocket
const scrollBottomFlag = ref(false);
const roomNumber = ref('')
const channelId = ref('')
const userName = ref('')

let isEnd = ref(true);
let ws:any = null

const realUserId = computed(()=>{
  let result = ''
  result = loginStore.token ? loginStore.newUserId : loginStore.userId;

  return result;
})

const initWebSocket = () => {
  // scoket连接
  ws = reactive(new Socket({
    url: `${import.meta.env.VITE_API_WEBSOCKET_URL}/chatroom/socket?user=${realUserId.value}`,
    name: '',			// name
    isHeart:true,			// 是否心跳
    isReconnection:true,		// 是否断开重连
    received: function(data:any){
      // 监听服务器返回信息
      console.log("received",data)
      let dataFormat = JSON.parse(data)
      const today = getFormattedDate();


    }
  }));
  ws.connect();
}

let disabledSend = computed(() => {
  return !isConnect.value || !isEnd.value
})
let duration = ref(60); // 总倒计时时间（秒）
let currentTime = ref(60); // 当前剩余时间（秒）
// 计算倒计时百分比
let percentage = computed(() => {
  let time = (currentTime.value / duration.value) * 100  
  return time;
})

// 计算倒计时文本
const countdown = computed(() => {
  return Math.ceil(currentTime.value);
})

// 更新倒计时
const updateCountdown = () => {
  if (currentTime.value > 0) {
    currentTime.value--;
  }
  else{
    clearInterval(countDownTime)
  }
}

const carriageReturn = (event:any) => {
  if (event.keyCode == 13) {
    if (!event.metaKey) {
      event.preventDefault();
      sendMessage(1);
    } else {
      newMessage.value = newMessage.value + "\n";
    }
  }
}
// 发送消息
const sendMessage = (type:number) => {
  const today = getFormattedDate();
  let messageId = genIdForMsg(2 ,20);
  // messages.value.push({
  //   created_at: getFormattedDate('time'),
  //   content: newMessage.value,
  //   emoji: 0,
  //   isUser: true,
  //   message_id: messageId
  // })

  let sendData = {
    'typeStatus': 'sendMsg',
    'channel_id': channelId.value,
    // 'message_id': messageId,
    'user': window.localStorage.getItem('token') ? window.localStorage.getItem('newUserId') : window.localStorage.getItem('userId') || genId('userId',1),
    'user_name': userName,
    'kf_id': 'uqTIN13j6HKg2nYSyuTay6mHRQULNRSU',
    'open_kf_id': 'uqTIN13j6HKg2nYSyuTay6mHRQULNRSU',
    'type': type,
    'status': stepStatus.value,
    "heartbeat": false
  }
  // ws.sendMsg(sendData)
};

const inputBoxRef = ref<any>();
nextTick(() => {
  inputBoxRef?.value.focus()
})
const checkOverflow = () =>{
  const inputBox:any = inputBoxRef.value;
  if(newMessage){
    wordCount.value = newMessage.value.length
  }
  
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


const initData = () => {
  sendMessage(2)
}

const getCurrentRouter = () => {
  let query = router.currentRoute.value.query
  if(query.id){roomNumber.value = query.id as string}
  if(query.channel_id){channelId.value = query.channel_id as string}  
  if(query.user_name){userName.value = query.userName as string}
}

onMounted(()=>{
  countDownTime = setInterval(updateCountdown, 1000);
  initWebSocket();
  getCurrentRouter()
  // 监听连接状态变化
  watch(()=> ws.status, async(newValue) => {
    console.log('myVariable 变化了:', newValue);
    if(newValue === 'open'){
      isConnect.value = true;
      
      sendMessage(2)
    }
    else{
      isConnect.value = false;
    }
  });
})
</script>

<style scoped>
/* css部分 */


</style>

