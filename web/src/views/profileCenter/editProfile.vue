<script setup lang="ts">
import { ref, reactive, defineAsyncComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStorage } from '@vueuse/core'
import { message } from "ant-design-vue";

const DatePickerComp = defineAsyncComponent(
  () => import("@/components/date-picker/index.vue")
);

import { updateUser } from "@/apis/profileCenter.ts";
import { useLoginStore } from "@/store/index.js";

import boyIcon from "@/assets/images/login/boy.png";
import girlIcon from "@/assets/images/login/girl.png";
import dateIcon from "@/assets/images/login/date.png";
import dateActiveIcon from "@/assets/images/login/date-active.png";

const state = reactive({
  isconfirmBool: false,
  dateFocusBool: false,
});

const router = useRouter();
const loginStore = useLoginStore();

import type { Rule } from "ant-design-vue/es/form";
import type { FormInstance } from "ant-design-vue";

interface FormState {
  agreementCheck: boolean;
  name: string;
  sex: string;
  date: string;
  y: string;
  m: string;
  d: string;
  xz: string;
}
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  agreementCheck: false,
  name: "",
  sex: "2",
  date: "请选择你的出生年月",
  y: "",
  m: "",
  d: "",
  xz: "",
});


const nameReg = async (_rule: Rule, value: string) => {
  const pattern = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/;
  const isValid = pattern.test(value);

  if (isValid) {
    console.log("输入内容符合要求");
    return Promise.resolve();
  } else {
    console.log("输入内容不符合要求");
    return Promise.reject("输入内容不符合要求");
  }
};

const rules: Record<string, Rule[]> = {
  name: [{ required: true, validator: nameReg, trigger: "blur" }],
};

const layout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

let disabledCodeLogin = ref(true);

const handleFormInput = () => {
  if (formRef && formRef.value) {
    formRef.value
      .validate()
      .then(() => {
        disabledCodeLogin.value = false;
      })
      .catch(() => {
        disabledCodeLogin.value = true;
      });
  }
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
  err['errorFields'].forEach((field: any) => {
    if (field['name'][0] === 'agreementCheck') {
      message.error(field['errors'][0]);
    }
  });
};

const handleConfirm = () => {
  const { isconfirmBool } = state;

  try {
    const param = {
      user: loginStore.userInfo.user,
      sex: Number(formState.sex),
      name: formState.name,
      birthday: `${formState.y}-${formState.m}-${formState.d}`,
      constellation: formState.xz,
    };

    if (formRef && formRef.value) {
      formRef.value
        .validate()
        .then(async () => {
          if (isconfirmBool) {
            return;
          }
          state.isconfirmBool = true;

          const res = await updateUser(param);
          let result: any = res.data;
          if(res.code === 200){
            message.success("修改成功");
            state.isconfirmBool = false;
            loginStore.userInfo = {
              ...param,
              gender: param.sex
            };
          }
          

          //storage.setItem("token", result.token as string);
          //getUserInfo();
        })
        .catch((err) => {
          state.isconfirmBool = false;
          //messageAgreement(err);
        });
    }
  } catch (error) { }
};

// const getUserInfo = async () => {
//   try {
//     let params = {
//       Authorization: window.localStorage.getItem("token"),
//     };

//     const res = await getUser(params);
//     let result: any = res.data;
//     //loginStore.userInfo = result;

//     if (result && Object.keys(result).length > 0) {
//       //storage.setItem("userInfo", JSON.stringify(result));
//       loginStore.userInfo = useStorage("userInfo", result);
//     }

//   } catch (err) {
//   } finally {
//   }
// };

