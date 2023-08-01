<template>
    <div class="
      w-108rem
      h-72rem
      max-w-1080px
      max-h-720px
      z-999
      bg-white
      rounded-24px
      mt-48px
      overflow-hidden
      flex-shrink-0
      "
      style="box-shadow: 0px 0px 33px 0px rgba(219, 175, 201, 0.45);"
      >
        <div class="flex flex-row-start wh-full" v-show="loginShow">
          <div class="
            w-44.3rem
            h-full
            max-w-443px
            bg-white
          ">
            <div class="mt-9rem mx-4rem">
              <div class="text-center">
                <Image name="catpaw-logo.svg" :width="'16.5rem'" :height="'4.3rem'" class="mb-4.2rem max-w-165px"/>
              </div>
              <a-form
                    ref="formRef"
                    name="custom-validation"
                    :model="formState"
                    :rules="rules"
                    v-bind="layout"
                    autocomplete="off"
                    @finish="handleFinish"
                  >
                  <div class="mb-1.6rem">
                    <a-form-item ref="mobileNumber" name="mobileNumber">
                      <a-input-group compact class="input-group">
                        <!-- <a-select v-model:value="select" class="w-80px">
                          <a-select-option value="+86">+86</a-select-option>
                          <a-select-option value="Jiangsu">Jiangsu</a-select-option>
                        </a-select> -->
                        <a-input v-model:value="formState.mobileNumber" placeholder="请输入电话号码" class="normal-input-wrap" style="width: 100%;"/>
                      </a-input-group>
                      <div class="text-12px font-500 color-#E2E2E2 line-height-1.8rem mt-0.4rem">未注册的手机号将自动注册并登录</div>
                    </a-form-item>
                  </div>

                  <a-form-item ref="identifyCode" name="identifyCode">
                  <a-input class="normal-input-wrap" v-model:value="formState.identifyCode"  placeholder="请输入短信验证码" @input="handleFormInput()" allow-clear>
                    <template #suffix>
                      <div class="cursor-pointer" :class="{'text-[#ADADAD]': disableSendMsg }" @click="sendMsg">
                        <span v-show="disableSendMsg === false">获取验证码</span>
                        <span v-show="disableSendMsg === true">重新发送{{ countDown }}s</span>
                      </div>
                    </template>
                  </a-input>
                  </a-form-item>
                  <div class="mt-0.8rem">
                  <a-checkbox class="text-14px pink-checkbox" v-model:checked="autoLoginForIdentify">自动登录</a-checkbox>
                </div>
                
                <a-button  class="w-full color-white min-h-30px h-5.6rem mt-4rem" :class="disabledCodeLogin ? 'bg-[#999]':'bg-black'" @click="startLogin">登录/注册</a-button>
                <a-form-item ref="agreementCheck" name="agreementCheck">
                  <div class="flex-row-start">
                    <a-checkbox class="self-start pink-checkbox" v-model:checked="formState.agreementCheck" @change="handleFormInput()">
                    </a-checkbox>

                    <div class="ml-0.8rem">
                      <span class="text-14px">我已阅读并同意</span>
                      <a class="text-14px inline-block color-#374AF5" href="javascript:;" @click="openDialog('1')">《用户协议》</a>
                      <span class="text-14px">和</span>
                      <a class="text-14px inline-block color-#374AF5" href="javascript:;" @click="openDialog('2')">《隐私协议》</a>
                    </div>
                  </div>
                </a-form-item>
                  </a-form>
            </div>


          </div>
          <div class="
            w-64.8rem
            max-w-648px
            h-100%
            bg-[var(--pink-01)]
            relative
          ">
            <Image name="login-panel-bg.svg" :width="'100%'" :height="'100%'"/>

            <div class="absolute right-24px top-24px cursor-pointer" @click="goBack"><Image name="login-panel-close.svg" :width="'24px'" :height="'24px'"/></div>
            
          </div>
        </div>
        <!--用户协议-->

    </div>
  
</template>

