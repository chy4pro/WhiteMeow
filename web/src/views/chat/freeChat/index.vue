<template>
  <div class="header">
    <SvgImage name="Avatar.svg" class="w-4rem h-4rem mr-1.6rem" />
    <div class="font-600 text-1.6rem line-height-2rem">白小喵</div>
  </div>
  <div class="main">
    <div class="w-full h-[calc(100%-10.4rem)] box-border overflow-y-auto relative" ref="messageList">

      <div class="text-center mt-1.6rem cursor-pointer" @click="showMore"
        v-if="recordList.page * recordList.page_size < pageTotal">
        <div class="w-2.4rem h-2.4rem flex-col-center mx-a">
          <SvgImage name="icon_more.svg" class="w-1.4rem h-12.6px" />
        </div>
        <div class="color-[rgba(0,0,0,0.4)] text-1.4rem">查看历史聊天记录</div>
      </div>

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
      <!-- <div class="w-full h-10.4rem"></div> -->

    </div>
  </div>
  <div class="footer">
    <div class="bg-white h-56px rounded-8px w-full mr-3rem flex-col-center">
      <textarea cols="25" rows="5" resize="none"
        class="w-full h-36px outline-none border-none rounded-8px indent-2.4rem text-1.4rem line-height-32px"
        placeholder="你想和我聊些什么？......" v-model="newMessage" ref="inputBoxRef" @keydown="carriageReturn"
        @input="checkOverflow" autofocus></textarea>
    </div>

    <button @click="sendMessage" :disabled="disabledSend" class="
          cursor-pointer
          outline-none
          border-none
          bg-transparent
          w-2.4rem
          h-2.4rem
          bg-[url(@/assets/images/icon_send_normal.svg)]
          bg-cover
          bg-no-repeat
          bg-center
          hover:bg-[url(@/assets/images/icon_send_hover.svg)]
          active:bg-[url(@/assets/images/icon_send_active.svg)]
          disabled:bg-[url(@/assets/images/icon_send_disable.svg)]
          ">
    </button>
  </div>
</template>
<script setup lang="ts">
// element-plus
// import "element-plus/theme-chalk/el-loading.css";
// import "element-plus/theme-chalk/el-notification.css";

import { ref } from 'vue';
import { storage, scrollTo, getImageUrl, getEmojiUrl } from '@/utils/index.ts'
import { chat } from '@/apis/chat.ts'
import Socket from "@/utils/http/websocket.js";
import { genId,genIdForMsg } from "@/utils/idGenerator.js";
import { userMessage, useLoginStore, useChatStore, useCounterStore } from '@/store/index.ts';
const countStore = useCounterStore()
const chatStore = useChatStore()
import * as dayjs from 'dayjs'

import { message } from 'ant-design-vue';
import { isEqual, uniqWith, uniqBy } from 'lodash-es'
import messageBox from '@/components/MessageBox/index.ts';

// counter.init();
const messageStore = userMessage();
const loginStore = useLoginStore
var chatLogsMap = reactive(new Map<string, Message[]>());
const loading = ref(false);
const messageList = ref<any>(null);
let ws:any = null
const targetDiv = ref(null); // 创建 ref 来引用目标 <div> 元素

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

const sendBtnName = ref('icon24_send.svg')

// 发送首页传过来的第一条消息
const sendFirstMessage = ()=>{
  if(messageStore.firstMessage){
    newMessage.value = messageStore.firstMessage
    messageStore.firstMessage = ''
    sendMessage()
  }
}

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
const inputBoxRef = ref(null);

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

const showMore = () => {
  recordList.page += 1;
  scrollBottomFlag.value = false;

  getChatRecord();
};


// const topDistance = () =>{
//   if (targetDiv.value) {
//     const rect = targetDiv.value.getBoundingClientRect();
//     const distanceToTop = rect.top;
//     console.log('距离顶部的像素距离：', distanceToTop);
//     if(distanceToTop < 66){

//     }
//   }
// }
const initData = () => {
  recordList.page += 1;
  countStore.init();
  storage.setItem('auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDgyNDg2NTUsImlhdCI6MTY4MjMyODY1NSwidXNlcklkIjoyfQ.c54BKBpqCYhnnZU6LEsP04th9VUZ2q2jXEYmtu2k38U');
  scrollBottomFlag.value = true;

  //每日25条限制，根据用户上次进入的时间来判断
  if(chatStore.enterStartDate){
    const today = getFormattedDate()
    let enterStartDate = dayjs(chatStore.enterStartDate).format('YYYY-MM-DD') 
    
    if(enterStartDate !== today){
      countStore.index = 0
    }
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
  watch(()=> ws.status, async(newValue, oldValue) => {
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

onBeforeRouteLeave((to, from, next) => {
  ws.close();
  next();
})

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

// 获取聊天记录
const getChatRecord = async() => {
  try {
    // loading
    //loading.value = true

    const res = await chat(recordList);
    let result:any = res.data;
    console.log(result)

    //loading.value = false

    if(result && result.list && result.list.length > 0){
      result.list.reverse();
      if(messages.value.length>0){
        let resultList = result.list.map((item: any) => {
          return {
            ...item,
            isUser: item.answer_or_question === 1 ? true : false,
            evaluateIcon: '',
            hoverIcon: item.answer_or_question === 1 ? '' : 'heart',
          }
        })
        messages.value = resultList.concat(messages.value);
      }
      else{
        messages.value = result.list.map((item: any) => {
          return {
            ...item,
            isUser: item.answer_or_question === 1 ? true : false,
            evaluateIcon: item.answer_or_question === 1 ? '' : '',
            hoverIcon: item.answer_or_question === 1 ? '' : 'heart',
          }
        })
      }
      console.log('real-----',messages.value);
      
      chatLogsSplit(messages.value);
      pageTotal.value = result.total as number;

      if(scrollBottomFlag.value===true){
        scrollToBottom()
      }else{
        scrollToTop()
      } 
    }
    else{
      //messages.push({ content: result.message, isUser: false })
    }

    return result;
  } catch (err) {
    // loading.value = false
    // messages[messages.length - 1].content = err.message
  } finally {
    // loader hide
    // closeToast();
  }

}

</script>

