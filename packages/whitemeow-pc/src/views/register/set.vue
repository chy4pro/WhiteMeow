<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

import { storage } from "@manage/shared/utils/index.ts";
import { updateLogin } from "@manage/shared/apis/login.ts";

import eyeIcon from "@manage/shared/assets/images/login/eye.png";
import eyeActIcon from "@manage/shared/assets/images/login/eye-act.png";
import messageBox from '@manage/shared/components/MessageBox/index.ts';

const state = reactive({
  eyeBool: false,
  eyeBool2: false,
});

const autoLoginForIdentify = ref<boolean>(false);

const router = useRouter();

import type { Rule } from "ant-design-vue/es/form";
import type { FormInstance } from "ant-design-vue";

interface FormState {
  agreementCheck: boolean;
  password: number | string;
  confirmPassword: number | string;
}
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  agreementCheck: false,
  password: "",
  confirmPassword: "",
});

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

const confirmPasswordReg = async (_rule: Rule, value: string) => {
  if (value !== formState.password) {
    return Promise.reject("密码不一致,请重新输入");
  }
  return Promise.resolve();
};

const rules: Record<string, Rule[]> = {
  agreementCheck: [
    { required: true, validator: validateAgreement, trigger: "blur" },
  ],
  password: [{ required: true, validator: passwordReg, trigger: "blur" }],
  confirmPassword: [
    { required: true, validator: confirmPasswordReg, trigger: "blur" },
  ],
};

const layout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

let disabledCodeLogin = ref(true);

const handleFormInput = () => {
  if (
    formState.password &&
    formState.confirmPassword &&
    formState.agreementCheck
  ) {
    disabledCodeLogin.value = false;
  } else {
    disabledCodeLogin.value = true;
  }

  return;

  // if (formRef && formRef.value) {
  //   formRef.value
  //     .validate()
  //     .then(() => {
  //       disabledCodeLogin.value = false;
  //     })
  //     .catch((err) => {
  //       disabledCodeLogin.value = true;
  //     });
  // }
};

const openDialog = (theType: string) => {
  if (theType === "1") {
    router.push({ path: "/protocol" });
  }
  if (theType === "2") {
    router.push({ path: "/privacy" });
  }
};

const messageAgreement = (err: any) => {
  err['errorFields'].forEach((field:any) => {
    if(field['name'][0] === 'agreementCheck'){
      messageBox.error(field['errors'][0]);
    }
  });
};

const handleConfirm = () => {
  try {
    const param = {
      user: window.localStorage.getItem("newUserId"),
      password: formState.password,
      status: 3,
    };

    if (formRef && formRef.value) {
      formRef.value
        .validate()
        .then(async () => {
          const res = await updateLogin(param);
          let result: any = res.data;
          router.push({
            path: "/profile",
            query: {
              read: formState.agreementCheck ? "1" : "0",
            },
          });
        })
        .catch((err) => {
          messageAgreement(err);
        });
    }
  } catch (error) {}
};

onMounted(() => {
  if (router.currentRoute.value.query.auto) {
    formState.agreementCheck =
      router.currentRoute.value.query.read === "1" ? true : false;
    autoLoginForIdentify.value =
      router.currentRoute.value.query.auto === "1" ? true : false;
  }
});
</script>

<template>
  <div
    class="
    wh-full
    overflow-hidden
    rounded-24px"
    style="box-shadow: 0px 0px 33px 0px rgba(219, 175, 201, 0.45)"
  >
    <div class="flex flex-row-start wh-full">
      <div class="w-44.3rem h-full max-w-443px bg-white">
        <div class="mt-9rem mx-4rem">
          <div class="text-center">
            <SvgImage
              name="catpaw-logo.svg"
              class="w-16.5rem h-4.3rem mb-4.2rem max-w-165px"
            />
          </div>
          <div class="title">设置密码</div>
          <a-form
            ref="formRef"
            name="custom-validation"
            :model="formState"
            :rules="rules"
            v-bind="layout"
            autocomplete="off"
          >
            <div class="mb-16px">
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
            </div>
            <div class="">
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
            <div class="ta-forget">
              <a-checkbox
                class="text-12px pink-checkbox"
                v-model:checked="autoLoginForIdentify"
                >自动登录</a-checkbox
              >
            </div>

            <!-- <a-button
              class="w-full color-white min-h-30px h-5.6rem mt-4rem"
              :class="disabledCodeLogin ? 'bg-[#999]' : 'bg-black'"
              @click="handleConfirm"
              >确认</a-button
            > -->

            <div
              @click="handleConfirm"
              :class="['ta-button', !disabledCodeLogin && 'ta-btn-active']"
            >
              确认
            </div>

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

                <div class="ml-0.8rem">
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
        </div>
      </div>

      <div class="w-64.8rem max-w-648px h-100% bg-[var(--pink-01)] relative">
        <div class="
          wh-full
          bg-no-repeat
          bg-[url(@manage/shared/assets/images/login-panel-bg.svg)]
          bg-bottom
        "
        style="background-size: 100%;"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
.title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 2.4rem;
}

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
.ta-forget {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  span{
    text-decoration: underline;
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    cursor: pointer;
  }
}
:deep .ant-checkbox+span{
  line-height: normal;
  display: block;
  font-size: 12px;
  font-weight: 400;
}
.ant-form-item{
  margin-bottom: 0;
}
</style>