<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from '@vueuse/core'

const ResetComp = defineAsyncComponent(() => import("./resetComp.vue"));

import eyeIcon from "@/assets/images/login/eye.png";
import eyeActIcon from "@/assets/images/login/eye-act.png";

import { useLoginStore, userMessage } from "@/store/index.js";
import {
  sendSms,
  loginByCode,
  updateLogin,
  getUser,
  login,
} from "@/apis/login.ts";
import { genId } from "@/utils/idGenerator.js";
import { storage } from "@/utils/index.ts";

const state = reactive({
  loginType: "code",
  eyeBool: false,
  isLoginBool: false,
  type: "login",
});

const loginStore = useLoginStore();
const messageStore = userMessage();
const newMessage = ref("");
const router = useRouter();

import type { Rule } from "ant-design-vue/es/form";
import type { FormInstance } from "ant-design-vue";

import { message } from "ant-design-vue";

interface FormState {
  mobileNumber: number | string;
  identifyCode: number | string;
  agreementCheck: boolean;
  password: number | string;
}
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  mobileNumber: "",
  identifyCode: "",
  agreementCheck: false,
  password: "",
});

let validatePass = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("请输入短信验证码");
  } else {
    if (value.length < 6 || value.length > 6) {
      return Promise.reject("请输入有效的短信验证码");
    }
    return Promise.resolve();
  }
};

let validateMobilePhone = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("请输入手机号");
  } else {
    var reg = /^1[3456789]\d{9}$/;
    if (!reg.test(value)) {
      return Promise.reject("请输入有效的手机号码");
    }
    return Promise.resolve();
  }
};

let validateAgreement = async (_rule: Rule, value: boolean) => {
  if (value === false) {
    return Promise.reject("请阅读并同意");
  } else {
    return Promise.resolve();
  }
};

let passwordReg = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("请输入密码");
  }
  return Promise.resolve();
};

const rules: Record<string, Rule[]> = {
  mobileNumber: [
    { required: true, validator: validateMobilePhone, trigger: "blur" },
  ],
  identifyCode: [{ required: true, validator: validatePass, trigger: "blur" }],
  agreementCheck: [
    { required: true, validator: validateAgreement, trigger: "change" },
  ],
  password: [{ required: true, validator: passwordReg, trigger: "blur" }],
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
  if (state.loginType === "code") {
    if (
      formState.mobileNumber &&
      formState.identifyCode &&
      formState.agreementCheck
    ) {
      disabledCodeLogin.value = false;
    } else {
      disabledCodeLogin.value = true;
    }
  }

  if (state.loginType === "psd") {
    if (
      formState.mobileNumber &&
      formState.password &&
      formState.agreementCheck
    ) {
      disabledCodeLogin.value = false;
    } else {
      disabledCodeLogin.value = true;
    }
  }

  return;
  // if (formRef && formRef.value) {
  //   formRef.value
  //     .validate()
  //     .then(() => {
  //       disabledCodeLogin.value = false;
  //       //return false;
  //     })
  //     .catch((err) => {
  //       disabledCodeLogin.value = true;
  //       //return true
  //     });
  // }
};

const goBack = () => {
  router.back();
};
const sendMessage = () => {
  if (newMessage.value) {
    messageStore.firstMessage = newMessage.value;
    newMessage.value = "";
  }

  router.push({ name: "chat" });
};

const mobileNumber = ref<string | number>("");
const disableSendMsg = ref<boolean>(false);
const countDown = ref<number>(60);
const identifyCode = ref<string | number>("");
// 发送短信
const sendMsg = async () => {
  let count: any = null;
  const reset = () => {
    disableSendMsg.value = false;
    clearInterval(count);
    countDown.value = 60;
  };
  try {
    if (formRef && formRef.value) {
      formRef.value
        .validateFields(["mobileNumber"])
        .then(async () => {
          if (!disableSendMsg.value) {
            disableSendMsg.value = true;
            // 倒计时
            count = setInterval(() => {
              if (countDown.value === 0) {
                reset();
                return;
              }
              countDown.value--;
            }, 1000);

            const res = await sendSms({ mobile: formState.mobileNumber });
            let result: any = res.data;
            if (result?.message !== "ok") {
              reset();
            }
          } else {
          }
        })
        .catch((err) => {});
    }
  } catch (err) {
    reset();
  } finally {
  }
};