<script setup lang="ts">
import { useLoginStore, userMessage } from '@/store/index.js';
import { hImage } from '@/utils/preloadImg.js';
import { sendSms, loginByCode, updateLogin, getUser } from '@/apis/login.ts'
import { message } from 'ant-design-vue';
import { genId } from "@/utils/idGenerator.js";
import { storage } from '@/utils/index.ts'

const loginStore = useLoginStore();
const messageStore = userMessage();
const newMessage = ref('');
const router = useRouter();
const input1 = ref('')
const input2 = ref('')
const input3 = ref('')
const select = ref('+86')
const activeKey = ref('1');

const loginShow = ref(true);//显示登录界面
const protocolShow = ref(true);//显示协议界面
const privacyShow = ref(true);//显示隐私界面
const activeName = ref('first')
import type { Rule } from 'ant-design-vue/es/form';
import type { FormInstance } from 'ant-design-vue';

interface FormState {
  mobileNumber: number | string;
  identifyCode: number | string;
  agreementCheck: boolean;
}
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  mobileNumber: '',
  identifyCode: '',
  agreementCheck: false
});

let validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入短信验证码');
  } 
  else {
    if(value.length < 6 || value.length > 6){
      return Promise.reject('请输入有效的短信验证码');
    }
    return Promise.resolve();
  }
};

let validateMobilePhone = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入手机号');
  } else {
    var reg = /^1[3456789]\d{9}$/;
    if(!reg.test(value)){
      return Promise.reject('请输入有效的手机号码');
    }
    return Promise.resolve();
  }
};

let validateAgreement = async (_rule: Rule, value: boolean) => {
  if (value === false) {
    return Promise.reject('请阅读并同意');
  } else {
    return Promise.resolve();
  }
};


const rules: Record<string, Rule[]> = {
  mobileNumber: [
    { required: true, validator: validateMobilePhone, trigger: 'blur' }
  ],
  identifyCode: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ],
  agreementCheck: [
  { required: true,  validator: validateAgreement, trigger: 'blur' },
  ]
};

const layout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const handleFinish = (values: FormState) => {
  console.log(values, formState);
};

let disabledCodeLogin = ref(true);

    // 监听表单输入事件，实时校验并更新按钮状态
    const handleFormInput = () => {
      if(formRef && formRef.value){
        formRef.value
        .validate()
        .then(()=>{
          disabledCodeLogin.value=false;
          //return false;
        }).catch((err)=>{
          disabledCodeLogin.value=true;
          //return true
        })
        };
      }


const goBack = () => {
  router.back();
}
const sendMessage = () => {
  if (newMessage.value){
    console.log('我发送了',newMessage.value);
    messageStore.firstMessage = newMessage.value;
    newMessage.value = '';
  }

  router.push({ name: 'chat'});
}

onMounted(()=>{
  loadImages();
})

//已加载完成的数量 
const loadCount = ref(0);
//执行下载所有图片
const loadImages = ()=> {
  let imgs = [
    '111.gif',
    'emoji/爱你.png',
    'emoji/抱歉.png',
    'emoji/不开心.png',
    'emoji/吃惊.png',
    'emoji/愤怒:暴躁.png',
    'emoji/好奇.png',
    'emoji/开心:哈哈.png',
    'emoji/哭泣:伤心:难过.png',
    'emoji/快乐.png',
    'emoji/困.png',
    'emoji/期待:好奇.png',
    'emoji/请求.png',
    'emoji/生气.png',
    'emoji/无聊.png',
    'emoji/拥抱:关爱.png',
    'emoji/着急.png',
  ]

  for (let img of imgs) {
    hImage(img)
  }
}


