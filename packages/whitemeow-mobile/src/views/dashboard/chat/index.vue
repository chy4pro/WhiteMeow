<script setup lang="ts">
// element-plus
// import "element-plus/theme-chalk/el-loading.css";
// import "element-plus/theme-chalk/el-notification.css";

import { ref, nextTick} from 'vue';
import {getEmojiUrl } from '@manage/shared/utils/index.ts'
import { chat } from '@manage/shared/apis/chat.ts'
import Socket from "@manage/shared/utils/http/websocket.js";
import { genId,genIdForMsg } from "@manage/shared/utils/idGenerator.js";
import { userMessage, useLoginStore, useChatStore, useCounterStore } from '@manage/shared/store/index.ts';
const countStore = useCounterStore()
const chatStore = useChatStore()

import { uniqWith } from 'lodash-es'
import messageBox from '@manage/shared/components/MessageBox/index.ts';

// counter.init();
const messageStore = userMessage();
var chatLogsMap = reactive(new Map<string, Message[]>());
const messageList = ref<any>(null);
let ws:any = null

let isEnd = ref(true);
let disabledSend = computed(() => {
  return !isConnect.value || !isEnd.value
})

const newMessage = ref('');
const pageTotal = ref(0);
const isConnect = ref(false);//是否连接websocket
const messages = ref<any>([]);
const scrollBottomFlag = ref(false);
const recordList = reactive({
  page: 0,
  page_size: 10,
  user: window.localStorage.getItem('token') ? window.localStorage.getItem('newUserId') : window.localStorage.getItem('userId') || genId('userId',1),
  open_kf_id: 'wkWpQ2GQAAPtHdT-Jdk4ltXYZKlnHoSA',
  start_created_at: '',
  end_created_at: ''
});




const hoverHeartIcon = (message:any) =>{
  if(message.evaluateIcon !== 'heart'){
    message.showHoverIcon = true
  }
}

const clickHeart = (message:Message) => {
  let old = message.evaluateIcon;
  if(old === ''){
    message.hoverIcon = 'heart_active'
    message.evaluateIcon = 'heart'
    message.showHoverIcon = false
  }
  else if(old === 'heart'){
    message.hoverIcon = 'heart'
    message.evaluateIcon = ''
    message.showHoverIcon = true
  }
}
const inputBoxRef = ref<any>();

// const checkOverflow = () =>{
//   const inputBox:any = inputBoxRef.value;
//   if(inputBox){
//     const lineHeight = parseInt(window.getComputedStyle(inputBox).height, 10);    
//     const lines = inputBox.scrollHeight / lineHeight;
    
//     if (lines > 1) {
//       inputBox.classList.add('h-full');
//       inputBox.classList.remove('h-36px');
//     } else {
//       inputBox.classList.add('h-36px');
//       inputBox.classList.remove('h-full');
//     }
//   }

// }

function getFormattedDate(format = 'date') {
  const formatNumber = (number: any) => {
    return number < 10 ? '0' + number : number;
  }
  const now = new Date();

  const year = now.getFullYear();
  const month = formatNumber(now.getMonth() + 1); // Month is zero-based
  const day = formatNumber(now.getDate());
  const hours = formatNumber(now.getHours());
  const minutes = formatNumber(now.getMinutes());
  const seconds = formatNumber(now.getSeconds());

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  const formattedDate= `${year}-${month}-${day}`;

  if(format === 'time'){
    return formattedDateTime;
  }
  else{
    return formattedDate;
  }
}

const isValidText = (text:string) => {
  //只做非空判断
  const regex = /\S/;
  let str = text.trim()

  return regex.test(str); 
}
const carriageReturn = (event:any) => {
  if (event.keyCode == 13) {
    if (!event.metaKey) {
      event.preventDefault();
      sendMessage();
    } else {
      newMessage.value = newMessage.value + "\n";
    }
  }
}
// 发送消息
const sendMessage = () => {
  if(countStore.index === 25){
    messageBox.info('25次数已用完，请明天再来哟')
    return
  }

  if(isConnect.value === true){
    if(disabledSend.value){
      return
    }

    if (isValidText(newMessage.value)) {
      // 处理非空的 messages.value
      const today = getFormattedDate();
      let messageId = genIdForMsg(2 ,20);
      messages.value.push({
        created_at: getFormattedDate('time'),
        content: newMessage.value,
        emoji: 0,
        isUser: true,
        message_id: messageId
      });
      if (!chatLogsMap.has(today)) {
        chatLogsMap.set(today, []); 
      }

      let getToday = chatLogsMap.get(today)
        if(getToday){
          getToday.push({
            created_at: getFormattedDate('time'),
            content: newMessage.value,
            emoji: 0,
            isUser: true,
            message_id: messageId
          })
        }

      // const addIndex = () => {
      //   counter.add();
      // };
      // addIndex();
      
      if(!isConnect.value){
        messageBox.info('白小喵正在上线中...')
      }

      if(!isEnd.value){
        messageBox.info('请等等哦~')
      }
      // 发送消息
      let sendData = {
        "typeStatus": 'sendMsg',
        "message_id": messageId,
        "message":newMessage.value,
        "user": window.localStorage.getItem('token') ? window.localStorage.getItem('newUserId') : window.localStorage.getItem('userId') || genId('userId',1),
        "open_kf_id": 'wkWpQ2GQAAPtHdT-Jdk4ltXYZKlnHoSA'//"wkWpQ2GQAAPtHdT-Jdk4ltXYZKlnHoSA"
      }
      ws.sendMsg(sendData)
      newMessage.value = ''
      countStore.add();
      scrollBottomFlag.value = true;
      scrollToBottom();
    }
    else{
      messageBox.info('请输入点什么吧~')
    }
  }
};

