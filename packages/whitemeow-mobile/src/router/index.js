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
            name: 'home',
            component: () => import('@/views/home/index.vue')
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('@/views/dashboard/index.vue'),
            children: [
                {
                    path: '',
                    name: 'test',
                    component: () => import('@/views/dashboard/test/index.vue')
                },
                {
                    path: '/dashboard/chat',
                    name: 'chat',
                    component: () => import('@/views/dashboard/chat/index.vue')
                },
                {
                    path: '/dashboard/adventure',
                    name: 'adventure',
                    component: () => import('@/views/dashboard/adventure/index.vue')
                },
                {
                    path: '/dashboard/my',
                    name: 'my',
                    component: () => import('@/views/dashboard/my/index.vue')
                },
                {
                    path: '/dashboard/showCard',
                    name: 'showCard',
                    component: () => import('@/views/dashboard/test/card/showCard.vue')
                },
                {
                    path: '/dashboard/dream',
                    name: 'dreamIndex',
                    component: () => import('@/views/dashboard/test/dream/index.vue')
                },
                {
                    path: '/dashboard/sand',
                    name: 'sandIndex',
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
                    component: () => import('@/views/login/index/index.vue')
                },
                {
                    path: '/login/setPsd',
                    name: 'setPsd',
                    component: () => import('@/views/login/setPsd/index.vue')
                },
                {
                    path: '/login/setProfile',
                    name: 'setProfile',
                    component: () => import('@/views/login/setProfile/index.vue')
                },
                {
                    path: '/login/forget',
                    name: 'forget',
                    component: () => import('@/views/login/forget/index.vue')
                }
            ]
        },
        {
            path: '/:pathMatch(.*)',
            name: 'Error',
            component: () => import('@/views/error/index.vue')
        }
    ]
})

router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0)

    // return next()

    const store = useIndexStore()

    if (to.path.indexOf('/login') > -1) {
        if (store.state.token) {
            return next({
                path: '/dashboard'
            })
        }

        if (!store.state.user && to.path === '/login') {
            return next()
        }

        return next()
    }

    if (!store.state.token) {
        if (to.path === '/') {
            return next()
        }

        if (to.path === '/login') {
            return next()
        }

        return next({
            path: '/login'
        })
    }

    if (to.path === '/') {
        return next({
            path: '/dashboard'
        })
    }

    next()
})

export default router