// 更新登录状态
const updateLoginStatus = async () => {
  try {
    let params = {
      user: newUserId.value ? newUserId.value : genId("userId", 1),
      password: "123456",
      status: 1,
    };

    const res = await updateLogin(params);
    let result: any = res.data;
    if (result && result.token && result.token.length > 0) {
      //storage.setItem("token", result.token as string);
      loginStore.token = useStorage("token", result.token as string);
      getUserInfo();
      router.push({ name: "chat" });
    }
  } catch (err) {
  } finally {
  }
};

const getUserInfo = async () => {
  try {
    let params = {
      Authorization: window.localStorage.getItem("token"),
    };

    const res = await getUser(params);
    let result: any = res.data;
    //loginStore.userInfo = result;
    if (result && Object.keys(result).length > 0) {
      //storage.setItem("userInfo", JSON.stringify(result));
      loginStore.userInfo = useStorage("userInfo", result);
    }

    router.push({ path: "/chat" });
  } catch (err) {
  } finally {
  }
};
const autoLoginForIdentify = ref<boolean>(false);
const newUserId = ref("");
// 验证码登录
const startLogin = async () => {
  try {
    let params = {
      mobile: formState.mobileNumber,
      code: formState.identifyCode,
      is_login_free: autoLoginForIdentify.value ? 1 : 0,
      user: genId("userId", 1),
    };

    if (formRef && formRef.value) {
      formRef.value
        .validate()
        .then(async () => {
          disabledCodeLogin.value = false;
          const res: any = await loginByCode(params);
          let result: any = res.data;

          if (result && result.user) {
            newUserId.value = result.user as string;
            //storage.setItem("newUserId", result.user as string);
            loginStore.newUserId = useStorage("newUserId", result.user as string);
          }

          if (result && result.status === 1) {
            loginStore.token = useStorage("token", result.token as string);
            
            //storage.setItem("token", result.token as string);
            getUserInfo();
          }

          if (result && result.status === 2) {
            router.push({
              path: "/set",
              query: {
                auto: autoLoginForIdentify.value ? "1" : "0",
                read: formState.agreementCheck ? "1" : "0",
              },
            });
          }
        })
        .catch((err) => {
          messageAgreement(err)
        });
    }
  } catch (err) {
  } finally {
  }
};

const messageAgreement = (err: any) => {
  err['errorFields'].forEach((field:any) => {
    if(field['name'][0] === 'agreementCheck'){
      message.error(field['errors'][0]);
    }
  });
};

const openDialog = (theType: string) => {
  if (theType === "1") {
    router.push({ path: "/protocol" });
  }
  if (theType === "2") {
    router.push({ path: "/privacy" });
  }
};

const handleChangeTab = (str: string) => {
  state.loginType = str;
};

const handlePsdLogin = () => {
  const { isLoginBool } = state;

  try {
    const params = {
      mobile: formState.mobileNumber,
      password: formState.password,
      is_login_free: autoLoginForIdentify.value ? 1 : 0,
    };

    if (formRef && formRef.value) {
      formRef.value
        .validate()
        .then(async () => {
          if (isLoginBool) {
            return;
          }
          state.isLoginBool = true;

          const res: any = await login(params);
          let result: any = res.data;
          state.isLoginBool = false;

          if (result && result.status === 1) {
            //storage.setItem("newUserId", result.user as string);
            loginStore.newUserId = useStorage("newUserId", result.user as string);
            //storage.setItem("token", result.token as string);
            loginStore.token = useStorage("token", result.token as string);
            
            getUserInfo();
          }
        })
        .catch((err: any) => {
          // message.error(err.msg);
          state.isLoginBool = false;
          messageAgreement(err)
        });
    }
  } catch (error: any) {
    state.isLoginBool = false;
    message.error(error.msg);
  }
};

const showBackBool = computed(() => {
  return state.type === "reset";
});

const handleBackEmit = () => {
  state.type = "login";
};
</script>

