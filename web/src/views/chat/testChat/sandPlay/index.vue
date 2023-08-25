<template>
  <ResultDialog :message="currentMessage.content" class="absolute left-0 top-0 z-999" v-show="showDialog"/>
  <div class="wh-full" v-show="!showDialog">
    <div class="header">
    <SvgImage name="Avatar2.svg" class="w-4rem h-4rem mr-1.6rem" />
    <div class="font-600 text-1.6rem line-height-2rem">粉贱贱</div>
    </div>
    <div class="main">
      <div class="wh-full box-border overflow-y-auto relative" ref="messageList">
        <div v-for="[date, logs] in chatLogsMap" :key="date">
          <div class="text-center mt-1.7rem color-#666668 text-1.4rem mb-1.3rem">
            {{ date }}
          </div>
          <div class="flex flex-items-end mb-1.3rem flex-nowrap px-3rem " v-for="(message, index) in logs" :key="index"
            :class="message.answer_or_question === 2 ? 'flex-justify-end' : 'flex-justify-start'">
            <div class="
              flex-self-start
              color-[#000c]
              max-w-1/2
              b-rd-[8px]
              relative
              " :class="[message.answer_or_question === 2 ? 'bg-[#F5C4EA]' : 'bg-[#fff]']"
              >
              <div class="
                whitespace-pre-line
                text-1.4rem              
                px-1.6rem
                py-0.8rem
                line-height-2.4rem
              ">
                <div class="font-400" v-if="index===2 || index===4">好的，让我们开始吧！</div>
                <div class="font-600">{{ message.content }}</div>
              </div>

              <div class="absolute bottom-0" :class="message.answer_or_question === 2 ? ' right--9px' : 'left--9px'">
                <SvgImage name="chat-triangle-pink.svg" class="w-19px h-15px" v-if="message.answer_or_question === 2" />
                <SvgImage name="chat-triangle-white.svg" class="w-19px h-15px" v-else />
              </div>

              <div class="absolute bottom--4rem left-0" v-if="index === 0 && showButtons">
                <div class="flex-row-start w-360px">
                  <div v-for="tagItem in buttons" class="
                  text-1.4rem
                  font-500
                  px-1.6rem
                  rounded-43px
                  border-1px
                  border-solid
                  cursor-pointer
                  mr-0.8rem
                  line-height-normal
                  "
                  @click="handleSelectTag(tagItem.value)"
                  :class="current===tagItem.value ? 
                  'color-[var(--pink-02)] border-[var(--pink-02)] bg-[var(--pink-01)]':
                  'color-[var(--text-03)] border-[#E3E3E3] bg-[#E3E3E3]'"
                  >
                    {{ tagItem.value  }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full h-10.4rem"></div>

      </div>
    </div>
    <div class="footer">
      <div class="bg-white h-56px rounded-8px w-full mr-3rem flex-col-center">
        <textarea cols="25" rows="5" resize="none"
          class="w-full h-36px outline-none border-none rounded-8px indent-2.4rem text-1.4rem line-height-32px"
          placeholder="你想和我聊些什么？......" v-model="newMessage" ref="inputBoxRef" @keyup.enter.native="sendMessage"
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
import { userMessage, useLoginStore, useChatStore } from '@/store/index.ts';
import { message } from 'ant-design-vue';
import { isEqual, uniqWith, uniqBy } from 'lodash-es'
import {useToggleButtons} from '@/hooks/toggleButtons'
import { evaluationGetSocket, getConfig } from "@/apis/testChat.ts";

const showDialog = ref(false)
const buttonMap = ref([])//['亲密关系','人格','事业','爱情','友情']
let { buttons,current,handleButtonClick} = useToggleButtons(buttonMap.value)
// let buttons = ref([])
// let current = ref('')
// let handleButtonClick = ref(null)
const showButtons = ref(true)
// counter.init();
const messageStore = userMessage();
const loginStore = useLoginStore
var chatLogsMap = reactive(new Map<string, Message[]>());
const loading = ref(false);
const messageList = ref<any>(null);
let ws:any = null

let isEnd = ref(true);
let disabledSend = computed(() => {
  return !isConnect.value || !isEnd.value
})

const newMessage = ref('');
const stepStatus = ref(0);
const relationId = ref(0);
const pageTotal = ref(0);
const isConnect = ref(false);//是否连接websocket
const messages = ref<any>([]);
const scrollBottomFlag = ref(false);
const recordList = reactive({
  user: window.localStorage.getItem('token') ? window.localStorage.getItem('newUserId') : window.localStorage.getItem('userId') || genId('userId',1),
  open_kf_id: 'lGVmDRmK6W30ROG5eSN8wOlXlroy0D6t',
});



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

const handleSelectTag = (value:string) =>{
  handleButtonClick(value)
  newMessage.value = value
  showButtons.value = false
  sendMessage()
}


const isValidText = (text:string) => {
  //只做非空判断
  const regex = /\S/;
  let str = text.trim()

  return regex.test(str); 
}
// 发送消息
const sendMessage = () => {  
  if(!isConnect.value){
    message.info('白小喵正在上线中...')
    return
  }

  if(!isEnd.value){
    message.info('请等等哦~')
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
        answer_or_question: 2,
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
            answer_or_question: 2,
            message_id: messageId
          })

          if(getToday.length  === 2){
            stepStatus.value = 1
          }
          else if(getToday.length  === 4){
            stepStatus.value = 2
            relationId.value = getToday[2].relation_id || 0
          }
          else if(getToday.length  === 6){
            stepStatus.value = 3
            relationId.value = getToday[4].relation_id || 0
            showDialog.value = true
          }
        }

      // const addIndex = () => {
      //   counter.add();
      // };
      // addIndex();
      



      // 发送消息
      let sendData = {
        'message_id': messageId,
        'message':newMessage.value,
        'status': stepStatus.value,
        'relation_id': relationId.value,
        'user': window.localStorage.getItem('token') ? window.localStorage.getItem('newUserId') : window.localStorage.getItem('userId') || genId('userId',1),
        'open_kf_id': 'lGVmDRmK6W30ROG5eSN8wOlXlroy0D6t'//"wkWpQ2GQAAPtHdT-Jdk4ltXYZKlnHoSA"
      }
      ws.sendMsg(sendData)
      newMessage.value = ''
      scrollBottomFlag.value = true;
      isEnd.value = false;
      scrollToBottom();
      
    }
    else{
      message.info('请输入点什么吧~')
    }
  }
};

