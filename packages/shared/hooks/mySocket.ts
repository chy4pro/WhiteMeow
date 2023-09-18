// mySocket.ts
import Socket from "../utils/http/websocket.js";
export function useMySocket() {
  let ws = ref<any>(null);
  let receivedCallBack = ref<any>(null);


  function initWebSocket(realUserId:string, userName:string, received:any) {
    receivedCallBack.value = received // 赋值

    // scoket连接
    ws.value = new Socket({
      url: `${import.meta.env.VITE_API_WEBSOCKET_URL}/chatroom/socket?user=${realUserId}&name=${userName}`,
      name: '',			// name
      isHeart:true,			// 是否心跳
      isReconnection:true,		// 是否断开重连
      received: receivedCallBack.value
    });
    ws.value.connect();
    
  }

  return {
    ws,
    receivedCallBack,
    initWebSocket
  }
}