import axios from '@/utils/http/index';

// 发送信息
export const sendSms = (params:object) => {
  return axios.post('/login/send-sms', params)
}

// 验证码登录
export const loginByCode = (params:object) => {
  return axios.post('/login/login-by-code', params)
}

// 获取用户信息
export const getUser = (params:object) => {
  return axios.get('/login/get-user', params)
}

// 登出
export const logout = (params:object) => {
  return axios.get('/login/logout', params)
}

// 账号密码登录
export const login = (params:object) => {
  return axios.post('/login', params)
}

// 完善注册信息
export const updateLogin = (params:object) => {
  return axios.post('/login/update-login', params)
}

// 更新密码
export const updatePassword = (params:object) => {
  return axios.post('/login/update-password', params)
}

// 检验校验码
export const checkCode = (params:object) => {
  return axios.get('/login/check-code', params)
}

// 获取图片验证码
export const getPicCode = () => {
  return axios.get('/login/get-captcha')
}