const scrollToBottom = async() => {
  await nextTick()
  const container = messageList._value;
  if (container) {
    container.scrollTop = container.scrollHeight;
    scrollBottomFlag.value = false;
  }
};

const scrollToTop = async() => {
  await nextTick()
  const container = messageList._value;
  if (container) {
    container.scrollTop = 0;
    scrollBottomFlag.value = false;
  }
};

// const showMore = () => {
//   recordList.page += 1;
//   scrollBottomFlag.value = false;

//   getChatRecord();
// };


// const topDistance = () =>{
//   if (targetDiv.value) {
//     const rect = targetDiv.value.getBoundingClientRect();
//     const distanceToTop = rect.top;
//     console.log('距离顶部的像素距离：', distanceToTop);
//     if(distanceToTop < 66){

//     }
//   }
// }
// const formattedDate = (timestamp:any) => {
//   const date = new Date(timestamp)
//   const year = date.getFullYear()
//   const month = (date.getMonth() + 1).toString().padStart(2, '0')  
//   const day = date.getDate().toString().padStart(2, '0')
//   return `${year}-${month}-${day}`
// }
function formattedDate(timestamp:any) {
  const formatNumber = (number: any) => {
    return number < 10 ? '0' + number : number;
  }
  const now = new Date(parseInt(timestamp));

  const year = now.getFullYear();
  const month = formatNumber(now.getMonth() + 1); // Month is zero-based
  const day = formatNumber(now.getDate());

  const formattedDate= `${year}-${month}-${day}`;
  return formattedDate;
}
const initData = () => {
  recordList.page += 1;
  countStore.init();
  // storage.setItem('auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDgyNDg2NTUsImlhdCI6MTY4MjMyODY1NSwidXNlcklkIjoyfQ.c54BKBpqCYhnnZU6LEsP04th9VUZ2q2jXEYmtu2k38U');
  scrollBottomFlag.value = true;

  //每日25条限制，根据用户上次进入的时间来判断
  if(chatStore.enterStartDate){    
    const today = getFormattedDate()
    let enterStartDate = formattedDate(chatStore.enterStartDate)

    if(enterStartDate !== today){
      countStore.index = 0
    }

    chatStore.initEnterStartDate();
  }
  else{
    chatStore.initEnterStartDate();
  }
}

const initWebSocket = () => {
  let current_message_id:string = ''

  // scoket连接
  ws = reactive(new Socket({
    url: import.meta.env.VITE_API_WEBSOCKET_URL + '/customer/chat',//'ws://43.153.76.9:8888/customer/chat',
    name: '',			// name
    isHeart:true,			// 是否心跳
    isReconnection:true,		// 是否断开重连
    received: function(data:any){
      // 监听服务器返回信息
        console.log("received",data)
        let dataFormat = JSON.parse(data)
        const today = getFormattedDate();

        if (!chatLogsMap.has(today)) {
          chatLogsMap.set(today, []); 
        }
        else{
          const chatLogs = chatLogsMap.get(today);
          if(chatLogs){
            if(dataFormat.message_id !== '' && dataFormat.is_end === false && dataFormat.message !== ''){
              if(dataFormat.message_id === current_message_id){
                const index = chatLogs.findIndex((item:any) => item.message_id === current_message_id && item.isUser === false);
                const currentMessage = chatLogs[index];
                
                currentMessage.content += dataFormat.message
                //chatLogs[chatLogs.length - 1].content += dataFormat.message
                
              }
              else{
                chatLogs.push({
                  content: dataFormat.error_message.length>0 ? dataFormat.error_message : dataFormat.message,
                  created_at: getFormattedDate('time'),
                  evaluateIcon: '',
                  hoverIcon: 'heart',
                  showHoverIcon: false,
                  emoji: dataFormat.emoji,
                  message_id: dataFormat.message_id,
                  isUser: false
                });
              }

              current_message_id = dataFormat.message_id ? dataFormat.message_id : ''
              scrollToBottom();
            }

            // update emoji
            if(dataFormat.is_end === true){
              if(dataFormat.message_id === current_message_id){
                const index = messages.value.findIndex((item:any) => item.message_id === current_message_id);
                const currentMessage = messages.value[index];
                currentMessage.emoji = dataFormat.emoji
              }
            }

            isEnd.value = dataFormat.is_end
          }
        }
        
        //循环map并且根据message_id和created_at判断是否有重复的消息
        for (let [key, value] of chatLogsMap) {
          chatLogsMap.set(key, uniqWith(value, (obj1, obj2) => {
            return obj1.created_at === obj2.created_at && obj1.message_id === obj2.message_id;
          }))
        }
        
        for (let [key, value] of chatLogsMap) {
          chatLogsMap.set(key, sortChatLogs(value))
        }
    }
  }));
  ws.connect();
}

