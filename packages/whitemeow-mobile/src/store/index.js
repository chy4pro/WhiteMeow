import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { loStore } from '@/utils/index'

export const useIndexStore = defineStore('index', () => {
    const state = reactive({
        token: loStore.get('token') ? loStore.get('token') : '',
        user: loStore.get('GlobalUser') ? loStore.get('GlobalUser') : '',
        userInfo: loStore.get('userInfo') ? JSON.parse(loStore.get('userInfo')) : '',
        newUserId: loStore.get('newUserId') ? loStore.get('newUserId') : '',
    })

    const handleSetToken = (str) => {
        state.token = str
        loStore.set('token', str)
    }

    const handleSetUser = (str) => {
        state.user = str
        loStore.set('GlobalUser', str)
    }

    const handleSetNewUser = (str) => {
        console.log(str)
        state.newUserId = str
        loStore.set('newUserId', str)
    }

    const handleSetUserInfo = (obj) => {
        state.userInfo = obj
        loStore.set('userInfo', obj)
    }

    return { state, handleSetToken, handleSetUser, handleSetUserInfo, handleSetNewUser }
})