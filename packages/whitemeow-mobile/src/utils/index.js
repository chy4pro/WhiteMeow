import GenId from 'cherry-id';

import info from "~/message/info.png";
import success from "~/message/success.png";
import error from "~/message/error.png";
import loading from "~/message/loading.png";
import warn from "~/message/warn.png";

let timer = null
export const message = obj => {
    const id = document.querySelector('#message-index')

    if (id) {
        document.body.removeChild(id)
        clearTimeout(timer)
    }

    const state = {
        info,
        success,
        error,
        loading,
        warn,
    };

    const color = {
        info: 'rgba(47, 128, 237, 1)',
        success: 'rgba(0, 176, 113, 1)',
        error: 'rgba(251, 33, 33, 1)',
        loading: 'rgba(247, 141, 44, 1)',
        warn: 'rgba(247, 141, 44, 1)',
    }

    const div = document.createElement('div')
    div.style.position = 'fixed'
    div.style.top = '50%'
    div.style.left = '50%'
    div.style.transform = 'translate(-50%, -50%)'
    div.style.fontSize = '1.4rem'
    div.style.fontWeight = '700'
    div.style.boxShadow = '0px 8px 28px 0px rgba(32, 22, 61, 0.1)'
    div.style.borderRadius = '0.6rem'
    div.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
    div.style.display = 'flex'
    div.style.alignItems = 'center'
    div.style.padding = '1.6rem 2.4rem'
    div.style.zIndex = '3'
    div.style.color = color[obj.type]
    div.id = 'message-index'

    const img = document.createElement('img')
    img.src = state[obj.type]
    img.style.width = '2.4rem'
    img.style.height = '2.4rem'
    img.style.marginRight = '0.8rem'

    const text = document.createTextNode(obj.text)

    div.appendChild(img)
    div.appendChild(text)

    document.body.appendChild(div)

    timer = setTimeout(() => {
        const id = document.querySelector('#message-index')

        if (id) {
            document.body.removeChild(id)
        }
    }, obj.timeout ? obj.timeout : 1500)
}

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