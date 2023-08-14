<script setup lang="ts">
import { reactive, ref } from "vue";
import { sendSms, checkCode, updatePassword } from "@/apis/login.ts";
import type { UploadProps } from 'ant-design-vue';
// import { PlusOutlined } from '@ant-design/icons-vue';
import { genIdForMsg } from "@/utils/idGenerator.js";

import type { Rule } from "ant-design-vue/es/form";
import { message, type FormInstance } from "ant-design-vue";

const emit = defineEmits(["handleBackEmit"]);
import { updateUserPassword, uploadApi, feedbackSave} from "@/apis/profileCenter.ts";
import { useLoginStore } from "@/store";
const loginStore = useLoginStore();

const state = reactive({
  type: "1",
  eyeBool: false,
  isNextBool: false,
  eyeBool2: false,
});

let disabledCodeLogin = ref(true);


const formRef = ref<FormInstance>();
const formState = reactive({
  user: '',
  message_id: '',
  title: '',	
  open_kf_id: '',
  content: '',	
  contact: '',
  images: '',
  fileList: ref([]) as any
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


const rules: Record<string, Rule[]> = {
  content: [
    { required: true, message: '请填写您的问题', trigger: "blur" },
  ]
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

const getImageListPath = (fileList:any) => {
  console.log(fileList);
  console.log(fileList[0]);
  let result = ''
  let tempArr = []
  for(let i = 0; i < fileList.length; i++){
    if(fileList[i].response && fileList[i].response.url){
      tempArr.push(fileList[i].response.url)
    }
    
  }  
  result = tempArr.join(',')
  return result;
}
const handleSubmit = () => {

  try {
    if (formRef && formRef.value) {
      formRef.value
        .validate()
        .then(async () => {
          let params = {
            user: loginStore.userInfo.user,
            message_id: genIdForMsg(),
            title: '',	
            open_kf_id: 'wkWpQ2GQAAPtHdT-Jdk4ltXYZKlnHoSA',
            content:formState.content,	
            contact:formState.contact,
            images: getImageListPath(formState.fileList),
          }
          const res = await feedbackSave(params);
          let result: any = res.data;

          if (res && res.code === 200) {
            // disabledCodeLogin.value = true;
            message.success("收到您的反馈了～");
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


function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const fileList = ref<UploadProps['fileList']>([
  // {
  //   uid: '-4',
  //   name: 'image.png',
  //   status: 'done',
  //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  // },
  // {
  //   uid: '-xxx',
  //   percent: 50,
  //   name: 'image.png',
  //   status: 'uploading',
  //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  // },
  // {
  //   uid: '-5',
  //   name: 'image.png',
  //   status: 'error',
  // },
]);
const controller = new AbortController()

// 自定义文件上传公共函数
// e.onProgress(event)  event的格式为 {percent:xxx}
const customUpload = (e:any) => {
  console.log(e);
  // 上传接口  e.file 就是接口所用的 file
  uploadApi({
    file: e.file,
    onUploadProgress: (ev:any) => {
      // ev - axios 上传进度实例，上传过程触发多次
      // ev.loaded 当前已上传内容的大小，ev.total - 本次上传请求内容总大小
      console.log(ev);
      const percent = (ev.loaded / ev.total) * 100;
      // // 计算出上传进度，调用组件进度条方法
      e.onProgress({ percent });
    },
    signal: controller.signal
  })
    .then((res) => {
      console.log('上传成功', res.data);
      const fileList = formState.fileList.value;

      if(fileList){
        fileList.push({
          uid: '-4',
          name: 'image.png',
          status: 'done',
          url: res.data as string
        },)
      }

      e.onSuccess(res.data, e);
    })
    .catch((err) => {
      e.onError(err);
    });
};


const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
const handlePreview = async (file:any) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const progress: UploadProps['progress'] = {
  strokeColor: {
    '0%': '#FF98F5',
    '100%': '#FF98F5',
  },
  strokeWidth: 3,
  // format: percent => `${parseFloat(percent.toFixed(2))}%`,
  class: 'customer-upload-progress',
};
</script>

<template>
  <div class="w-full h-full overflow-y-scroll">
    <div class="h-full ml-40px mt-72px ">
      <a-form
        ref="formRef"
        name="custom-validation"
        :model="formState"
        :rules="rules"
        layout="vertical"
        autocomplete="off"
      >
        
          <div class="mb-24px">
            <div class="form-item-title">问题描述（必填）</div>
            <a-form-item ref="content" name="content">
              <a-textarea
                  v-model:value="formState.content"
                  placeholder="您的意见很重要！请畅所欲言～"
                  class="customer-textarea"
                  :autosize="false"
                />
            </a-form-item>
          </div>

          <div class="mb-24px">
            <div class="form-item-title">添加图片（选填）</div>
            <a-form-item ref="identifyCode" name="identifyCode">
              <div class="clearfix">
                <a-upload
                  v-model:file-list="formState.fileList"
                  name="file"
                  :custom-request="customUpload"
                  list-type="picture-card"
                  class="customer-upload"
                  :progress="progress"
                  :showUploadList="{showPreviewIcon: false, showRemoveIcon: false}"
                  @preview="handlePreview"
                >
                  <div v-if="formState.fileList.length < 8">
                    <SvgImage name="icon_plus.svg" class="w-2.4rem h-2.4rem" />
                    <div class="text-1.4rem color-[var(--text-04)] font-400 line-height-2.4rem">上传图片</div>
                  </div>
                  <div v-else>
                    123
                  </div>
                </a-upload>
                <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
            </a-form-item>
          </div>

          <div class="mb-40px">
            <div class="form-item-title">联系方式（选填）</div>
            <a-form-item ref="contact" name="contact" style="margin-bottom: 16px;">
              <div class="flex-row-start">
                <a-input
                  class="normal-input-wrap"
                  v-model:value="formState.contact"
                  placeholder="QQ/邮箱/手机号 方便我们联系您"
                  @input="handleFormInput()"
                  allow-clear
                >
                </a-input>
              </div>
            </a-form-item>
          </div>
        <!-- <a-button
          class="w-full color-white min-h-30px h-5.6rem mt-4rem"
          :class="disabledCodeLogin ? 'bg-[#999]' : 'bg-black'"
          @click="handleNext"
          >{{ state.type === "1" ? "下一步" : "确认" }}</a-button
        > -->
        <div class="w-12rem pb-7.2rem">
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
  font-size: 14px;
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
  --at-apply: w-35.2rem h-40px min-h-30px bg-[#F4F5F7] border-[#F4F5F7] outline-none;
}
:deep .normal-input-wrap input {
  --at-apply: bg-[#F4F5F7] border-[#F4F5F7] outline-none;
}

.form-item-title{
  --at-apply: text-14px font-500 line-height-24px color-[var(--text-02)] mb-8px;
}
.ant-form-item{
  margin-bottom: 0;
}

/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.customer-textarea{
  --at-apply: w-35.2rem h-18.3rem min-h-30px bg-[#F4F5F7] border-[#F4F5F7] outline-none resize-none;
}
:deep .customer-upload.ant-upload-wrapper.ant-upload-picture-card-wrapper .ant-upload.ant-upload-select{
  --at-apply: w-80px h-80px border-[var(--text-04)] bg-[#F4F5F7];
}
:deep .customer-upload.ant-upload-wrapper.ant-upload-picture-card-wrapper .ant-upload-list.ant-upload-list-picture-card .ant-upload-list-item-container{
  --at-apply: w-80px h-80px;
}
:deep .customer-upload-progress.ant-progress .ant-progress-text  {
  display: none;
}

/* :deep .ant-upload-wrapper.ant-upload-picture-card-wrapper .ant-upload-list.ant-upload-list-picture-card .ant-upload-list-item-thumbnail{
  display: none;
} */
:deep .ant-upload-wrapper.ant-upload-picture-card-wrapper .ant-upload-list.ant-upload-list-picture-card .ant-upload-list-item-progress{
  width: 100%;
  padding: 0 8px;
}
:deep .ant-upload-wrapper .ant-upload-list.ant-upload-list-picture-card .ant-upload-list-item {
  padding: 0;
  overflow: hidden;
}
:deep .ant-progress.ant-progress-show-info .ant-progress-outer{
  padding-inline-end: unset;
}
:deep .ant-upload-wrapper .ant-upload-list.ant-upload-list-picture-card .ant-upload-list-item.ant-upload-list-item-error{
  border: 1px dashed #D10000;
}
:deep .ant-upload-wrapper .ant-upload-list.ant-upload-list-picture-card .ant-upload-list-item.ant-upload-list-item-uploading{
  border: 1px dashed #F18FDB80;
}
:deep .ant-upload-wrapper .ant-upload-list.ant-upload-list-picture-card .ant-upload-list-item.ant-upload-list-item-uploading .ant-upload-list-item-thumbnail{
  display: none;
}

/*隐藏hover*/
:deep .ant-upload-wrapper.ant-upload-picture-card-wrapper .ant-upload-list.ant-upload-list-picture-card .ant-upload-list-item::before{
  display: none;
}
</style>