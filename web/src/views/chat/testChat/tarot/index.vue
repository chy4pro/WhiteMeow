<template>
  <div class="wh-full box-border overflow-y-auto relative bg-[url(@/assets/images/tarot-bg.png)]">
    <div class="wh-full flex-col-center" v-show="loadingFlipped">
      <!-- <h1 class="animate__animated animate__bounce">An animated element</h1> -->

      <div class="card" :class="{ flipped: isFlipped }" @click="isFlipped = !isFlipped">
        <div class="card-inner">
          <div class="card-front">
            <Image name="tarot/card-back.png" class="wh-full" />
          </div>
          <!-- <div class="card-back">
            <Image name="tarot/card-back.png" class="wh-full" />
          </div> -->
        </div>
      </div>
      <div class="text-2.4rem color-white font-700 text-center mt-3.2rem">
        翻牌中...
      </div>
    </div>
    <div class="wh-full flex-row-center relative" v-show="!loadingFlipped && (formState.status === 1 || formState.status === 3)">
        <div class="absolute top-4rem right-4rem cursor-pointer" @click="router.push('/chat/testChat')">
          <SvgImage name="icon_close_white.svg" class="w-2.4rem h-2.4rem"/>
        </div>

        <div class="flex-row-center">
          <div class="w-20rem mr-7.3rem">
            <img :src="formState.tarot_image" class="w-20rem h-34.7rem" />
            <div v-show="formState.status === 1">
              <div class="mt-3.2rem">
                <div class="
                w-20rem
                h-5.4rem
                bg-[url(@/assets/images/btn_confirm.svg)]
                bg-cover
                bg-no-repeat
                bg-center
                line-height-5.1rem
                text-center
                text-2rem
                font-600
                color-white
                cursor-pointer
                transition-transform
                transform-gpu
                ease-in
                duration-200
                hover:scale-105
                "
                @click="getQuestion()"
                >
                深入解析
                </div>
              </div>
              <div class="mt-1.6rem">
                <h3 class="text-1.5rem font-400 color-white text-center">了解此牌面的今日指示</h3>
              </div>
            </div>
          </div>

          <div class="w-35.2rem color-white flex-self-start">
            <h1 class="mb-0.8rem font-700 text-4rem">{{ formState.tarot_name }}</h1>
            <p class="text-1.2rem font-400 line-height-normal">{{ formState.message }}</p>
          </div>
        </div>
      </div>
    <div v-show="!loadingFlipped && formState.status === 2">

      <div class="
        w-full
        h-19rem
        relative
        mb-5.4rem
        mt-12.1rem
        flex-col-center
        bg-[url(@/assets/images/dialog_box_small.svg)]
        bg-contain
        bg-no-repeat
        bg-bottom">
        <SvgImage name="cat_red3.svg" class="
          w-full
          h-12.1rem
          absolute
          left-0
          top--9.5rem
          z-777
        "></SvgImage>
        <div class="
          absolute
          left-0rem
          top--2rem
          text-2rem
          font-600
          mb-1.4rem
          px-6.4rem
          z-888
          color-#FFDFFC
          ">请认真回答以下问题：</div>
        <div class="pl-7.3rem pr-9.3rem text-2rem font-600 color-black line-height-normal">{{ formState.message }}</div>
      </div>

        <div class="
        text-2rem
        font-600
        mb-1.4rem
        px-6.4rem
        color-#FFDFFC">我的回答:</div>

        <div class="px-6.4rem">
          <a-form
            ref="formRef"
            name="custom-validation"
            :model="formState"
            :rules="rules"
            layout="vertical"
            autocomplete="off"
          >
          <a-form-item
            ref="content"
            name="content" 
            validateStatus=""
            help="">
            <a-textarea
              v-model:value="formState.content"
              placeholder="请输入您的答案..."
              class="customer-textarea"
              :autoSize="false"
              :maxlength="200"
            />
            </a-form-item>
          </a-form>

          <div class="flex-col-center">
          <div class="
            w-20rem
            h-5.4rem
            bg-[url(@/assets/images/btn_confirm.svg)]
            bg-cover
            bg-no-repeat
            bg-center
            line-height-5rem
            text-center
            text-2rem
            font-600
            color-white
            cursor-pointer
            "
            @click="handleSubmit"
            >
              确认提交
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import { evaluationGetSocket, getEvaluation, evaluation } from "@/apis/testChat.ts";
import Socket from "@/utils/http/websocket.js";
import {  type FormInstance } from "ant-design-vue";
import { genId,genIdForMsg } from "@/utils/idGenerator.js";
import messageBox from '@/components/MessageBox/index.ts';

