
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'
import qs from 'qs';
import {isPlainObject} from 'lodash-es'
import { useStorage } from '@vueuse/core'
import { useLoginStore } from "../../store/index.js";
import messageBox from '../../components/MessageBox/index.ts';

// 定义请求响应参数，不含data
interface Result {
  code: number
  msg: string
}

// 请求响应参数，包含data
interface ResultData<T> {
  data?: T;
  list?: Array<T>;
  token?: string;
  user?: string | number;
  [key: string]: unknown;
}
const URL: string = import.meta.env.VITE_API_BASE_URL
enum RequestEnums {
  TIMEOUT = 200000,
  OVERDUE = 'logout', // 登录失效
  FAIL = 999, // 请求失败
  SUCCESS = 200 // 请求成功
}
const config = {
  // 默认地址
  baseURL: URL as string,
  // 设置超时时间
  timeout: RequestEnums.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true
}

class RequestHttp {
  // 定义成员变量并指定类型
  service: AxiosInstance
  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config)
    axios.defaults.headers.common['Accept'] = 'application/json';

    /**
     * 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
     */
    let defaults = {};
    this.service.interceptors.request.use(
      (config:any) => {
        const auth = window.localStorage.getItem('auth') || ''
        const token = window.localStorage.getItem('token') || ''
        // get请求data转换
        if (config.method === 'get' && config.data && isPlainObject(config.data)) {
          config.data = qs.stringify(config.data)
        }

        if(config.url === '/upload'){
          config.headers['Content-Type'] = 'multipart/form-data';
          return {
            ...config,
            headers: {
              'X-Token': auth || '',
              'Authorization': token, // 请求头中携带token信息
              'Content-Type': 'multipart/form-data',
            }
          }
        }
        return {
          ...config,
          headers: {
            'X-Token': auth || '',
            'Authorization': token, // 请求头中携带token信息
            'Content-Type': 'application/json',
          }
        }
      },
      (error: AxiosError) => {
        // 请求报错
        Promise.reject(error)
      }
    )
    /**
     * 响应拦截器
     * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */

    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, config } = response // 解构
        if (data.code === RequestEnums.OVERDUE) {
          // 登录信息失效，应跳转到登录页面，并清空本地的token
          //localStorage.setItem('token', '') // router.replace({ //   path: '/login' // })
          const loginStore = useLoginStore();

          loginStore.token = useStorage('token', '')
          return Promise.reject(data)
        } // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
        if (data.code && data.code !== RequestEnums.SUCCESS) {
          //return Promise.reject(data)
          messageBox.error(data.msg as string)
          return data
        }
        return data
      },
      (error: AxiosError) => {
        const { response } = error
        
        if (response && response.data) {
          messageBox.error(response.data as string)
          return Promise.reject(response.data)
        }

        if (!window.navigator.onLine) {
          messageBox.error('请检查您的网络~')
        }
      }
    )
  }
  handleCode(code: number): void {
    switch (code) {
      case 401:
        //ElmessageBox.error('登录失败，请重新登录')
        break
      default:
        //ElmessageBox.error('请求失败')
        break
    }
  }

  // 常用方法封装
  get<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.get(url, { params })
  }
  post<T>(url: string, params?: object, config?: AxiosRequestConfig): Promise<ResultData<T>> {
    return this.service.post(url, params, config)
  }
  put<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.put(url, params)
  }
  delete<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.delete(url, { params })
  }
}

// 导出一个实例对象
export default new RequestHttp(config)
