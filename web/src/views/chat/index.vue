<template>
  <div class="bg-box wh-full">
    <div class="container-box">
      <NavBar/>
      <!-- <div class="arrow-left" @click="router.go(-1)"></div> -->

      <div class="h-full box-border overflow-y-auto relative mt-122 mb-120" ref="messageList">
        <div class="more-btn" @click="showMore" v-if="recordList.page*recordList.page_size < pageTotal">查看更多</div>

        <div class="flex flex-items-end mb-10 flex-nowrap px-30 " v-for="(message, index) in messages" :key="index" :class="message.isUser === true ? 'flex-justify-end' : 'flex-justify-start'">
          <div class="
            flex-self-start
            color-[--green-1]
            max-w-1/2
            border-2
            border-solid
            border-[--gray-1]
            b-rd-[15px]
            bg-[--white-1]
          ">
            <div class="
              mr-20
              whitespace-pre-line
              p-10
              line-height-normal
            ">{{ message.content }}</div>
          </div>
          <div class="
            w-5
            h-5
            center-box
          ">
              <img :src="getEmojiUrl(message.emoji)" alt="" v-if="message.emoji!==0"/>
            </div>
        </div>
      </div>

      <div class="
        w-full
        fixed
        bottom-0
        left-0
        z-1000
        p-30
        flex-center
        box-border">
        <div class="input-container w-full mr-30">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storage, scrollTo, getImageUrl, getEmojiUrl } from '@/utils/index.ts'
import { chat } from '@/apis/chat.ts'
import Socket from "@/utils/http/websocket.js";
import { genId } from "@/utils/idGenerator.js";
import { useCounterStore, userMessage } from '@/store/index.js';

const counter = useCounterStore();
const messageStore = userMessage();

const loading = ref(false);
const messageList = ref<any>(null);
let ws:any = null


const newMessage = ref('');
const pageTotal = ref(0);
const isConnect = ref(false);//是否连接websocket
const messages = ref<any>([]);
const scrollBottomFlag = ref(false);
const recordList = reactive({
  page: 1,
  page_size: 10,
  user: genId('userId',1),
  open_kf_id: 'wkWpQ2GQAAPtHdT-Jdk4ltXYZKlnHoSA',
  start_created_at: '',
  end_created_at: ''
});


// 发送首页传过来的第一条消息
const sendFirstMessage = ()=>{
  if(messageStore.firstMessage){
    newMessage.value = messageStore.firstMessage
    messageStore.firstMessage = ''
    sendMessage()
  }
}

// 发送消息
const sendMessage = () => {
  if(isConnect.value === true){
    if (newMessage.value) {
      // 处理非空的 messages.value
      messages.value.push({
        content: newMessage.value,
        emoji: 0,
        isUser: true
      });

      const addIndex = () => {
        counter.add();
      };
      addIndex();
      
      // 发送消息
      let sendData = {
        "typeStatus": 'sendMsg',
        "message_id":genId(`msg_${counter.index}`, 2 ,20),
        "message":newMessage.value,
        "user": genId('userId',1),
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

        if(dataFormat.message_id !== '' && dataFormat.is_end === false && dataFormat.message !== ''){
          if(dataFormat.message_id === current_message_id){
            const index = messages.value.findIndex((item:any) => item.message_id === current_message_id);
            const currentMessage = messages.value[index];
            currentMessage.content += dataFormat.message
          }
          else{
            messages.value.push({
              content: dataFormat.error_message.length>0 ? dataFormat.error_message : dataFormat.message,
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
  }));
  ws.connect();

  // 监听连接状态变化
  watch(()=> ws.status, async(newValue, oldValue) => {
    console.log('myVariable 变化了:', newValue);
    if(newValue === 'open'){
      isConnect.value = true;
      let result = await getChatRecord();
      if(result && result.list && result.list.length > 0){
        sendFirstMessage();
      }
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




// 获取聊天记录
const getChatRecord = async() => {
  try {
    // loading
    loading.value = true

    const result = await chat(recordList);
    console.log(result)

    loading.value = false

    if(result && result.list && result.list.length > 0){
      result.list.reverse();
      if(messages.value.length>0){
        let resultList = result.list.map((item: any) => {
          return {
            ...item,
            isUser: item.answer_or_question === 1 ? true : false
          }
        })
        messages.value = resultList.concat(messages.value);
      }
      else{
        messages.value = result.list.map((item: any) => {
          return {
            ...item,
            isUser: item.answer_or_question === 1 ? true : false
          }
        })
      }
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
</style>