const mobileNumber = ref<string|number>('')
const disableSendMsg = ref<boolean>(false)
const countDown = ref<number>(60)
const identifyCode = ref<string|number>('')
// 发送短信
const sendMsg = async() => {
  let count:any = null
  const reset = () => {
    disableSendMsg.value = false
    clearInterval(count);
    countDown.value = 60
  }
  try {
    if(formRef && formRef.value){
      formRef.value
      .validateFields(['mobileNumber'])
      .then(async()=>{
        if(!disableSendMsg.value){
          disableSendMsg.value = true
          // 倒计时
          count = setInterval(()=>{
            if(countDown.value === 0){
              reset()
              return
            }
            countDown.value--
          }, 1000);

          const result = await sendSms({"mobile":formState.mobileNumber});
          //const result = { "message": "ok"}
          if(result?.message !== 'ok'){
            reset()
            //identifyCode.value = result?.data?.code
          }
        }
        else{
          
        }

      }).catch((err)=>{
        //return true
      })
    }

  } catch (err) {
    reset()
    // loading.value = false
    // messages[messages.length - 1].content = err.message
  } finally {
    // loader hide
    // closeToast();
  }
}

// 更新登录状态
const updateLoginStatus = async() => {
  //loginStore.isLogin = true;
  try {
    let params = {
      "user": newUserId.value ? newUserId.value : genId('userId', 1) ,
      "password": "123456",
      "status": 1
    }

    const result = await updateLogin(params);
    if(result && result.token && result.token.length > 0){
      //message.success('登录成功')
      ///loginStore.token = result.token;
      storage.setItem('token', result.token as string)
      getUserInfo()
      router.push({ name: 'chat'});
    }
  } catch (err) {
    // loading.value = false
    // messages[messages.length - 1].content = err.message
  } finally {
    // loader hide
    // closeToast();
  }
}

const getUserInfo = async() =>{
  try {
    let params = {
      "Authorization": storage.getItem('token')
    }

    const result = await getUser(params);
    loginStore.userInfo = result;
    if(result && Object.keys(result).length > 0){
      storage.setItem('userInfo', JSON.stringify(result))
    }
  } catch (err) {
    console.log(err)
    // loading.value = false
    // messages[messages.length - 1].content = err.message
  } finally {
    // loader hide
    // closeToast();
  }
}
const autoLoginForIdentify = ref<boolean>(false)
const newUserId = ref('')
// 验证码登录
const startLogin = async() => {

  try {
    let params = {
      "mobile": formState.mobileNumber,
      "code": formState.identifyCode,
      "is_login_free": autoLoginForIdentify.value ? 1 : 0,
      "user": genId('userId', 1)
    }
    if(formRef && formRef.value){
      formRef.value
      .validate()
      .then(async()=>{
        disabledCodeLogin.value=false;
        const result = await loginByCode(params);
        if(result && result.user){
          newUserId.value = result.user as string
          storage.setItem('newUserId',result.user as string)
        }
        updateLoginStatus()
      }).catch((err)=>{
        //return true
      })
    }

  } catch (err) {
    console.log(err)
    // loading.value = false
    // messages[messages.length - 1].content = err.message
  } finally {
    // loader hide
    // closeToast();
  }
}

const openDialog = (theType: string) => {  
  //emit('openDialog', theType)
  if(theType === '1'){
    router.push({ path: '/protocol'});
  }
  if(theType === '2'){
    router.push({ path: '/privacy'});
  }
}

</script>

<style scoped>
  :deep .el-tabs__item.is-active{
    color: #000;
  }
  :deep .el-tabs__active-bar{
    background-color: #000;
  }
  :deep .el-tabs__item{
    color: #B3B3B3;
  }
  .input-group{
    --at-apply: flex-row-start flex-nowrap ;
  }
  :deep .input-group  .ant-select-selector{
    --at-apply: bg-[#F4F5F7] border-[#F4F5F7] outline-none h-5.6rem;
  }
  :deep .input-group .ant-select-selector .ant-select-selection-item{
    --at-apply: line-height-5.6rem;
  }
  .normal-input-wrap{
    --at-apply: h-5.6rem min-h-30px bg-[#F4F5F7] border-[#F4F5F7] outline-none;
  }
  :deep .normal-input-wrap input{
    --at-apply: bg-[#F4F5F7] border-[#F4F5F7] outline-none;
  }

</style>