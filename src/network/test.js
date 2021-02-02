import { put } from 'network/request'
export function getCorps() {
    let data = {
        action: 'list_corps',
        user_id: '1',
        page_size: 100,
        page_num: 1
    }

    put('/api/corps', data).then(res => {
        console.log(res);
    })

}