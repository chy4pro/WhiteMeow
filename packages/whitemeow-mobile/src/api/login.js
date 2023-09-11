import { usePromise } from "@/utils/usePromise";

export const fetchPicCode = (data = {}) => usePromise({
    url: '/login/get-captcha',
    data,
    type: 'get'
})

export const fetchCode = (data = {}) => usePromise({
    url: '/login/send-sms',
    data,
})

export const fetchCodeLogin = (data = {}) => usePromise({
    url: '/login/login-by-code',
    data,
})

export const fetchUserInfo = (data = {}) => usePromise({
    url: '/login/get-user',
    data,
    type: 'get'
})

export const fetchCheckCode = (data = {}) => usePromise({
    url: '/login/check-code',
    data,
    type: 'get'
})

export const fetchUpdatePsd = (data = {}) => usePromise({
    url: '/login/update-password',
    data,
})

export const fetchSetInfo = (data = {}) => usePromise({
    url: '/login/update-login',
    data,
})

export const fetchPsdLogin = (data = {}) => usePromise({
    url: '/login',
    data,
})