const handle = (m: string, d: string) => {
  const day = Number(d);
  const month = String(m);

  switch (month) {
    case "3":
      if (day >= 21) {
        return "白羊座";
      } else {
        return "双鱼座";
      }
      break;
    case "4":
      if (day >= 21) {
        return "金牛座";
      } else {
        return "白羊座";
      }
      break;
    case "5":
      if (day >= 21) {
        return "双子座";
      } else {
        return "金牛座";
      }
      break;
    case " 6":
      if (day >= 22) {
        return "巨蟹座";
      } else {
        return "双子座";
      }
      break;
    case "7":
      if (day >= 23) {
        return "狮子座";
      } else {
        return "巨蟹座";
      }
      break;
    case "8":
      if (day >= 22) {
        return "处女座";
      } else {
        return "狮子座";
      }
      break;
    case "9":
      if (day >= 22) {
        return "天秤座";
      } else {
        return "处女座";
      }
      break;
    case "10":
      if (day >= 24) {
        return "天蝎座";
      } else {
        return "天秤座";
      }
      break;
    case "11":
      if (day >= 23) {
        return "射手座";
      } else {
        return "天蝎座";
      }
      break;
    case "12":
      if (day >= 23) {
        return "摩羯座";
      } else {
        return "射手座";
      }
      break;
    case "1":
      if (day >= 20) {
        return "水瓶座";
      } else {
        return "摩羯座";
      }
      break;
    case "2":
      if (day >= 19) {
        return "双鱼座";
      } else {
        return "水瓶座";
      }
      break;
  }
};

const handleCloseEmit = ({ y, m, d }: any) => {
  state.dateFocusBool = false;
  formState.y = y;
  formState.m = m;
  formState.d = d;

  formState.xz = handle(m, d) || "";
};

const setProfile = () => {
  if(loginStore && loginStore.userInfo){
    let splitDate = loginStore.userInfo?.birthday.split('-')
    formState.name = loginStore.userInfo?.name || '';
    formState.sex = loginStore.userInfo?.gender.toString() || '';
    formState.date = loginStore.userInfo?.birthday || '';
    formState.xz = loginStore.userInfo?.Constellation || '';
    formState.y = splitDate[0];
    formState.m = splitDate[1];
    formState.d = splitDate[2];
    handleFormInput();
  }
}
const navbarActive = () =>{
  const clickTabItem:any = inject('clickTabItem')
  clickTabItem(0)
}


onMounted(() => {
  setProfile()
  navbarActive()
});
</script>

<template>
  <div class="w-full h-full overflow-y-scroll">
    <div class="h-full ml-40px mt-72px ">
      <a-form ref="formRef" name="custom-validation" :model="formState" :rules="rules" v-bind="layout" autocomplete="off">
        <div class="mb-24px">
          <div class="item-title">昵称</div>
          <a-form-item ref="name" name="name">
            <div class="flex-row-start">
              <a-input class="normal-input-wrap w-35.2rem mr-8px" v-model:value="formState.name" placeholder="请输入你的昵称" @input="handleFormInput()"
                allow-clear></a-input>
              <div class="text-12px font-400 line-height-24px color-[rgba(0,0,0,0.4)]">(长度2-20，支持中英文、数字以及不在首尾的下划线)</div>
            </div>
          </a-form-item>
        </div>

        <div class="mb-24px">
          <div class="item-title">性别</div>
          <div class="ta-btn w-35.2rem">
            <div :class="[
              'ta-btn-item',
              'btn-girl',
              formState.sex === '2' && 'girl-active',
            ]" @click="formState.sex = '2'">
              <img :src="girlIcon" width="24" height="24" alt="" />
              女生
            </div>
            <div :class="[
              'ta-btn-item',
              'btn-boy',
              formState.sex === '1' && 'boy-active',
            ]" @click="formState.sex = '1'">
              <img :src="boyIcon" width="24" height="24" alt="" />
              男生
            </div>
          </div>
        </div>

        <div class="w-35.2rem " style="margin-top: 24px">
          <div class="item-title">出生年月</div>
          <div class="date-wrapper" :style="{
            color: formState.y
              ? 'rgba(0, 0, 0, 1)'
              : 'rgba(0, 0, 0, 0.4)',
          }">
            <div :class="['date-box', state.dateFocusBool && 'active']" @click="state.dateFocusBool = !state.dateFocusBool">
              {{
                formState.y
                ? `${Number(formState.y)}/${Number(formState.m)}/${Number(
                  formState.d
                )}`
                : formState.date
              }}
              <img :src="state.dateFocusBool ? dateActiveIcon : dateIcon" width="24" height="24" alt="" />
            </div>
            <div class="xz">{{ formState.xz || '星座' }}</div>
            <div class="date-picker" v-if="state.dateFocusBool">
              <DatePickerComp @handleCloseEmit="handleCloseEmit" :isShow="state.dateFocusBool" :year="formState.y"
                :month="formState.m" :day="formState.d" />
            </div>
            <!-- <div v-if="state.dateFocusBool" @click="state.dateFocusBool = false" class="ta-cover"></div> -->
          </div>
        </div>

        <!-- <a-button
                  class="w-full color-white min-h-30px h-40px mt-4rem"
                  :class="disabledCodeLogin ? 'bg-[#999]' : 'bg-black'"
                  @click="handleConfirm"
                  >确认</a-button
                > -->
        <div class="w-12rem">
          <div @click="handleConfirm" :class="['ta-button', !disabledCodeLogin && 'ta-btn-active']">
            保存
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ta-button {
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  border-radius: 0.6rem;
  margin-top: 4rem;
  height: 40px;
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

.ta-cover {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0);
  left: 0;
  top: 0;
  z-index: 99;
}

