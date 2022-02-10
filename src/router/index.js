import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router);

export const constantRoutes = [
    {
        path: '/demo',
        component: () => import('@/demo')
    },
]

const router=new Router({
    routes: constantRoutes
});

export default router