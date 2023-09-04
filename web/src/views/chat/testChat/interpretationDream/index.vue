<template>
  <div class="wh-full box-border overflow-y-auto relative bg-[url(@/assets/images/tarot-bg.png)]">
    <div v-show="formState.status === 0">

      <div class="px-6.4rem">
        <div class="
          w-full
          relative
          mb-5.4rem
          mt-12.1rem
          bg-no-repeat
          bg-[url(@/assets/images/dialog_box_small.svg)]
          h-20rem
          bg-bottom"
          style="background-size: 100%"
          >
          <Image name="cat_red3.png" class="
            w-full
            h-14rem
            absolute
            left-0
            top--10.6rem
          "></Image>
          <div class="
          absolute
          bottom-2rem
          overflow-auto
          pl-1.6rem
          pr-2.5rem
          mr-2rem
          whitespace-pre-line
          text-2rem
          font-500
          color-black
          z-666
          h-100px
          line-height-normal"
          >{{ formState.message }}</div>
        </div>
      </div>
      <div class="
      text-2rem
      font-600
      mb-1.4rem
      px-6.4rem
      color-#FFDFFC">
        <span v-show="formState.status === 0">我的回答：（尽可能详细的描述你的梦境）</span>
      </div>
      

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
            placeholder="eg：我梦到了一个深井冰追着我跑"
            class="customer-textarea"
            :autoSize="false"
            :maxlength="200"
          />
          </a-form-item>
        </a-form>

        
        <div class="flex flex-justify-center">
          <a-button :loading="spinning" class="
          w-14.9rem
          h-6.4rem
          mb-5.6rem
          flex-row-center
          text-1.9rem
          font-800
          bg-[var(--text-01)]
          cursor-pointer
          color-white
          rounded-6px
          border-none
          "
          @click="handleSubmit(1)"
          >
            查看解析
          </a-button>
        </div>
      </div>
    </div>

    <div v-show="formState.status === 1">
      <div class="px-6.4rem">
        <div class="
          w-full
          relative
          mb-5.4rem
          mt-12.1rem
          bg-no-repeat
          bg-[url(@/assets/images/dialog_box_middle.svg)] 
          h-29rem
          bg-bottom"
          style="background-size: 100%"
          >
          <Image name="cat_red3.png" class="
            w-full
            h-14rem
            absolute
            left-0
            top--10.7rem
          "></Image>
          <div class="
          absolute
          bottom-2rem
          overflow-auto
          pl-1.6rem
          pr-2.5rem
          mr-2rem
          whitespace-pre-line
          text-2rem
          font-500
          color-black
          z-666
          h-20rem
          line-height-normal"
          
          >{{ formState.message }}</div>
        </div>
      </div>
      <div class="
      text-2rem
      font-600
      mb-1.4rem
      px-6.4rem
      color-#FFDFFC">
        <span>再次补充：（只有一次补充机会，请尽可能的补充梦境的所有内容）</span>
      </div>

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
            placeholder="eg：我梦到了一个深井冰追着我跑"
            class="customer-textarea-small"
            :autoSize="false"
            :maxlength="200"
          />
          </a-form-item>
        </a-form>

        
        <div class="flex flex-justify-center">
          <a-button :loading="spinning" class="
          w-14.9rem
          h-6.4rem
          mb-5.6rem
          flex-row-center
          text-1.9rem
          font-800
          bg-[var(--text-01)]
          cursor-pointer
          color-white
          rounded-6px
          border-none
          "
          @click="handleSubmit(2)"
          >
            查看解析
          </a-button>
        </div>
      </div>
    </div>
    
    <div v-show="formState.status === 2" class="px-6.4rem">
      <div class="
          w-full
          h-46rem
          relative
          mb-5.4rem
          mt-12.1rem
          bg-[url(@/assets/images/dialog_box_large.svg)]
          bg-no-repeat
          bg-bottom"
          style="background-size: 100%"
          >
          <Image name="cat_red3.png" class="
            w-full
            h-14rem
            absolute
            left-0rem
            top--11.2rem
          "></Image>
          <div class="
          h-35rem
          absolute
          bottom-34px
          overflow-y-scroll
          pl-1.6rem
          pr-2.5rem
          mr-2rem
          text-2rem
          font-500
          color-black
          z-666
          whitespace-pre-line
          line-height-normal">{{ formState.message }}</div>
        </div>
      
      <div class="flex-col-center">
        <a-button class="
          w-14.9rem
          h-6.4rem
          flex-col-center
          text-1.9rem
          font-800
          bg-[var(--text-01)]
          cursor-pointer
          color-white
          rounded-6px
          border-none
          mb-5.6rem
          "
          @click="$router.push('/chat/testChat')"
          v-if="formState.status === 2"
          >更多测试</a-button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import { type FormInstance } from "ant-design-vue";
