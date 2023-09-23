import {
    createRouter,
    createWebHashHistory
} from 'vue-router';

import { useIndexStore } from "@/store/index";

const router = createRouter({
    history: createWebHashHistory(import.meta.env.VITE_API_BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/register',
            redirect: '/login'
        },
        {
            path: '/home',
            name: 'home',
            meta: {
                title: '首页'
            },
            component: () => import('@/views/home/index.vue')
        },
        {
            path: '/chat',
            name: 'dashboard',
            component: () => import('@/views/dashboard/index.vue'),
            children: [
                {
                    path: '/chat',
                    redirect: '/chat/freeChat'
                },
                {
                    path: '/chat/freeChat',
                    name: 'chat',
                    meta: {
                        type: 'chat',
                        title: '聊愈喵'
                    },
                    component: () => import('@/views/dashboard/chat/index.vue')
                },
                {
                    path: '/chat/testChat/dailyHome',
                    name: 'test',
                    meta: {
                        type: 'test',
                        title: '测试喵'
                    },
                    component: () => import('@/views/dashboard/test/index.vue')
                },
                {
                    path: '/chat/game/createRoom',
                    name: 'createRoom',
                    meta: {
                        type: 'adventure',
                        title: '冒险喵'
                    },
                    component: () => import('@/views/dashboard/adventure/createRoom.vue')
                },
                {
                    path: '/chat/game/hasRoom',
                    name: 'hasRoom',
                    meta: {
                        type: 'adventure',
                        title: '冒险喵'
                    },
                    component: () => import('@/views/dashboard/adventure/hasRoom.vue')
                },
                {
                    path: '/chat/game/waitingRoom',
                    name: 'waitingRoom',
                    meta: {
                        type: 'adventure',
                        title: '冒险喵'
                    },
                    component: () => import('@/views/dashboard/adventure/waitingRoom.vue')
                },
                {
                    path: '/chat/game/textAdventure',
                    name: 'textAdventure',
                    meta: {
                        type: 'adventure',
                        title: '冒险喵'
                    },
                    component: () => import('@/views/dashboard/adventure/index.vue')
                },
                {
                    path: '/chat/my',
                    name: 'my',
                    meta: {
                        type: 'my'
                    },
                    component: () => import('@/views/dashboard/my/index.vue')
                },
                {
                    path: '/chat/testChat/tarot',
                    name: 'showCard',
                    meta: {
                        type: 'test',
                        title: '每日塔罗'
                    },
                    component: () => import('@/views/dashboard/test/card/showCard.vue')
                },
                {
                    path: '/chat/testChat/interpretationDream',
                    name: 'dreamIndex',
                    meta: {
                        type: 'test',
                        title: '小喵解梦'
                    },
                    component: () => import('@/views/dashboard/test/dream/index.vue')
                },
                {
                    path: '/chat/testChat/sandPlay',
                    name: 'sandIndex',
                    meta: {
                        type: 'test',
                        title: '心理沙盘'
                    },
                    component: () => import('@/views/dashboard/test/sand/index.vue')
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login/index.vue'),
            children: [
                {
                    path: '',
                    name: 'loginIndex',
                    meta: {
                        title: '登录页'
                    },
                    component: () => import('@/views/login/index/index.vue')
                },
                {
                    path: '/login/setPsd',
                    name: 'setPsd',
                    meta: {
                        title: '设置密码'
                    },
                    component: () => import('@/views/login/setPsd/index.vue')
                },
                {
                    path: '/login/setProfile',
                    name: 'setProfile',
                    meta: {
                        title: '完善资料'
                    },
                    component: () => import('@/views/login/setProfile/index.vue')
                },
                {
                    path: '/login/forget',
                    name: 'forget',
                    meta: {
                        title: '忘记密码'
                    },
                    component: () => import('@/views/login/forget/index.vue')
                }
            ]
        },
        {
            path: '/:pathMatch(.*)',
            name: 'Error',
            meta: {
                title: '错误页'
            },
            component: () => import('@/views/error/index.vue')
        }
    ]
})

router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0)

    if (to.meta.title) {
        document.title = to.meta.title
    }

    // return next()

    const store = useIndexStore()

    if (to.path.indexOf('/login') > -1 || to.path.indexOf('/register') > -1) {
        if (store.state.token) {
            return next({
                path: '/chat/freeChat'
            })
        }

        if (!store.state.user && to.path === '/login') {
            return next()
        }

        return next()
    }

    // if (!store.state.token) {
    //     if (to.path === '/') {
    //         return next()
    //     }

    //     if (to.path === '/login') {
    //         return next()
    //     }

    //     return next({
    //         path: '/login'
    //     })
    // }

    // if (to.path === '/') {
    //     return next({
    //         path: '/chat/freeChat'
    //     })
    // }

    next()
})

export default router