.ta-jump {
  display: flex;
  justify-content: flex-end;

  span {
    text-decoration: underline;
    color: rgba(0, 0, 0, 0.4);
    font-size: 1.6rem;
    font-weight: 500;
    cursor: pointer;
  }
}

.date-wrapper {
  display: flex;
  height: 40px;
  font-size: 1.6rem;
  font-weight: 500;
  position: relative;

  .date-picker {
    position: absolute;
    top: 6.5rem;
    width: calc(100% - 10rem - 1rem);
    left: 0;
    z-index: 999;
    background-color: #fff;
    box-shadow: 0 0.6rem 2.7rem;
    border-radius: 0.7rem;
    padding: 2rem 1.5rem;
  }

  .date-box {
    flex: 1;
    border-radius: 6px;
    padding: 1.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(244, 245, 247, 1);
    cursor: pointer;
    border: 1px solid transparent;
  }

  .date-box:hover {
    border-color: #FF6AF0 !important;
  }

  .active {
    border-color: rgba(0, 0, 0, 1) !important;
    background-color: rgba(255, 223, 252, 1) !important;
    color: rgba(0, 0, 0, 1) !important;
  }

  .xz {
    border-radius: 0.6rem;
    width: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(244, 245, 247, 1);
    margin-left: 1rem;
  }
}

.title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 2.4rem;
  padding-left: 0.5rem;
}

.item-title {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-weight: 500;
  padding-left: 0.5rem;
  margin-bottom: 8px;
}

.ta-btn {
  display: flex;
  justify-content: space-between;

  .ta-btn-item {
    flex: 1;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(244, 245, 247, 1);
    border: 1px solid transparent;
    font-size: 1.6rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
    cursor: pointer;
    border-radius: 6px;

    img {
      margin-right: 0.6rem;
    }
  }

  .btn-girl {
    margin-right: 1.6rem;
  }

  .ta-btn-item:hover {
    border: 1px solid #FF6AF0 !important;
  }

  .btn-girl:active {
    background-color: rgba(255, 223, 252, 1) !important;
  }

  .btn-boy:active {
    background-color: rgba(223, 232, 255, 1) !important;
  }

  .girl-active {
    background-color: rgba(255, 223, 252, 1) !important;
  }

  .boy-active {
    background-color: rgba(223, 232, 255, 1) !important;
  }
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
  --at-apply: bg-[#F4F5F7] border-[#F4F5F7] outline-none h-40px;
}

:deep .input-group .ant-select-selector .ant-select-selection-item {
  --at-apply: line-height-40px;
}

.normal-input-wrap {
  --at-apply: h-40px bg-[#F4F5F7] border-[#F4F5F7] outline-none;
}

:deep .normal-input-wrap input {
  --at-apply: bg-[#F4F5F7] border-[#F4F5F7] outline-none;
}
.ant-form-item{
  margin-bottom: 0;
}
</style>