import { useLoginStore } from '@/store/index.js';
const loginStore = useLoginStore();

import { getEvaluation, evaluation } from "@/apis/testChat.ts";
import Socket from "@/utils/http/websocket.js";
import { genId,genIdForMsg } from "@/utils/idGenerator.js";
import messageBox from '@/components/MessageBox/index.ts';

const spinning = ref<boolean>(false);
let ws:any = null
let isEnd = ref(true);
let disabledSend = computed(() => {
  return !isConnect.value || !isEnd.value
})
const formRef = ref<FormInstance>();
const newMessage = ref('');
const relationId = ref(0);
const isConnect = ref(false);//是否连接websocket
const recordList = reactive({
  user: window.localStorage.getItem('token') ? window.localStorage.getItem('newUserId') : window.localStorage.getItem('userId') || genId('userId',1),
  open_kf_id: 'uIcMlmqSXJQ6259n6I3QMfSODVeFOwk5',
});
const formState = reactive({
  user: '',
  content: '',	
  relation_id: '0',
  status: 0,
  tarot: '',
  tarot_image: '',
  tarot_name: '',
  tarot_info: '',
  message: '',
  question: '',
  answer: ''
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
        user: loginStore.newUserId ? loginStore.newUserId : loginStore.userId,
        'open_kf_id': 'uIcMlmqSXJQ6259n6I3QMfSODVeFOwk5'
      }
      spinning.value = true
      const { data, code } = await getEvaluation(params);
      if(code === 200){
        return resolve(data)
      }
      else{
        return resolve(null)
      }
    }); 

  } catch (error) {
    console.log(error);
  } finally {
    //spinning.value = false;
  }
}


// 设置信息
const setEvaluationStatus = async(result:any = null) =>{
  if(!result) {
    //spinning.value = false
    return
  }

  let status = result.status
  switch (status) {
    case 0:
      spinning.value = false
      formState.status = 0
      formState.message = '喵喵～家人你好！我是来自好喵星球的粉贱贱大师。梦到了奇奇怪怪的事情？说吧，昨晚梦见啥了，给粉贱贱来解解看～喵~🐾🌌🐟'
      formState.content = ''
      break;
    case 1:
      spinning.value = false
      
      if(result){
        formState.status = 1
        formState.message = result.message
        formState.content = ''
        // formState.answer = formState.answer
        // formState.relation_id = result.relation_id
      }
      break;
    case 2:
      spinning.value = false

      //sendEvaluation()
      //evaluation = await sendEvaluation(2) as any
      if(result){
        formState.status = 2
        formState.message = result.message
      }
      break;
    default:
      break;
  }
}


// 发送问题，进入步骤，得出最终结果
const handleSubmit = (status:number)=>{
  if (formRef && formRef.value) {
    formRef.value
      .validate()
      .then(async() => {
        if(isEnd.value === true){
          spinning.value = true
          formState.status = status
          formState.message = ''
          sendMessage()
        }
        else{
          messageBox.info('请等待分析结果')
        }

        // let evaluation = await sendEvaluation(status) as any
        // setEvaluationStatus(evaluation)
      })
      .catch((err) => {
        messageBox.info('请填写您的回答')
      });
  }

}
// 发送消息
const sendMessage = () => {  
  if(isConnect.value === true){
    // 处理非空的 messages.value
    let messageId = genIdForMsg(2 ,20);

    // 发送消息
    let sendData = {
      'message_id': messageId,
      'message': formState.content,
      'status': formState.status,
      'relation_id': relationId.value,
      'user': window.localStorage.getItem('token') ? window.localStorage.getItem('newUserId') : window.localStorage.getItem('userId') || genId('userId',1),
      'open_kf_id': 'uIcMlmqSXJQ6259n6I3QMfSODVeFOwk5'
    }
    ws.sendMsg(sendData)
    formState.content = ''
    isEnd.value = false;
  }
};

const initStatus = async() =>{
  spinning.value = true
  let result:any = await getEvaluationInfo()
  console.log(result);
  setEvaluationStatus(result)
}

const initWebSocket = () => {
  spinning.value = true
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
        spinning.value = false

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

onMounted(() => {
  initWebSocket()
  initStatus()

  //监听连接状态变化
  watch(()=> ws.status, async(newValue, oldValue) => {
    console.log('myVariable 变化了:', newValue);
    if(newValue === 'open'){
      isConnect.value = true;
    }
    else{
      isConnect.value = false;
    }
  });
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
textarea.ant-input.customer-textarea-small{
  --at-apply: w-full h-10rem bg-[#fff] outline-none resize-none border-none;
}
</style>

