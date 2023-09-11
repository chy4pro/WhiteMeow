<script setup lang="ts">
import { reactive, ref } from "vue";
import { sendSms, checkCode, updatePassword } from "@manage/shared/apis/login.ts";

import eyeIcon from "@manage/shared/assets/images/login/eye.png";
import eyeActIcon from "@manage/shared/assets/images/login/eye-act.png";

import type { Rule } from "ant-design-vue/es/form";
import { type FormInstance } from "ant-design-vue";
import messageBox from '@manage/shared/components/MessageBox/index.ts';

const emit = defineEmits(["handleBackEmit"]);
import { updateUserPassword } from "@manage/shared/apis/profileCenter.ts";
import { useLoginStore } from "@manage/shared/store/index.ts";
const loginStore = useLoginStore();

const state = reactive({
  type: "1",
  eyeBool: false,
  isNextBool: false,
  eyeBool2: false,
});

let disabledCodeLogin = ref(true);

interface FormState {
  mobileNumber: number | string;
  identifyCode: number | string;
  password: number | string;
  confirmPassword: number | string;
}

const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  mobileNumber: "",
  identifyCode: "",
  password: "",
  confirmPassword: "",
});

const validatePass = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("请输入短信验证码");
  } else {
    if (value.length < 6 || value.length > 6) {
      return Promise.reject("请输入有效的短信验证码");
    }
    return Promise.resolve();
  }
};

const validateMobilePhone = async (_rule: Rule, value: string) => {
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

// const passwordReg = async (_rule: Rule, value: string) => {
//   if (value === "") {
//     return Promise.reject("请输入密码");
//   }
//   return Promise.resolve();
// };
const passwordReg = async (_rule: Rule, value: string) => {
  const pattern = /^[a-zA-Z0-9]{6,16}$/;
  const isValid = pattern.test(value);

  if (isValid) {
    return Promise.resolve();
  } else {
    return Promise.reject("6-16位密码、数字或字母");
  }
};

const confirmPasswordReg = async (_rule: Rule, value: string) => {
  if (value !== formState.password) {
    return Promise.reject("密码不一致,请重新输入");
  }
  return Promise.resolve();
};

const rules: Record<string, Rule[]> = {
  mobileNumber: [
    { required: true, validator: validateMobilePhone, trigger: "blur" },
  ],
  identifyCode: [{ required: true, validator: validatePass, trigger: "blur" }],
  password: [{ required: true, validator: passwordReg, trigger: "blur" }],
  confirmPassword: [
    { required: true, validator: confirmPasswordReg, trigger: "blur" },
  ],
};

const layout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const handleFormInput = () => {
  if (formRef && formRef.value) {
    formRef.value
      .validate()
      .then(() => {
        disabledCodeLogin.value = false;
      })
      .catch((err) => {
        disabledCodeLogin.value = true;
      });
  }
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

const handleSubmit = () => {

  try {
    if (formRef && formRef.value) {
      formRef.value
        .validate()
        .then(async () => {
          if (state.type === "1") {
            const res = await updateUserPassword({
              mobile: formState.mobileNumber.toString(),
              code: formState.identifyCode.toString(),
              user:loginStore.userInfo.user,
              password:formState.password.toString(),
            });
            let result: any = res.data;

            if (res && res.code === 200) {
              // disabledCodeLogin.value = true;
              messageBox.success('修改成功');
            }
          }
        })
        .catch((err) => {
          disabledCodeLogin.value = true;
        });
    }
  } catch (error) {}
};

const handleBack = () => {
  emit("handleBackEmit");
};

const navbarActive = () =>{
  const clickTabItem:any = inject('clickTabItem')
  clickTabItem(1)
}

const initData = () => {
  formState.mobileNumber = loginStore.userInfo.mobile
}

onMounted(()=>{
  initData()
  navbarActive()
})
</script>

<template>
  <div class="w-full h-full overflow-y-scroll">
    <div class="h-full ml-4rem mt-72px ">
      <a-form
        ref="formRef"
        name="custom-validation"
        :model="formState"
        :rules="rules"
        layout="vertical"
        autocomplete="off"
      >
        
          <div class="mb-2.4rem">
            <div class="form-item-title">手机号</div>
            <a-form-item ref="mobileNumber" name="mobileNumber">
              <a-input-group compact class="input-group">
                <a-input
                  v-model:value="formState.mobileNumber"
                  placeholder="请输入电话号码"
                  class="normal-input-wrap"
                  :disabled="true"
                />
              </a-input-group>
            </a-form-item>
          </div>

          <div class="mb-2.4rem">
            <div class="form-item-title">短信验证码</div>
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
                    <span v-show="disableSendMsg === false">获取验证码</span>
                    <span v-show="disableSendMsg === true"
                      >重新发送{{ countDown }}s</span
                    >
                  </div>
                </template>
              </a-input>
            </a-form-item>
          </div>

          <div class="mb-4rem">
            <div class="form-item-title">新密码</div>
            <a-form-item ref="password" name="password" style="margin-bottom: 1.6rem;">
              <div class="flex-row-start">
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
                <div class="text-1.2rem font-400 line-height-2.4rem color-[rgba(0,0,0,0.4)]">（6-16位密码、数字或字母）</div>
              </div>
            </a-form-item>

            <a-form-item ref="confirmPassword" name="confirmPassword">
              <a-input
                class="normal-input-wrap"
                v-model:value="formState.confirmPassword"
                placeholder="请再次输入以确认"
                @input="handleFormInput()"
                allow-clear
                :type="state.eyeBool2 ? 'text' : 'password'"
              >
                <template #suffix>
                  <div
                    class="cursor-pointer"
                    @click="state.eyeBool2 = !state.eyeBool2"
                  >
                    <img
                      width="24"
                      height="24"
                      :src="state.eyeBool2 ? eyeActIcon : eyeIcon"
                      alt=""
                    />
                  </div>
                </template>
              </a-input>
            </a-form-item>
          </div>
        <!-- <a-button
          class="w-full color-white min-h-30px h-5.6rem mt-4rem"
          :class="disabledCodeLogin ? 'bg-[#999]' : 'bg-black'"
          @click="handleNext"
          >{{ state.type === "1" ? "下一步" : "确认" }}</a-button
        > -->
        <div class="w-12rem">
          <div
          @click="handleSubmit"
          :class="['ta-button', !disabledCodeLogin && 'ta-btn-active']"
        >
        保存
        </div>
        </div>

      </a-form>
    </div>
  </div>
</template>
  
  <style lang="scss" scoped>
.ta-button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  border-radius: 6px;
  height: 4rem;
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

.ta-wrapper {
  color: #000;
  .title {
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 2.4rem;
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
  --at-apply: w-35.2rem h-4rem min-h-30px bg-[#F4F5F7] border-[#F4F5F7] outline-none;
}
:deep .normal-input-wrap input {
  --at-apply: bg-[#F4F5F7] border-[#F4F5F7] outline-none;
}

.form-item-title{
  --at-apply: text-1.4rem font-500 line-height-2.4rem color-[var(--text-02)] mb-8px;
}
.ant-form-item{
  margin-bottom: 0;
}
</style>