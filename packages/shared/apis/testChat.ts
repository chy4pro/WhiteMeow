import axios from '@/utils/http/index';

// 获取测评结果
export const getEvaluation = (params:object) => {
  return axios.get('/evaluation/get', params)
}

// 测评
export const evaluation = (params:object) => {
  return axios.post('/evaluation', params)
}

//获取测评结果（socket）心理沙盘
export const evaluationGetSocket = (params:object) => {
  return axios.get('/evaluation/get-socket', params)
}

//获取配置信息
export const getConfig = (params:object) => {
  return axios.get('/config/get', params)
}