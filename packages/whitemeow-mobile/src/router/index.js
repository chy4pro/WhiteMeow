import {
    createRouter,
    createWebHashHistory
} from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.VITE_API_BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/home/index.vue')
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
    next()
})

export default router