const sayHello = () =>{
  const today = getFormattedDate();
      let messageId = genIdForMsg(2 ,20);
      let helloWord = '吃了吗，朋友'
      messages.value.push({
        created_at: getFormattedDate('time'),
        content: helloWord,
        emoji: 0,
        isUser: false,
        message_id: messageId,
        evaluateIcon: '',
        hoverIcon: 'heart',
      });
      if (!chatLogsMap.has(today)) {
        chatLogsMap.set(today, []); 
      }

      let getToday = chatLogsMap.get(today)
      if(getToday){
        getToday.push({
          created_at: getFormattedDate('time'),
          content: helloWord,
          emoji: 0,
          isUser: false,
          message_id: messageId,
          evaluateIcon: '',
          hoverIcon: 'heart',
        })
      }
}
onMounted(()=>{
  initData();
  initWebSocket();
  checkChatRecord();
  sayHello();
  // 监听连接状态变化
  watch(()=> ws.status, async(newValue) => {
    console.log('myVariable 变化了:', newValue);
    if(newValue === 'open'){
      isConnect.value = true;
      // let result = await getChatRecord();
      // if(Object.keys(result as object).length > 0){
      //   sendFirstMessage();
      // }
    }
    else{
      isConnect.value = false;
    }
  });
}) 

nextTick(() => {
  inputBoxRef?.value.focus()
})
// onBeforeRouteLeave((to, from, next) => {
//   if(ws){
//     ws.close();
//   }
//   next();
// })

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

const chatLogsSplit = (chatLogs: Message[]): Map<string, Message[]>=>{

  chatLogs.forEach(log => {
    let date:string = '';
    if(log && log.created_at){
      date = log.created_at.split(' ')[0]; // 取日期部分
    }
    
    if (!chatLogsMap.has(date)) {
      chatLogsMap.set(date, []); 
    }
    
    const logs = chatLogsMap.get(date);
    let sameArr = logs?.filter(item => item.created_at === log.created_at)
    if (logs && sameArr && sameArr.length === 0) {
      logs.push(log); 
    }
  })
  
  //按照key值排序，按照日期 yyyy-mm-dd 正序排列
  let chatLogsMapSort = new Map([...chatLogsMap.entries()].sort((a, b) => {
    return Date.parse(a[0]) - Date.parse(b[0])
  }))
  chatLogsMap = chatLogsMapSort;

  return chatLogsMap;

}
const sortChatLogs = (chatLogs: Message[]): Message[] => {
  let chatLogsSort = chatLogs.sort((a, b) => {
    return Date.parse(a.created_at as string) - Date.parse(b.created_at as string)
  })
  return chatLogsSort;
}
// 查询是否有聊天记录
const checkChatRecord = async() => {
  const res = await chat(recordList);
  let result:any = res.data;
  recordList.page = 0;
  pageTotal.value = result.total as number;
}



</script>

