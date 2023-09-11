import GenId from 'cherry-id';

export const loStore = {
    set: (name, val) => {
        const str = typeof val === 'object' ? JSON.stringify(val) : String(val)
        window.localStorage.setItem(name, str)
    },
    get: (name) => {
        return window.localStorage.getItem(name)
    },
    remove: (name) => {
        window.localStorage.removeItem(name)
    },
    clear: () => {
        window.localStorage.clear()
    }
}

export const genId = (name = 'userId', workerId = 1, seqBitLength = 14) => {
    let generatedId = null;
    let resultId = loStore.get(name);

    if (!resultId) {
        generatedId = new GenId({ WorkerId: workerId, SeqBitLength: seqBitLength })
        resultId = generatedId.NextId().toString();
        loStore.set(name, resultId);
    }

    return resultId;
}

export const getZodiacSign = (date = new Date()) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
        return '水瓶座';
    } else if ((month === 2 && day >= 20) || (month === 3 && day <= 20)) {
        return '双鱼座';
    } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
        return '白羊座';
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
        return '金牛座';
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) {
        return '双子座';
    } else if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) {
        return '巨蟹座';
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
        return '狮子座';
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
        return '处女座';
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) {
        return '天秤座';
    } else if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) {
        return '天蝎座';
    } else if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) {
        return '射手座';
    } else {
        return '摩羯座';
    }
}

export const handleHtmlFontSize = (maxWidth = 1366) => {
    const debounce = (fn, timeout) => {
        let timer = null
        return () => {
            clearTimeout(timer)
            timer = setTimeout(fn, timeout);
        }
    }

    const deviceHandle = () => {
        const sUserAgent = navigator.userAgent.toLowerCase()
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
        const html = document.documentElement
        const {
            innerWidth
        } = window

        const type = deviceHandle()

        if (type === 'md') {
            html.style.fontSize = `calc(100vw / 37.5)`
            // html.style.fontSize = `calc(100vw / ${innerWidth / 10})`
            return
        }

        if (innerWidth <= maxWidth) {
            html.style.fontSize = '10px'
            return
        }

        html.style.fontSize = '0.6vw'
    }

    handleResize()

    window.addEventListener('resize', debounce(handleResize, 600), false)
}