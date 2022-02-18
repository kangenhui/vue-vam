import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router);

export const constantRoutes = [
    {
        path: '/',
        component: () => import('@/main'),
        name: 'main',
        props: true
    },
    {
        path: '/photograph',
        component: () => import('@/photograph'),
        name: 'photograph',
        props: true
    },
    {
        path: '/videoRecording',
        component: () => import('@/videoRecording'),
        name: 'videoRecording',
        props: true
    },
    {
        path: '/text',
        component: () => import('@/text'),
        name: 'text',
        props: true
    },
    {
        path: '/demo2',
        component: () => import('@/demo2'),
        name: 'demo2',
        props: true
    },
    {
        path: '/demo3',
        component: () => import('@/demo3'),
        name: 'demo3',
        props: true
    },
]

const router = new Router({
    routes: constantRoutes
});

export default router