<template>
  <div
    class="
    w-108rem
    max-h-72rem
    h-[calc(100%-88px)]
    max-w-1080px
    max-h-720px
    z-999
    bg-white
    rounded-24px
    mt-48px
    overflow-hidden
    flex-shrink-0
    overflow-hidden "
    style="box-shadow: 0px 0px 33px 0px rgba(219, 175, 201, 0.45)"
  >
    <div class="flex flex-row-start wh-full">
      <div class="w-44.3rem h-full max-w-443px bg-white">
        <div class="mt-9rem mx-4rem" style="position: relative">
          <div
            class="ta-back"
            v-if="showBackBool"
            @click="state.type = 'login'"
          ></div>

          <div class="text-center">
            <SvgImage
              name="catpaw-logo.svg"
              class="w-16.5rem h-4.3rem mb-4.2rem max-w-165px"
            />
          </div>

          <template v-if="state.type === 'reset'">
            <ResetComp @handleBackEmit="handleBackEmit" />
          </template>

          <template v-if="state.type === 'login'">
            <div class="ta-tab">
              <div
                :class="[
                  'tab-item',
                  state.loginType === 'code' && 'tab-item-active',
                ]"
                @click="handleChangeTab('code')"
              >
                验证码登录
              </div>
              <div
                :class="[
                  'tab-item',
                  state.loginType === 'psd' && 'tab-item-active',
                ]"
                @click="handleChangeTab('psd')"
              >
                密码登录
              </div>
            </div>

            <a-form
              ref="formRef"
              name="custom-validation"
              :model="formState"
              :rules="rules"
              v-bind="layout"
              autocomplete="off"
              @finish="handleFinish"
              class="h-[calc(100%-300px)] overflow-y-auto"
            >
              <template v-if="state.loginType === 'code'">
                <div class="mb-16px">
                  <a-form-item ref="mobileNumber" name="mobileNumber">
                    <a-input-group compact class="input-group">
                      <a-input
                        v-model:value="formState.mobileNumber"
                        placeholder="请输入电话号码"
                        class="normal-input-wrap"
                        style="width: 100%"
                        allow-clear
                      />
                    </a-input-group>
                  </a-form-item>
                  <div
                      class="text-12px font-500 color-#E2E2E2 line-height-1.8rem mt-4px"
                    >
                      未注册的手机号将自动注册并登录
                    </div>
                </div>

                <a-form-item ref="identifyCode" name="identifyCode">
                  <a-input
                    class="normal-input-wrap"
                    v-model:value="formState.identifyCode"
                    placeholder="请输入短信验证码"
                    @input="handleFormInput()"
                    allow-clear
                  >
                    <template #suffix>
                      <div
                        class="cursor-pointer"
                        :class="{ 'text-[#ADADAD]': disableSendMsg }"
                        @click="sendMsg"
                      >
                        <span v-show="disableSendMsg === false"
                          >获取验证码</span
                        >
                        <span v-show="disableSendMsg === true"
                          >重新发送{{ countDown }}s</span
                        >
                      </div>
                    </template>
                  </a-input>
                </a-form-item>
              </template>

              <template v-if="state.loginType === 'psd'">
                <div class="mb-16px">
                  <a-form-item ref="mobileNumber" name="mobileNumber">
                    <a-input-group compact class="input-group">
                      <a-input
                        v-model:value="formState.mobileNumber"
                        placeholder="请输入电话号码"
                        class="normal-input-wrap"
                        style="width: 100%"
                        allow-clear
                      />
                    </a-input-group>
                  </a-form-item>
                </div>

                <a-form-item ref="password" name="password">
                  <a-input
                    class="normal-input-wrap"
                    v-model:value="formState.password"
                    placeholder="请输入你的密码"
                    @input="handleFormInput()"
                    allow-clear
                    :type="state.eyeBool ? 'text' : 'password'"
                  >
                    <template #suffix>
                      <div
                        class="cursor-pointer"
                        @click="state.eyeBool = !state.eyeBool"
                      >
                        <img
                          width="24"
                          height="24"
                          :src="state.eyeBool ? eyeActIcon : eyeIcon"
                          alt=""
                        />
                      </div>
                    </template>
                  </a-input>
                </a-form-item>
              </template>

              <div class="ta-forget">
                <a-checkbox
                  class="pink-checkbox"
                  v-model:checked="autoLoginForIdentify"
                  >自动登录</a-checkbox
                >
                <span
                  v-if="state.loginType === 'psd'"
                  @click="state.type = 'reset'"
                  >忘记密码?</span
                >
              </div>

              <template v-if="state.loginType === 'code'">
                <!-- <a-button
                  class="w-full color-white min-h-30px h-5.6rem mt-4rem"
                  :class="disabledCodeLogin ? 'bg-[#999]' : 'bg-black'"
                  @click="startLogin"
                  >登录/注册</a-button
                > -->

                <div
                  @click="startLogin"
                  :class="['ta-button', !disabledCodeLogin && 'ta-btn-active']"
                >
                登录/注册
                </div>
              </template>

              <template v-if="state.loginType === 'psd'">
                <!-- <a-button
                  class="w-full color-white min-h-30px h-5.6rem mt-4rem"
                  :class="disabledCodeLogin ? 'bg-[#999]' : 'bg-black'"
                  @click="handlePsdLogin"
                  >登录</a-button
                > -->

                <div
                  @click="handlePsdLogin"
                  :class="['ta-button', !disabledCodeLogin && 'ta-btn-active']"
                >
                  登录
                </div>
              </template>

              <a-form-item
              ref="agreementCheck"
              name="agreementCheck"
              validateStatus=""
              help=""
              >
                <div class="flex-row-start">
                  <a-checkbox
                    class="self-start pink-checkbox"
                    v-model:checked="formState.agreementCheck"
                    @change="handleFormInput()"
                  >
                  </a-checkbox>

                  <div class="ml-8px">
                    <span class="text-12px">我已阅读并同意</span>
                    <a
                      class="text-12px inline-block color-#374AF5"
                      href="javascript:;"
                      @click="openDialog('1')"
                      >《用户协议》</a
                    >
                    <span class="text-12px">和</span>
                    <a
                      class="text-12px inline-block color-#374AF5"
                      href="javascript:;"
                      @click="openDialog('2')"
                      >《隐私协议》</a
                    >
                  </div>
                </div>
              </a-form-item>
            </a-form>
          </template>
        </div>
      </div>

      <div class="w-64.8rem max-w-648px h-100% bg-[var(--pink-01)] relative">
        <SvgImage name="login-panel-bg.svg" class="wh-full"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ta-button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  border-radius: 0.6rem;
  margin-top: 4rem;
  height: 5.6rem;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
