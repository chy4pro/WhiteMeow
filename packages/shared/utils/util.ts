import { filterEmoji } from './filter.js';

export const scrollTo = (offsetTop: number) => {
  const parent = document.querySelector('#app')
  parent?.scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  })
};

// 引入本地图片
export const getImageUrl = (name: string) => {
  return new URL(`/src/assets/images/${name}`, import.meta.url).href;
}

// 引入本地图片
export const getEmojiUrl = (name: string) => {
  return new URL(`/src/assets/images/emoji/${filterEmoji(name)}.png`, import.meta.url).href;
}

// 检测是否为数字
export const checkIsNaN = (str: string | number) => {
  //将字符串转换为数字，并检测是否为数字
  const num = Number(str);
  if (isNaN(num)) {
    return true;
  }
}

export const test = () => {
  return '123'
};

export const getFormattedDate = (format:string = 'date') =>  {
  const formatNumber = (number: any) => {
    return number < 10 ? '0' + number : number;
  }
  const now = new Date();

  const year = now.getFullYear();
  const month = formatNumber(now.getMonth() + 1); // Month is zero-based
  const day = formatNumber(now.getDate());
  const hours = formatNumber(now.getHours());
  const minutes = formatNumber(now.getMinutes());
  const seconds = formatNumber(now.getSeconds());

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  const formattedDate= `${year}-${month}-${day}`;

  if(format === 'time'){
    return formattedDateTime;
  }
  else{
    return formattedDate;
  }
}