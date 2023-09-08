import { filterEmoji } from '@/utils/filter.js';

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