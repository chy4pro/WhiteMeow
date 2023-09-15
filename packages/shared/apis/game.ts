import axios from '../utils/http/index';

interface ChatRoomReq {
  user: string,
  open_kf_id: string
}
interface ChatRoomDelReq {
  channel_id: string
}
interface ChatRoomJoinReq {
  channel_id: string,
  user: string
}
interface ChatRoomGetByIdReq {
  id: string
}

// 创建聊天室
export const chatroomAdd = (params:ChatRoomReq) => {
  return axios.post('/chatroom/add', params)
}

// 删除聊天室
export const chatroomDelete = (params:ChatRoomDelReq) => {
  return axios.post('/chatroom/delete', params)
}

// 加入聊天室
export const chatroomJoin = (params:ChatRoomJoinReq) => {
  return axios.post('/chatroom/join', params)
}

//根据id获取聊天室信息
export const chatRoomGetById = (params:ChatRoomGetByIdReq) => {
  return axios.get('/chatroom/get-by-id', params)
}