import { post } from 'network/request';



//处理数据后在返回
export function getAqggDetail(data) {
    return new Promise((resolve, reject) => {
        post('/aqbg/aqbg/ajaxDatagrId', data).then(data => {
            //在这里处理数据，
            //let data = data
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}