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