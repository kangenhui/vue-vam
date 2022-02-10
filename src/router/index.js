import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router);

export const constantRoutes = [
    {
        name: 'photograph',
        path: '/photograph',
        component: () => import('@/photograph')
    },
]

const router=new Router({
    routes: constantRoutes
});

export default router