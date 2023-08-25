<template>
  <div class="wh-full box-border overflow-y-auto relative bg-[url(@/assets/images/tarot-bg.png)]">
    <div v-show="formState.status === 0 || formState.status === 1">

      <div class="px-6.4rem">
        <div class="
          w-full
          min-h-20rem
          relative
          mb-5.4rem
          mt-12.1rem
          bg-[url(@/assets/images/dialog_box2.svg)]
          bg-no-repeat
          bg-bottom"
          style="background-size: 100% 100%;"
          >
          <SvgImage name="cat_red3.svg" class="
            w-full
            h-12.1rem
            absolute
            right--4rem
            top--9.5rem
          "></SvgImage>
          <div class="
          h-100px
          absolute
          bottom-2rem
          overflow-auto
          pl-9.8rem
          pr-9.9rem
          text-2rem
          font-500
          color-black
          z-666
          line-height-normal">{{ formState.message }}</div>
        </div>
      </div>
      <div class="
      text-2rem
      font-600
      mb-1.4rem
      px-6.4rem
      color-#FFDFFC">
        <span v-show="formState.status === 0">我的回答：（尽可能详细的描述你的梦境）</span>
        <span v-show="formState.status === 1">再次补充：（只有一次补充机会，请尽可能的补充梦境的所有内容）</span>
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
          v-if="formState.status === 0"
          >
            查看解析
          </a-button>
          <a-button :loading="spinning" class="
          w-14.9rem
          h-6.4rem
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
          v-if="formState.status === 1"
          >
            查看解析
          </a-button>
        </div>
      </div>
    </div>
    
    <div v-show="formState.status === 2">
      <div class="
          w-full
          min-h-45rem
          relative
          mb-5.4rem
          mt-12.1rem
          bg-[url(@/assets/images/dialog_box3.svg)]
          bg-no-repeat
          bg-bottom"
          style="background-size: 100% 100%;"
          >
          <SvgImage name="cat_red3.svg" class="
            w-full
            h-12.1rem
            absolute
            right--4rem
            top--9.5rem
          "></SvgImage>
          <div class="
          h-35rem
          absolute
          bottom-2rem
          overflow-auto
          pl-9.8rem
          pr-9.9rem
          text-2rem
          font-500
          color-black
          z-666
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
import { getEvaluation, evaluation } from "@/apis/testChat.ts";
import { useLoginStore } from '@/store/index.js';
import { message, type FormInstance } from "ant-design-vue";
const loginStore = useLoginStore();
import { genId } from "@/utils/idGenerator.js";

const router = useRouter();
const isFlipped = ref(false)
const status = ref(0)
const spinning = ref<boolean>(false);

const formRef = ref<FormInstance>();

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
        user: genId("userId", 1),
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

// 发送测评
const sendEvaluation = async(status:number) => {
  try {
    return new Promise(async(resolve, reject) => {
    let params = {
      user: genId("userId", 1),
      'open_kf_id': 'uIcMlmqSXJQ6259n6I3QMfSODVeFOwk5',
      'message': formState.content,
      'relation_id': formState.relation_id.toString(),
      'status': status
    }

    const {data, code}= await evaluation(params);
    console.log('evaluation:',data)
    if(code === 200){
      formState.status = status //如果状态为0，设置状态为1，表示第一次抽牌
      return resolve(data)
    }
    else{
      return resolve(null)
    }
  })
  } catch (error) {
    console.log('error',error);
    
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
        spinning.value = true
        let evaluation = await sendEvaluation(status) as any
        setEvaluationStatus(evaluation)
      })
      .catch((err) => {
        message.info('请填写您的回答')
      });
  }

}

const initStatus = async() =>{
  spinning.value = true
  let result:any = await getEvaluationInfo()
  console.log(result);
  setEvaluationStatus(result)
}

onMounted(() => {
  initStatus()
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

