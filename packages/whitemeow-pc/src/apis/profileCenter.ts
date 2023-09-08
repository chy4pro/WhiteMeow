import axios from '@/utils/http/index';
interface UpdateUserReqForm {
  user:string,
  sex?:number,
  name?:string,
  birthday?:string,
  constellation?:string
}

interface UpdatePasswordReqForm {
  user:string,
  mobile:string,
  code:string,
  password:string,
}

interface FeedbackSaveReqForm {
  user:string,
  message_id:string,
  title?: string,	
  open_kf_id:string,
  content:string,	
  contact?:string,
  images?:string,
}
// 修改用户信息
export const updateUser = (params:UpdateUserReqForm) => {
  return axios.post('/user/update-user', params)
}

// 根据用户和手机号更新密码
export const updateUserPassword = (params:UpdatePasswordReqForm) => {
  return axios.post('/user/update-user-password', params)
}

// 保存反馈信息
export const feedbackSave = (params:FeedbackSaveReqForm) => {
  return axios.post('/feedback/save', params)
}

// 文件上传 api 函数简单封装
export const uploadApi = ({file, onUploadProgress, signal} : any) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('file_type', '1');

  const config = {
    onUploadProgress,
    signal
  }

  return axios.post('/upload', formData, config)
};
