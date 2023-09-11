import axios from '../utils/http/index';
// namespace Login {
//   // 用户登录表单
//   export interface LoginReqForm {
//     username: string
//     password: string
//   }
//   // 登录成功后返回的token
//   export interface LoginResData {
//     token: string
//   }
// }
// 用户登录
export const chat = (params:object) => {
  
  // 返回的数据格式可以和服务端约定
  return axios.post('/customer/get-chat-record', params)
}