<template>
  <div class="chat-index">
    <!-- <div class="chat">
      <div class="isCat comm">
        <div class="cat-img">
          <img :src="Cat" alt="" />
        </div>
        <div class="text">
          欢迎来看小喵测测，来看看你当前的心理色彩吧欢迎来看小喵测测，来看看你当前的心理色彩吧
        </div>
      </div>

      <div class="isMe comm">
        <div class="text">
          欢迎来看小喵测测，来看看你当前的心理色彩吧欢迎来看小喵测测，来看看你当前的心理色彩吧
        </div>
      </div>
    </div> -->

    <div v-for="[date, logs] in chatLogsMap" :key="date">
        <div class="text-center mt-1.7rem color-#666668 text-1.4rem mb-1.3rem">
          {{ date }}
        </div>
        <div class="flex flex-items-end mb-1.3rem flex-nowrap px-3rem " v-for="(message, index) in logs" :key="index"
          :class="message.isUser === true ? 'flex-justify-end' : 'flex-justify-start'">
          <div class="
                flex-self-start
                color-[#000c]
                max-w-1/2
                b-rd-[8px]
                relative
                " :class="[message.isUser === true ? 'bg-[#F5C4EA]' : 'bg-[#fff]']"
            @mouseenter="hoverHeartIcon(message)" @mouseleave="message.showHoverIcon = false">
            <div class="
                  whitespace-pre-line
                  text-1.4rem
                  font-400
                  px-1.6rem
                  py-0.8rem
                  line-height-2.4rem
                ">

              <div>{{ message.content }}</div>
              <div class="text-right cursor-pointer" v-show="!message.showHoverIcon" @click="clickHeart(message)">
                <SvgImage :name="`icon_heart.svg`" class="w-1.6rem h-1.6rem"
                  v-show="message.evaluateIcon" />
              </div>
              <div class="
                w-3.2rem
                h-2.4rem
              hover:bg-[#FFDFFC]
                rounded-4px
                uno-shadow-[0px,4px,4px,0px]+[rgba(0,0,0,0.1)]
                absolute
                top--12px
                right-11px
                cursor-pointer
              " @click="clickHeart(message)" v-show="message.showHoverIcon && !message.isUser"
                :class="message.hoverIcon === 'heart_active' ? 'bg-[#FFDFFC]' : 'bg-white'">
                <SvgImage :name="`icon_${message.hoverIcon}.svg`" class="
                    w-1.6rem
                    h-1.6rem
                    mx-0.8rem
                    my-0.4rem" />
              </div>
            </div>

            <div class="absolute bottom-0" :class="message.isUser === true ? ' right--9px' : 'left--9px'">
              <SvgImage name="chat-triangle-pink.svg" class="w-19px h-15px" v-if="message.isUser === true" />
              <SvgImage name="chat-triangle-white.svg" class="w-19px h-15px" v-else />
            </div>
          </div>

          <div class="
                w-5
                h-5
                center-box
              ">
            <img :src="getEmojiUrl(message.emoji?.toString() || '')" alt="" v-if="message.emoji !== 0" />
          </div>
        </div>
      </div>
    <div class="send-box">
      <input
        @keyup.enter="carriageReturn"
        v-model="newMessage"
        type="text"
        ref="inputBoxRef"
        placeholder="你想和我聊些什么？......"
      />
      <!-- <img @click="sendMessage()" :src="Send" alt="" /> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
input::input-placeholder {
  color: rgba(0, 0, 0, 0.4);
  font-size: 1.4rem;
  font-weight: 500;
}
input::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.4);
  font-size: 1.4rem;
  font-weight: 500;
}

input::-moz-placeholder {
  color: rgba(0, 0, 0, 0.4);
  font-size: 1.4rem;
  font-weight: 500;
}

input::-ms-input-placeholder {
  color: rgba(0, 0, 0, 0.4);
  font-size: 1.4rem;
  font-weight: 500;
}

.comm:last-child {
  margin-bottom: 0 !important;
}

.chat-index {
  height: 100%;

  .chat {
    height: calc(100% - 5.6rem);
    overflow-y: auto;
    background-color: rgba(242, 242, 242, 1);
    padding: 1.6rem;

    .comm {
      margin-bottom: 4rem;
    }

    .text {
      padding: 1.6rem;
      background-color: #fff;
      border-top-left-radius: 2.4rem;
      border-top-right-radius: 2.4rem;
      border-bottom-right-radius: 2.4rem;
      border-bottom-left-radius: 0.4rem;
      line-height: 2.5rem;
      color: rgba(0, 0, 0, 0.8);
      font-size: 1.4rem;
      max-width: 70%;
    }

    .isMe {
      display: flex;
      justify-content: flex-end;

      .text {
        background: rgba(241, 143, 219, 0.5);
        border-bottom-right-radius: 0.4rem;
        border-bottom-left-radius: 2.4rem;
      }
    }

    .isCat {
      display: flex;

      .cat-img {
        display: flex;
        align-items: flex-end;
        margin-right: 2rem;

        img {
          width: 4rem;
          height: 4rem;
        }
      }
    }
  }

  .send-box {
    height: 5.6rem;
    width: 100%;
    padding: 0.8rem 1.6rem 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(248, 248, 248, 1);

    input {
      outline: none;
      border: none;
      height: 100%;
      padding: 0.8rem;
      border-radius: 0.8rem;
      flex: 1;
      margin-right: 0.8rem;
      color: rgba(0, 0, 0, 1);
      font-size: 1.4rem;
    }

    img {
      width: 2.4rem;
      height: 2.4rem;
    }
  }
}
</style>
