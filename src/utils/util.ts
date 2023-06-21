// 引入本地图片
export const getImageUrl = (url: string) => {
  return new URL(url, import.meta.url).href;
};

export const scrollTo = (offsetTop: number) => {
  const parent = document.querySelector('#app')
  parent?.scrollTo({
    top: offsetTop,
    behavior: 'smooth'
  })
};