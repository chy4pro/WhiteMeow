export const filterEmoji = (value) => {
  const textMap = {
    2:  "爱你",
    3:  "抱歉",
    4:  "不开心",
    5:  "吃惊",
    6:  "愤怒:暴躁",
    7:  "鼓励",
    8:  "好奇",
    9:  "开心:哈哈",
    10: "哭泣:伤心:难过",
    11: "快乐",
    12: "困",
    13: "期待:好奇",
    14: "请求",
    15: "生气",
    16: "无聊",
    17: "拥抱:关爱",
    18: "着急",
  }
  return textMap[value]
}