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
                flex-col-center
                text-2rem
                font-600
                color-white
                cursor-pointer
                "
                @click="getQuestion()"
                >
                  深入解析
                </div>
              </div>
              <div class="mt-1.6rem">
                <h3 class="text-1.5rem font-500 color-white text-center">了解此牌面的今日指示</h3>
              </div>
            </div>
          </div>

          <div class="w-35.2rem color-white flex-self-start">
            <h1 class="mb-0.8rem font-700 text-4rem">{{ formState.tarot_name }}</h1>
            <p class="text-1.2rem font-400 line-height-normal">{{ formState.tarot_info }}</p>
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
        bg-[url(@/assets/images/dialog_box2.svg)]
        bg-contain
        bg-no-repeat
        bg-bottom">
        <SvgImage name="cat_red3.svg" class="
          w-full
          h-12.1rem
          absolute
          right--4rem
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
        <div class="pl-7.3rem pr-9.3rem text-2rem font-600 color-black line-height-normal">{{ formState.question }}</div>
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
import { getEvaluation, evaluation } from "@/apis/testChat.ts";
import { useLoginStore } from '@/store/index.js';
import { login } from "@/apis/login";
import { message, type FormInstance } from "ant-design-vue";
import { promiseTimeout } from "@vueuse/core";
const loginStore = useLoginStore();
import { genId } from "@/utils/idGenerator.js";

const router = useRouter();
const isFlipped = ref(false)
const status = ref(0)
const loadingFlipped = ref<boolean>(false)
const noLoadingFlipped = ref<boolean>(false)
  const spinning = ref<boolean>(false);

const formRef = ref<FormInstance>();

const formState = reactive({
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
    return new Promise(async(resolve, reject) => {
    let params = {
      user: genId("userId", 1),
      'open_kf_id': 'oLet5ixVLgOqflofOJqjXqSJg0zYlF7U',
      'message': formState.content,
      'relation_id': formState.relation_id.toString(),
      'status': status
    }

    console.log(params);
    
    const result= await evaluation(params);
    console.log('evaluation:',result)
    if(result && result.code === 200){
      formState.status = status //如果状态为0，设置状态为1，表示第一次抽牌
      return resolve(result.data)
    }
  })
  } catch (error) {
    console.log('error',error);
    
  }

}

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
        formState.tarot_info = result.tarot_info
        formState.question = result.question
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
        formState.tarot_info = result.tarot_info
        formState.question = result.question || result.message
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
        formState.tarot_info = result.message
        formState.question = result.question
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
  loadingFlipped.value = true
  let newResult = await sendEvaluation(2) as any
  if(newResult){
    setEvaluationStatus(newResult)
  }
}

// 发送问题，进入步骤3，得出最终结果
const handleSubmit = ()=>{
  if (formRef && formRef.value) {
    formRef.value
      .validate()
      .then(async() => {
        loadingFlipped.value = true
        let newResult = await sendEvaluation(2) as any
        if(newResult){
          setEvaluationStatus(newResult)
        }
      })
      .catch((err) => {
        message.info('请填写您的回答')
      });
  }

}

const initStatus = async() =>{
  loadingFlipped.value = true

  let result:any = await getEvaluationInfo()
  console.log(result);
  if(result && result.status === 0){
    let newResult = await sendEvaluation(1) as any
    if(newResult){
      setEvaluationStatus(newResult)
    }
  }
  else{
    setEvaluationStatus(result)
  }
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

