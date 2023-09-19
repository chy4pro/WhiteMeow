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

export const handleHtmlFontSize = () => {
  const debounce = (fn: any, timeout: any) => {
      let timer = null
      return () => {
          clearTimeout(timer)
          timer = setTimeout(fn, timeout);
      }
  }

  const deviceHandle = () => {
      const sUserAgent:any = navigator.userAgent.toLowerCase()
      const bIsIpad = sUserAgent.match(/ipad/i) == 'ipad'
      const bIsIphoneOs = sUserAgent.match(/iphone os/i) == 'iphone os'
      const bIsMidp = sUserAgent.match(/midp/i) == 'midp'
      const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4'
      const bIsUc = sUserAgent.match(/ucweb/i) == 'ucweb'
      const bIsAndroid = sUserAgent.match(/android/i) == 'android'
      const bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce'
      const bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile'
      if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
          return 'md'
      }
      return 'pc'
  }

  const handleResize = () => {
      const { origin, hash } = window.location

      const type = deviceHandle()

      if (type === 'md') {
          window.location.href = `${origin}/h5/${hash}`
          return
      }

      window.location.href = `${origin}/${hash}`
  }

  handleResize()

  window.addEventListener('resize', debounce(handleResize, 600), false)
}