let ws:any = null

const newMessage = ref('');
let isEnd = ref(true);
let disabledSend = computed(() => {
  return !isConnect.value || !isEnd.value
})
const isConnect = ref(false);//是否连接websocket
const recordList = reactive({
  user: window.localStorage.getItem('token') ? window.localStorage.getItem('newUserId') : window.localStorage.getItem('userId') || genId('userId',1),
  open_kf_id: 'oLet5ixVLgOqflofOJqjXqSJg0zYlF7U',
});
const router = useRouter();
const isFlipped = ref(false)
const loadingFlipped = ref<boolean>(false)

const formRef = ref<FormInstance>();

let formState = reactive({
  user: '',
  content: '',	
  relation_id: 0,
  status: 0,
  tarot: '',
  tarot_image: '',
  tarot_name: '',
  tarot_info: '',
  message: '',
  question: ''
});

const rules: Record<string, Rule[]> = {
  content: [
    { required: true, message: '请填写您的回答', trigger: "blur" },
  ]
};

// 获取状态
const getEvaluationInfo = async() => {
  try {
    return new Promise(async(resolve, reject) => {
      let params = {
        user: genId("userId", 1),
        'open_kf_id': 'oLet5ixVLgOqflofOJqjXqSJg0zYlF7U'
      }
      loadingFlipped.value = true
      const { data, code } = await getEvaluation(params);
      if(code === 200){
        return resolve(data)
      }
    }); 

  } catch (error) {
    console.log(error);
  } finally {
    //spinning.value = false;
  }
}

// 发送测评
const sendEvaluation = async(status:number) => {
  try {
    let params = {
      user: genId("userId", 1),
      'open_kf_id': 'oLet5ixVLgOqflofOJqjXqSJg0zYlF7U',
      'message': formState.content,
      'relation_id': formState.relation_id.toString(),
      'status': status
    }


    console.log(params);
    
    
    console.log(params);
    
    const result= await evaluation(params);
    if(result && result.code === 200){
      formState.status = status //如果状态为0，设置状态为1，表示第一次抽牌
      return result.data
    }
  } catch (error) {
    console.log('error',error);
    
  }

}
const isValidText = (text:string) => {
  //只做非空判断
  const regex = /\S/;
  let str = text.trim()

  return regex.test(str); 
}

// 发送消息
const sendMessage = () => {  
  // if(!isConnect.value){
  //   messageBox.info('白小喵正在上线中...')
  //   return
  // }


  if(isConnect.value === true){
    // 处理非空的 messages.value
    let messageId = genIdForMsg(2 ,20);

    // 发送消息
    let sendData = {
      'message_id': messageId,
      'message': formState.content,
      'status': formState.status,
      'relation_id': formState.relation_id,
      'user': window.localStorage.getItem('token') ? window.localStorage.getItem('newUserId') : window.localStorage.getItem('userId') || genId('userId',1),
      'open_kf_id': 'oLet5ixVLgOqflofOJqjXqSJg0zYlF7U'
    }
    ws.sendMsg(sendData)
    newMessage.value = ''
    isEnd.value = false;
  }
};