.ta-btn-active:hover {
  background-color: rgba(0, 0, 0, 0.8);
}
.ta-btn-active:active {
  background-color: rgba(0, 0, 0, 0.6);
}
.ta-btn-active {
  background-color: rgba(0, 0, 0, 1);
}
.ta-back {
  width: 2.4rem;
  height: 2.4rem;
  position: absolute;
  top: -5.5rem;
  left: 0;
  background-image: url("@/assets/images/login/back.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 100% 100%;
  cursor: pointer;
}
.ta-back:hover {
  background-image: url("@/assets/images/login/back-hor.png");
}
.ta-back:active {
  background-image: url("@/assets/images/login/back-press.png");
}
.ta-forget {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  span{
    text-decoration: underline;
    font-size: 1.4rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
    cursor: pointer;
  }
  :deep .ant-checkbox+span{
    line-height: normal;
    display: block;
    font-size: 1.4rem;
    font-weight: 500;
  }
}
.ta-tab {
  display: flex;
  margin-bottom: 2.4rem;

  .tab-item-active {
    border-bottom: 2px solid #000 !important;
    color: #000 !important;
    font-weight: 600 !important;
  }
  .tab-item {
    flex: 1;
    height: 2.8rem;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    border-bottom: 2px solid rgba(217, 217, 217, 1);
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 1.8rem;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.4);
  }
}
</style>

<style scoped>
:deep .el-tabs__item.is-active {
  color: #000;
}
:deep .el-tabs__active-bar {
  background-color: #000;
}
:deep .el-tabs__item {
  color: #b3b3b3;
}
.input-group {
  --at-apply: flex-row-start flex-nowrap;
}
:deep .input-group .ant-select-selector {
  --at-apply: bg-[#F4F5F7] border-[#F4F5F7] outline-none h-5.6rem;
}
:deep .input-group .ant-select-selector .ant-select-selection-item {
  --at-apply: line-height-5.6rem;
}
.normal-input-wrap {
  --at-apply: h-5.6rem min-h-30px bg-[#F4F5F7] border-[#F4F5F7] outline-none;
}
:deep .normal-input-wrap input {
  --at-apply: bg-[#F4F5F7] border-[#F4F5F7] outline-none;
}
.ant-form-item{
  margin-bottom: 0;
}
</style>