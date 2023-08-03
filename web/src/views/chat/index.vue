<template>

      <!-- <div class="arrow-left" @click="router.go(-1)"></div> -->
  <div class="chat-panel-container">
    <div class="chat-panel">
      <div class="nav-part">
        <Image name="catpaw-logo.svg" alt="" class="w-143px h-40px mt-16px"/>
        <ul class="nav-part-tablist">
          <li @mouseenter="hoverTabItem(index)" @mouseleave="leaveTabItem(index)" @click="clickTabItem(index)" v-for="(tabItem, index) in tablist" :key="index" :class="tabItem.status">
            <div>
              <Image :name="tabItemMap(tabItem)" alt="" class="w-24px h-24px inline-block vertical-middle mr-8px"/>
              <span class="inline-block vertical-middle">{{ tabItem.label }}</span>
            </div>
            <div v-if="tabItem.status === 'disable'">
              <Image name="icon24_lock_on.svg" alt="" class="w-16px h-16px"/>
            </div>
          </li>
          <!-- <li>
            <div>
              <Image name="icon24_ceshi_miao.svg" alt="" class="w-24px h-24px inline-block vertical-middle mr-8px"/>
              <span class="inline-block vertical-middle">测试喵</span>
            </div>
            <div>
              <Image name="icon24_lock_on.svg" alt="" class="w-16px h-16px"/>
            </div>
          </li>
          <li>
            <div>
              <Image name="icon24_wode_miao.svg" alt="" class="w-24px h-24px inline-block vertical-middle mr-8px"/>
              <span class="inline-block vertical-middle">我的喵</span>
            </div>
            <div>
              <Image name="icon24_lock_on.svg" alt="" class="w-16px h-16px"/>
            </div>
          </li> -->
        </ul>
      </div>
      <div class="main-part">
        <div class="header">
          <Image name="Avatar.svg" alt="" class="w-40px h-40px mr-16px"/>
          <div class="font-600 text-16px line-height-20px">白小喵</div>
        </div>
        <div class="main">
          <div class="wh-full box-border overflow-y-auto relative" ref="messageList">

          <div class="text-center mt-16px cursor-pointer" @click="showMore" v-if="recordList.page*recordList.page_size < pageTotal">
            <div class="w-24px h-24px flex-col-center mx-a">
              <Image name="icon_more.svg" alt="" class="w-14px h-12.6px"/>
            </div>
            <div class="color-#666668 text-14px">查看历史聊天记录</div>
          </div>



          <div v-for="[date, logs] in chatLogsMap" :key="date">
            <div class="text-center mt-17px color-#666668 text-14px mb-13px">
              {{ date }}
            </div>
            <div class="flex flex-items-end mb-13px flex-nowrap px-30px " v-for="(message, index) in logs" :key="index" :class="message.isUser === true ? 'flex-justify-end' : 'flex-justify-start'">
              <div class="
                flex-self-start
                color-[#000c]
                max-w-1/2
                b-rd-[8px]
                relative
                "
                :class="[message.isUser === true ? 'bg-[#F5C4EA]' : 'bg-[#fff]']"
                @mouseenter="message.showHoverIcon = true" @mouseleave="message.showHoverIcon = false"
                @click="clickHeart(message)"
                >
                <div class="
                  whitespace-pre-line
                  text-14px
                  font-400
                  px-16px
                  py-8px
                  line-height-24px
                ">
                  
                  <div>{{ message.content }}</div>
                  <div class="text-right" v-show="!message.showHoverIcon">
                    <Image :name="`icon_${message.evaluateIcon}.svg`" alt="" class="w-16px h-16px" v-show="message.evaluateIcon"/>
                  </div>
                  <div 
                  class="
                  hover:bg-[#FFDFFC]
                    rounded-4px
                    uno-shadow-[0px,4px,4px,0px]+[rgba(0,0,0,0.1)]
                    absolute
                    top--12px
                    right-11px
                  " v-show="message.showHoverIcon && !message.isUser"
                    :class="message.hoverIcon === 'heart_active' ? 'bg-[#FFDFFC]' : 'bg-white'"
                  >
                    <Image :name="`icon_${message.hoverIcon}.svg`" alt="" class="
                    w-16px
                    h-16px
                    mx-8px
                    my-4px"/>
                  </div>
                </div>

                <div class="absolute bottom-0" :class="message.isUser === true ? ' right--9px' : 'left--9px'" >
                  <Image name="chat-triangle-pink.svg" alt="" class="w-19px h-15px" v-if="message.isUser === true"/>
                  <Image name="chat-triangle-white.svg" alt="" class="w-19px h-15px" v-else/>
                </div>
              </div>

              <div class="
                w-5
                h-5
                center-box
              ">
                  <img :src="getEmojiUrl(message.emoji?.toString() || '')" alt="" v-if="message.emoji!==0"/>
                </div>
            </div>
          </div>
        </div>
        </div>
        <div class="footer">
          <div class="bg-white h-56px rounded-8px w-full mr-30px flex-col-center">
            <textarea
              cols="25"
              rows="5"
              resize="none"
              class="w-full h-36px outline-none border-none rounded-8px indent-24px text-14px line-height-32px"
              placeholder="你想和我聊些什么？......"
              v-model="newMessage"
              ref="inputBoxRef"
              @keyup.enter.native="sendMessage"
              @input="checkOverflow"
              autofocus
            ></textarea>
          </div>
          <div @click="sendMessage" :disabled="!isConnect" class="cursor-pointer">
            <Image :name="sendBtnName" class="w-24px h-24px" @mouseenter="sendBtnName = 'icon_send_active.svg'" @mouseleave="sendBtnName = 'icon24_send.svg'"  />
          </div>
        </div>
      </div>
    </div>
    <div class="absolute left--33.8rem top-43.2rem">
      <Image name="animation-cat.svg" class="w-49.6rem h-38rem" />
    </div>    
  </div>



      <!-- <div class="
        w-full
        fixed
        bottom-0
        left-0
        z-1000
        p-30
        flex-center
        box-border">
        <div class="input-container w-full mr-30px">
          <input
            type="text"
            class="chat-input"
            placeholder="点击聊天"
            v-model="newMessage"
            @keyup.enter.native="sendMessage"
          />
          <div class="send-button" @click="sendMessage" :disabled="!isConnect">
            <Image name="airplant.svg" class="fly-icon" />
          </div>
        </div>
        <Image name="111.gif" class="self-start" alt="" :width="'80px'" :height="'80px'"/>
      </div> -->
</template>

<script setup lang="ts">
// element-plus
// import "element-plus/theme-chalk/el-loading.css";
// import "element-plus/theme-chalk/el-notification.css";
import { ref } from 'vue';
import * as dayjs from 'dayjs'
import { storage, scrollTo, getImageUrl, getEmojiUrl } from '@/utils/index.ts'
import { chat } from '@/apis/chat.ts'
import Socket from "@/utils/http/websocket.js";
import { genId } from "@/utils/idGenerator.js";
import { useCounterStore, userMessage, useLoginStore } from '@/store/index.js';

const counter = useCounterStore();
const messageStore = userMessage();
const loginStore = useLoginStore
var chatLogsMap = reactive(new Map<string, Message[]>());
const loading = ref(false);
const messageList = ref<any>(null);
let ws:any = null


const newMessage = ref('');
const pageTotal = ref(0);
const isConnect = ref(false);//是否连接websocket
const messages = ref<any>([]);
const scrollBottomFlag = ref(false);
const recordList = reactive({
  page: 0,
  page_size: 10,
  user: storage.getItem('token') ? storage.getItem('newUserId') : storage.getItem('userId') || genId('userId',1),
  open_kf_id: 'wkWpQ2GQAAPtHdT-Jdk4ltXYZKlnHoSA',
  start_created_at: '',
  end_created_at: ''
});

const sendBtnName = ref('icon24_send.svg')
const tablistMap = [
  {
    path: 'icon_ly_',
    label: '聊愈喵',
    status: 'press'
  },
  {
    path: 'icon_cs_',
    label: '测试喵',
    status: 'disable'
  },
  {
    path: 'icon_wd_',
    label: '我的喵',
    status: 'disable'
  }
]
const tablist = reactive(JSON.parse(JSON.stringify(tablistMap)))

const hoverTabItem = (index:number) =>{
  let status = tablist[index].status
  console.log(status)
  if(status === 'disable' || status === 'press') return

  tablist[index].status = 'hover'
}

const leaveTabItem = (index:number) =>{
  let status = tablist[index].status
  if(status === 'disable' || status === 'press') return
  
  const oldStatus = tablistMap[index].status
  tablist[index].status = oldStatus
}

const clickTabItem = (index:number) => {
  let status = tablist[index].status
  if(status === 'disable') return

  for(let i = 0; i < tablist.length; i++){
    tablist[i].status = tablistMap[i].status
  }
  tablist[index].status = 'press'
}

const tabItemMap = (item:any) =>{
  return `${item.path}${item.status}.svg`
}
// 发送首页传过来的第一条消息
const sendFirstMessage = ()=>{
  if(messageStore.firstMessage){
    newMessage.value = messageStore.firstMessage
    messageStore.firstMessage = ''
    sendMessage()
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
    console.log('inputBox',window.getComputedStyle(inputBox).height);
    
    const lines = inputBox.scrollHeight / lineHeight;
    console.log('inputBox.scrollHeight',inputBox.scrollHeight);
    console.log('lines',lines);
    
    if (lines > 1) {
      inputBox.classList.add('h-full');
      inputBox.classList.remove('h-36px');
    } else {
      inputBox.classList.add('h-36px');
      inputBox.classList.remove('h-full');
    }
  }

}
// 发送消息
const sendMessage = () => {
  if(isConnect.value === true){
    if (newMessage.value) {
      // 处理非空的 messages.value
      const today = dayjs(new Date().getTime()).format('YYYY-MM-DD');

      messages.value.push({
        created_at: today,
        content: newMessage.value,
        emoji: 0,
        isUser: true
      });
      if (!chatLogsMap.has(today)) {
        chatLogsMap.set(today, []); 
      }

      let getToday = chatLogsMap.get(today)
        if(getToday){
          getToday.push({
            created_at: today,
            content: newMessage.value,
            emoji: 0,
            isUser: true
          })
        }

      const addIndex = () => {
        counter.add();
      };
      addIndex();
      
      // 发送消息
      let sendData = {
        "typeStatus": 'sendMsg',
        "message_id":genId(`msg_${counter.index}`, 2 ,20),
        "message":newMessage.value,
        "user": storage.getItem('token') ? storage.getItem('newUserId') : storage.getItem('userId') || genId('userId',1),
        "open_kf_id": "wkWpQ2GQAAPtHdT-Jdk4ltXYZKlnHoSA"
      }
      ws.sendMsg(sendData)
      newMessage.value = ''
      scrollBottomFlag.value = true;
      scrollToBottom();
    }
    else{
      ElMessage('请输入点什么吧~')
    }
  }
  else{
    ElMessage('白小喵正在上线中...')
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



onMounted(()=>{
  let current_message_id:string = ''
  recordList.page += 1;
  checkChatRecord();
  storage.setItem('auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDgyNDg2NTUsImlhdCI6MTY4MjMyODY1NSwidXNlcklkIjoyfQ.c54BKBpqCYhnnZU6LEsP04th9VUZ2q2jXEYmtu2k38U');
  scrollBottomFlag.value = true;

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
        const today = dayjs(new Date().getTime()).format('YYYY-MM-DD');

        if (!chatLogsMap.has(today)) {
          chatLogsMap.set(today, []); 
        }
        else{
          const chatLogs = chatLogsMap.get(today);
          if(chatLogs){
            if(dataFormat.message_id !== '' && dataFormat.is_end === false && dataFormat.message !== ''){
              if(dataFormat.message_id === current_message_id){
                const index = messages.value.findIndex((item:any) => item.message_id === current_message_id);
                const currentMessage = messages.value[index];
                currentMessage.content += dataFormat.message
                chatLogs[chatLogs.length - 1].content += dataFormat.message
              }
              else{
                messages.value.push({
                  content: dataFormat.error_message.length>0 ? dataFormat.error_message : dataFormat.message,
                  evaluateIcon: '',
                  hoverIcon: 'heart',
                  showHoverIcon: false,
                  emoji: dataFormat.emoji,
                  message_id: dataFormat.message_id,
                  isUser: false
                });
                chatLogs.push({
                  content: dataFormat.error_message.length>0 ? dataFormat.error_message : dataFormat.message,
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
          }
        }

    }
  }));
  ws.connect();

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
    if (logs) {
      logs.push(log); 
    }
  })
  return chatLogsMap;

}

// 查询是否有聊天记录
const checkChatRecord = async() => {
  const result = await chat(recordList);
  recordList.page = 0;
  pageTotal.value = result.total as number;
}

// 获取聊天记录
const getChatRecord = async() => {
  try {
    // loading
    //loading.value = true

    const result = await chat(recordList);
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
            hoverIcon: '',
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

<style scoped>
.more-btn{
  position: absolute;
  top: 0px;
  left: 50%;
  z-index: 1000;
  transform: translateX(-50%);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}
.chat-panel-container{
  --at-apply: 
  w-108rem
  h-72rem
  relative
  z-999
  mt-48px
}
.chat-panel{
  --at-apply: 
  wh-full
  flex-row-start
  rounded-24px
bg-[rgba(255,255,255,0.7)]
  backdrop-blur-11.5px
  overflow-hidden;
}
.chat-panel > .nav-part {
  --at-apply: self-start px-16px;
}
.chat-panel  .nav-part-tablist {
  --at-apply: p-0 mb-0 w-full list-none mt-32px;
}
.chat-panel  .nav-part-tablist > li {
  --at-apply: rounded-6px text-14px py-16px px-8px flex-row-between cursor-pointer;
}
.chat-panel  .nav-part-tablist > li.press {
  background: linear-gradient(90deg, #FCD3FF 22.92%, rgba(255, 255, 255, 0.00) 100%);
}
.chat-panel  .nav-part-tablist > li:hover:not(.press, .disable) {
  background: linear-gradient(90deg, #FDE9FF 22.92%, rgba(255, 255, 255, 0.00) 100%);
}
.chat-panel  .nav-part-tablist > li.disable {
  --at-apply: color-#BABABA bg-none cursor-not-allowed;
}
.chat-panel > .main-part {
  --at-apply: self-start wh-full flex-col-start;
}

.chat-panel > .main-part > .header {
  --at-apply: w-full py-12px px-24px flex-row-start bg-white;
}
.chat-panel > .main-part > .main {
  --at-apply: w-full h-55.1rem bg-#f2f2f2;
}
.chat-panel > .main-part > .footer {
  --at-apply: w-full h-104px bg-#F8F8F8 shadow-0px-4px-12px-0px flex-row-start px-24px;
  /* background: #F8F8F8;
box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.02); */
}
</style>
