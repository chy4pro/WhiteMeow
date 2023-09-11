import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { loStore } from '@/utils/index'

export const useIndexStore = defineStore('index', () => {
    const state = reactive({
        token: loStore.get('GlobalToken') ? loStore.get('GlobalToken') : '',
        user: loStore.get('GlobalUser') ? loStore.get('GlobalUser') : '',
        userInfo: loStore.get('GlobalUserInfo') ? JSON.parse(loStore.get('GlobalUserInfo')) : '',
    })

    const handleSetToken = (str) => {
        state.token = str
        loStore.set('GlobalToken', str)
    }

    const handleSetUser = (str) => {
        state.user = str
        loStore.set('GlobalUser', str)
    }

    const handleSetUserInfo = (obj) => {
        state.userInfo = obj
        loStore.set('GlobalUserInfo', obj)
    }

    return { state, handleSetToken, handleSetUser, handleSetUserInfo }
})