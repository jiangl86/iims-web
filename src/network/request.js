import axios from 'axios';
import { urls } from './url'
import { Loading } from 'element-ui';
import AnMsgbox from '../components/common/popup/AnMsgbox'
import router from '../router';


const instance1 = axios.create({
    baseURL: urls.baseUrl,
    timeout: 5000,
    headers: { 'authorization': localStorage.getItem('token') }
})
let loadingInstance = null

//拦截器，发送之前
instance1.interceptors.request.use(url => {
    url.headers.authorization = localStorage.getItem('token'); //变更为最新的token
    loadingInstance = Loading.service({ text: '正在努力加载中' }); //加载数据，如果部分页面请求不需要加载，在此做判断
    return url;
}, err => {
    console.log(err);
})

//响应拦截
instance1.interceptors.response.use(res => {
    loadingInstance.close(); //取消loading加载
    let data = res.data
        //如果没有登录或者登录超时，直接跳转至登录页面
    if (data.ret == 2) {
        localStorage.removeItem('user_id')
        localStorage.removeItem('token')
        router.replace({ name: 'Login' })
        AnMsgbox.msgbox({ message: '未登录或登录超时' })
    } else {
        return data;
    }

}, err => {
    loadingInstance.close();
    console.log(err);
})


export function get(url, params) {
    return instance1.get(url, { params: params });
}

export function post(url, data) {
    return instance1.post(url, data);
}

export function put(url, data) {
    return instance1.put(url, data);
}

export function login(username, password) {
    return axios({
        baseURL: urls.baseUrl,
        timeout: 5000,
        method: 'post',
        url: '/api/user',
        data: {
            action: 'login',
            username: username
        },
        headers: { 'authorization': password }
    });
}