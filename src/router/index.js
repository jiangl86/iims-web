import Vue from 'vue'
import VueRouter from 'vue-router'
import store from 'store'
import xmglRoutes from './xmglRoutes'
import yhglRoutes from './yhglRoutes';
import jkglRoutes from './jkglRoutes';


Vue.use(VueRouter)


const Login = () =>
    import ('views/Login')
const Home = () =>
    import ('views/home/Index')


const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        redirect: '/home/xmgl',
        children: [
            //接口管理相关页面
            ...jkglRoutes,
            //项目管理相关页面
            ...xmglRoutes,
            //用户管理相关页面
            ...yhglRoutes,
        ],
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    //未登录直接跳转至登录页面
    // if (store.state.userId == 0 && to.path.indexOf('login') == -1) {
    //     router.push({ name: 'Login' })
    // }
    next()
})
export default router