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
import router from "@/router";
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
  let result = ''
  let tempArr = []
  for(let i in fileList){    
    if(fileList[i].response && fileList[i].response.file){
      tempArr.push(fileList[i].response.file)
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
          console.log('------',params);
          
          const res = await feedbackSave(params);
          let result: any = res.data;

          if (res && res.code === 200) {
            // disabledCodeLogin.value = true;
            message.success("提交成功");
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

const cancelUpload = (file:any) => {
  controller.abort()

  let result = formState.fileList.filter((item:any) => item.uid !== file.uid)
  formState.fileList = result
}
// 自定义文件上传公共函数
// e.onProgress(event)  event的格式为 {percent:xxx}
let percent = ref(0);
const customUpload = (e:any) => {
  console.log(e);
  // 上传接口  e.file 就是接口所用的 file
  uploadApi({
    file: e.file,
    onUploadProgress: (ev:any) => {
      // ev - axios 上传进度实例，上传过程触发多次
      // ev.loaded 当前已上传内容的大小，ev.total - 本次上传请求内容总大小
      console.log(ev);
      percent.value = (ev.loaded / ev.total) * 100;
      // // 计算出上传进度，调用组件进度条方法
      e.onProgress({ percent });
    },
    signal: controller.signal
  })
    .then((res) => {
      console.log('上传成功', res.data);
      const fileList = formState.fileList.value as any;

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

const navbarActive = () =>{
  const clickTabItem:any = inject('clickTabItem')
  clickTabItem(2)
}

onMounted(()=>{
  navbarActive()
})
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
            <div class="form-item-title">问题描述</div>
            <a-form-item ref="content" name="content">
              <a-textarea
                  v-model:value="formState.content"
                  placeholder="您的意见很重要！请畅所欲言～"
                  class="customer-textarea"
                  :autoSize="false"
                  :maxlength="200"
                  @input="handleFormInput()"
                />
            </a-form-item>
          </div>

          <div class="mb-24px">
            <div class="form-item-title">添加图片说明（{{formState.fileList.length}}/3）</div>
            <a-form-item ref="identifyCode" name="identifyCode">
              <div class="clearfix">
                <a-upload
                  v-model:file-list="formState.fileList"
                  accept="image/*"
                  name="file"
                  :custom-request="customUpload"
                  class="customer-upload"
                  :max-count="3"
                  :progress="progress"
                  :showUploadList="{showPreviewIcon: false}"
                  @preview="handlePreview"
                >
                <div v-if="formState.fileList.length < 8" class="flex-col-center">
                  <SvgImage name="icon_plus.svg" class="w-2.4rem h-2.4rem" />
                  <div class="text-1.4rem color-[var(--text-04)] font-400 line-height-2.4rem">上传图片</div>
                </div>

                <template #itemRender="{ file, actions }">
                  <div class="relative w-a">
                    <div class="preview-image-wrap" :class="file.status">
                      <img :src="file?.response?.file" class="wh-full cursor-pointer" v-show="file.status === 'done'" @click="handlePreview(file)"/>
                      
                      <div class="">
                        <!-- <SvgImage name="icon_loading.svg" class="w-2.4rem h-2.4rem" v-show="file.status === 'uploading'"/> -->
                        <div v-show="file.status === 'uploading'" class="w-6.4rem flex-col-center">
                          <a-progress :percent="file.percent" size="small" :show-info="false" strokeColor="#ff98f5" class="m-0"/>
                          <div class="text-[var(--text-04)] text-1.2rem font-400 line-height-2.4rem mt-0.7rem cursor-pointer" @click="cancelUpload(file)">取消</div>
                        </div>

                        <div v-show="file.status === 'error'" class="flex-col-center">
                          <SvgImage name="icon_delete.svg" class="w-2.4rem h-2.4rem"/>
                          <div class="text-[#ff0909] text-1.2rem font-400 line-height-2.4rem mt-0.7rem">上传失败</div>
                        </div>
                      </div>
                    </div>

                    <div class="absolute top--1rem right--0.7rem cursor-pointer" @click="actions.remove" v-if="file.status === 'done'">
                      <SvgImage name="icon_black_delete.svg" class="w-1.6rem h-1.6rem" />
                    </div>
                  </div>
                </template>

                </a-upload>
                <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
            </a-form-item>
          </div>

          <div class="mb-40px">
            <div class="form-item-title">联系方式</div>
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
        提交
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
  --at-apply: w-8rem h-8rem border-[var(--text-04)] bg-[#F4F5F7];
}
:deep .customer-upload.ant-upload-wrapper.ant-upload-picture-card-wrapper .ant-upload-list.ant-upload-list-picture-card .ant-upload-list-item-container{
  --at-apply: w-8rem h-8rem;
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

/*自定义上传*/
.customer-upload{
  --at-apply: 
  flex-row-start;
}
:deep .ant-upload-wrapper .ant-upload.ant-upload-select.ant-upload-select-text{
  --at-apply: 
  w-8rem
  h-8rem
  border-1px
  border-dashed
  rounded-6px
  mr-0.8rem
  flex-col-center
  border-[var(--text-04)]
  cursor-pointer
  overflow-hidden
  bg-[#F4F5F7];
}
:deep .ant-upload-wrapper .ant-upload.ant-upload-select.ant-upload-select-text:hover{
  --at-apply: 
  bg-[#d8d8d8];
}
.preview-image-wrap{
  --at-apply: 
  w-8rem
  h-8rem
  relative
  rounded-6px
  overflow-hidden
  flex-col-center
  bg-[#F4F5F7];
}
.preview-image-wrap.error{
  --at-apply: 
  border-1px
  border-dashed
  rounded-6px
  flex-col-center
  border-[#d10000]
  overflow-hidden
  bg-[#fff];
}
.preview-image-wrap.uploading{
  --at-apply: 
  border-1px
  border-dashed
  rounded-6px
  flex-col-center
  border-[var(--pink-04)]
  overflow-hidden
  bg-[#fff];
}
:deep .ant-upload-wrapper .ant-upload-list{
  --at-apply: 
  flex-row-start;
}
:deep .ant-upload-wrapper .ant-upload-list .ant-upload-list-item-container{
  --at-apply: mr-0.8rem;
}
:deep .ant-form .ant-motion-collapse{
  overflow: visible;
}
/*自定义上传*/
</style>