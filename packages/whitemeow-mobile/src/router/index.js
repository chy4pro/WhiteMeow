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
            component: () => import('@/views/dashboard/index.vue')
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
        // {
        //     path: '/:pathMatch(.*)',
        //     name: 'Error',
        //     component: () => import('@/views/error/index.vue')
        // }
    ]
})

router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0)

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