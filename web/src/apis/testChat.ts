import axios from '@/utils/http/index';

// 获取测评结果
export const getEvaluation = (params:object) => {
  return axios.get('/evaluation/get', params)
}

// 测评
export const evaluation = (params:object) => {
  return axios.post('/evaluation', params)
}