// 设置信息
const setEvaluationStatus = async(result:any = null) =>{
  let evaluation = null
  let status = result.status
  switch (status) {
    case 1:
      loadingFlipped.value = false
      
      if(result){
        formState.status = 1
        formState.tarot_image = result.tarot_image
        formState.tarot_name = result.tarot_name
        formState.message = result.message
        formState.relation_id = result.relation_id
      }
      break;
    case 2:
      //sendEvaluation()
      //evaluation = await sendEvaluation(2) as any
      if(result){
        // spinning.value = false
        loadingFlipped.value = false
        formState.status = 2
        formState.tarot_image = result.tarot_image
        formState.tarot_name = result.tarot_name
        formState.message = result.message
        formState.relation_id = result.relation_id
      }
      break;
      case 3:
      //evaluation = await sendEvaluation(3) as any

      if(result){
        loadingFlipped.value = false
        formState.status = 3
        formState.tarot_image = result.tarot_image
        formState.tarot_name = result.tarot_name
        formState.message = result.message
        formState.relation_id = result.relation_id
      }
      break;
    default:
      break;
  }
}

// 深入了解，进入步骤2，获取问题
const getQuestion = async() => {
  // spinning.value = true
  if(isEnd.value === true){
    loadingFlipped.value = true
    formState.message = ''
    formState.status = 2
    sendMessage()
  }
  else{
    messageBox.info('请等待分析结果')
  }
}

// 发送问题，进入步骤3，得出最终结果
const handleSubmit = ()=>{
  if (formRef && formRef.value) {
    formRef.value
      .validate()
      .then(async() => {
        loadingFlipped.value = true
        formState.status = 3
        sendMessage()
      })
      .catch((err) => {
        messageBox.info('请填写您的回答')
      });
  }

}

const initStatus = async() =>{
  let result:any = await getEvaluationInfo()
  console.log(result);
  if(result && result.status === 0){
    formState.status = 1
    sendMessage()
    // if(newResult){
    //   setEvaluationStatus(newResult)
    // }
  }
  else{
    setEvaluationStatus(result)
  }
}

const initWebSocket = () => {
  loadingFlipped.value = true
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
        loadingFlipped.value = false

        let dataFormat = JSON.parse(data)
        if(dataFormat.message_id !== '' && dataFormat.is_end === false && dataFormat.message !== ''){
          formState.message += dataFormat.message
          formState.tarot_image = dataFormat.tarot_image
          formState.tarot_name = dataFormat.tarot_name
        }

        // update emoji
        if(dataFormat.is_end === true){
          if(dataFormat.error_message.length > 0){
            messageBox.error(dataFormat.error_message)
          }
          else{
            formState.relation_id = dataFormat.relation_id
            isEnd.value = dataFormat.is_end
          }
        }
    }
  }));
  ws.connect();
}

// 获取聊天记录
const getChatRecord = async() => {
  try {
    const result:any = await evaluationGetSocket(recordList);

    if(result && result.list && result.list.length > 0){
      formState = result.list.map((item: any) => {
        return {
          ...item,
        }
      })
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

onMounted(() => {
  initWebSocket()

    //监听连接状态变化
    watch(()=> ws.status, async(newValue, oldValue) => {
    console.log('myVariable 变化了:', newValue);
    if(newValue === 'open'){
      isConnect.value = true;
      initStatus()
    }
    else{
      isConnect.value = false;
    }
  });

  //根据messages的长度是否为大于1来判断showButtons是否为true
  // watch(()=> messages.value.length, async(newValue, oldValue) => {
  //   if(newValue > 1){
  //     showButtons.value = false
  //   }
  //   else{
  //     showButtons.value = true
  //   }

  //   if(newValue === 9){
  //     showDialog.value = true
  //     currentMessage = messages.value[8]
  //   }
  // });

})
</script>

<style>
.card {
  width: 20rem;
  height: 34.7rem;
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card {
  animation-duration: 5s;
  transition-timing-function: cubic-bezier(.25,.8,.25,1);
  animation-name: flipped;
  animation-iteration-count: infinite;
}

@keyframes flipped {

  from {
    transform: rotateY(0deg)
  }
  to {
    transform: rotateY(360deg)
  }
  /* 0% {
      transform: rotateY(0deg);
    }
    33%{
      transform: rotateY(45deg);
    }
    66%{
      transform: rotateY(90deg);
    }
    100% {
      transform: rotateY(135deg);
    } */
}
textarea.ant-input.customer-textarea{
  --at-apply: w-full h-21rem bg-[#fff] outline-none resize-none border-none;
}
</style>

