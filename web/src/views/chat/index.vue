<template>
  <div class="chat-bg bg-box">
    <div class="container-box">
      <NavBar/>
      <!-- <div class="arrow-left" @click="router.go(-1)"></div> -->

      <div class="message-list" ref="messageList">
        <div class="more-btn" @click="showMore" v-if="recordList.page*recordList.page_size < pageTotal">查看更多</div>
        <div class="message-row mb-10" v-for="(message, index) in messages" :key="index" :class="{ 'user-message': message.isUser }">
          <div class="message-item">
            <div class="message-content">{{ message.content }}</div>
          </div>
          <div class="emoji-box">
              <img :src="getEmojiUrl(message.emoji)" alt="" v-if="message.emoji!==0"/>
            </div>
        </div>
      </div>

      <div class="chat-bottom-fixed">
        <div class="input-container mr-30">
          <el-input
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
        <Image class="cat-img" name="111.gif" alt="" />
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
import { last } from 'lodash-es';

const router = useRouter();
const { query, params } = useRoute();
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



const sendFirstMessage = ()=>{
  if(messageStore.firstMessage){
    newMessage.value = messageStore.firstMessage
    messageStore.firstMessage = ''
    sendMessage()
  }
}

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
        type: 'sendMsg',
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
  let current_content:string = ''

  storage.setItem('auth', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDgyNDg2NTUsImlhdCI6MTY4MjMyODY1NSwidXNlcklkIjoyfQ.c54BKBpqCYhnnZU6LEsP04th9VUZ2q2jXEYmtu2k38U');
  scrollBottomFlag.value = true;
  ws = reactive(new Socket({
    url: import.meta.env.VITE_API_WEBSOCKET_URL + '/customer/chat',//'ws://43.153.76.9:8888/customer/chat',
    name: '',			// name
    isHeart:false,			// 是否心跳
    isReconnection:true,		// 是否断开重连
    received: function(data:any){
      // 监听服务器返回信息
        console.log("received",data)
        let dataFormat = JSON.parse(data)

        if(dataFormat.is_end === false){
          if(dataFormat.message_id === current_message_id){
            const index = messages.value.findIndex(item => item.message_id === current_message_id);
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
        }

        scrollToBottom();
    }
  }));
  ws.connect();
  watch(()=> ws.status, (newValue, oldValue) => {
    console.log('myVariable 变化了:', newValue);
    if(newValue === 'open'){
      isConnect.value = true;
      sendFirstMessage();
    }
    else{
      isConnect.value = false;
    }
  });
  getChatRecord();
}) 

// watch(()=> ws.status, (newValue, oldValue) => {
//   console.log('myVariable 变化了:', newValue);
//   if(newValue === 'open'){
//     isConnect.value = true;
//     sendFirstMessage();
//   }
//   else{
//     isConnect.value = false;
//   }
// });



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
  } catch (err) {
    // loading.value = false
    // messages[messages.length - 1].content = err.message
  } finally {
    // loader hide
    // closeToast();
  }

}

</script>

<style lang="scss" scoped>
.container-box{
  overflow: hidden;
}
.chat-bg.bg-box {
  background: url('@/assets/images/chat-bg.png') no-repeat center;
  background-size: 100% 100%;
  @include phone{
    padding: 8rem 1rem 12rem 1rem;
  }
}

.message-list {
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  position: relative;
  padding-top: 30px;
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
  .message-row{
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    width: 100%;
    &.user-message {
      justify-content: flex-start;
      > .message-item {
        align-self: flex-start;
        background-color: $white_1;
        border: 0.2rem solid $gray_1;
      }
    }
    .message-item {
      max-width: 50%;
      border-radius: 1.5rem;
      color: $green_1;
      background-color: $pink_1;
      border: 0.2rem solid $gray_1;
      align-self: flex-end;
      padding: 0.5rem 1.5rem;
      @include flex-start;

      .message-content {
        /* width: 100%; */
        font-size: $size_18;
        margin-right: 2rem;
      }
    }
    .emoji-box{
      width: 5rem;
      height: 5rem;
      @include centerBox;
    }
  }
}

.chat-bottom-fixed{
  width: 100%;
  max-width: 120rem;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  padding: 5rem 10rem;
  box-sizing: border-box;
  @include flex-between;
  @include phone{
    padding: 5rem 1rem;
  }
  .cat-img{
    width: 18rem;
    height: 18rem;
    align-self: start;
    @include ipad{
      width: 10rem;
      height: 10rem;
    }
    @include phone{
      width: 5rem;
      height: 5rem;
    }
  }
}

::v-deep .el-input__wrapper{
  background-color: transparent;
}

.arrow-left{
  width: 4rem;
  height: 4rem;
  background-color: transparent;
  border-color: #fff;
  border-style: solid;
  border-width: 1rem 1rem 0 0;
  transform: rotate(-135deg) translateY(8rem);
  position: fixed;
  left: 0;
  top: 50%;
  z-index: 1000;
  cursor: pointer;
  @include phone{
    width: 2rem;
    height: 2rem;
    left: -30px;
    top: 90px;
  }
}
</style>