// 设置信息
const setEvaluationStatus = async(result:any = null) =>{
  if(!result) {
    //spinning.value = false
    return
  }

  let status = result.status
  switch (status) {
    case 0:

      break;
    case 1:

      break;
    case 2:

      break;
    default:
      break;
  }
}

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


let currentMessage:any = {content: ''}
const initData = () => {
  storage.setItem('auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDgyNDg2NTUsImlhdCI6MTY4MjMyODY1NSwidXNlcklkIjoyfQ.c54BKBpqCYhnnZU6LEsP04th9VUZ2q2jXEYmtu2k38U');
  scrollBottomFlag.value = true;
}

const initWebSocket = () => {
  let current_message_id:string = ''

  // scoket连接
  ws = reactive(new Socket({
    url: import.meta.env.VITE_API_WEBSOCKET_URL + '/evaluation/socket',//'ws://43.153.76.9:8888/customer/chat',
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
                const index = chatLogs.findIndex((item:any) => item.message_id === current_message_id && item.answer_or_question === 1);                
                currentMessage = chatLogs[index];
                currentMessage.content += dataFormat.message
                //chatLogs[chatLogs.length - 1].content += dataFormat.message
                
              }
              else{
                chatLogs.push({
                  content: dataFormat.error_message.length>0 ? dataFormat.error_message : dataFormat.message,
                  created_at: getFormattedDate('time'),
                  message_id: dataFormat.message_id,
                  answer_or_question: 1,
                  status_is_end: dataFormat.status_is_end,
                  relation_id: dataFormat.relation_id
                });
              }

              current_message_id = dataFormat.message_id ? dataFormat.message_id : ''
              scrollToBottom();
            }

            // update emoji
            if(dataFormat.is_end === true){
              if(dataFormat.error_message.length > 0){
                message.error(dataFormat.error_message)
              }
              else{
                if(dataFormat.message_id === current_message_id){
                  const index = chatLogs.findIndex((item:any) => item.message_id === current_message_id && item.answer_or_question === 1);
                  currentMessage = chatLogs[index];

                  isEnd.value = dataFormat.is_end
                  currentMessage.relation_id = dataFormat.relation_id
                }
              }
            }

          }
        }
        
        //循环map并且根据message_id和created_at判断是否有重复的消息
        // for (let [key, value] of chatLogsMap) {
        //   chatLogsMap.set(key, uniqWith(value, (obj1, obj2) => {
        //     return obj1.created_at === obj2.created_at && obj1.message_id === obj2.message_id;
        //   }))
        // }
        
        // for (let [key, value] of chatLogsMap) {
        //   chatLogsMap.set(key, sortChatLogs(value))
        // }
    }
  }));
  ws.connect();
}

const sayHello = () =>{
  const today = getFormattedDate();
      let messageId = genIdForMsg(2 ,20);
      let helloWord = '你好，请问你今天想测什么？'
      messages.value.push({
        created_at: getFormattedDate('time'),
        content: helloWord,
        answer_or_question: 1,
        message_id: messageId,
      });
      if (!chatLogsMap.has(today)) {
        chatLogsMap.set(today, []); 
      }

      let getToday = chatLogsMap.get(today)
      if(getToday){
        getToday.push({
          created_at: getFormattedDate('time'),
          content: helloWord,
          answer_or_question: 1,
          message_id: messageId,
        })
      }
}
onMounted(()=>{
  getButtons()
  getChatRecord()
  initData();
  initWebSocket();
  // checkChatRecord();
  //setTab(1)
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

  //根据messages的长度是否为大于1来判断showButtons是否为true
  watch(()=> messages.value.length, async(newValue, oldValue) => {
    if(newValue > 1){
      showButtons.value = false
    }
    else{
      showButtons.value = true
    }

    if(newValue === 7){
      showDialog.value = true
    }
  });
}) 

// onBeforeRouteLeave((to, from, next) => {
//   ws.close();
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
  status_is_end?: boolean, 
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
    if (logs) {
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
  pageTotal.value = result.total as number;
}

const getButtons = async() => {
  const result = await getConfig({'config_type':3}) as any;
  buttonMap.value = result.data.list.map((item:any) => {
    return item.value
  })
  buttons = useToggleButtons(buttonMap.value).buttons
  current = useToggleButtons(buttonMap.value).current
  handleButtonClick = useToggleButtons(buttonMap.value).handleButtonClick
}
// 获取聊天记录
const getChatRecord = async() => {
  try {
    const result = await evaluationGetSocket(recordList);
    console.log(result)

    if(result && result.list && result.list.length > 0){
      // result.list.reverse();
      if(messages.value.length>0){
        let resultList = result.list.map((item: any) => {
          return {
            ...item,
          }
        })
        messages.value = resultList.concat(messages.value);
      }
      else{
        messages.value = result.list.map((item: any) => {
          return {
            ...item,
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
      sayHello();
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

