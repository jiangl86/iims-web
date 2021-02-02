//获取dom元素的宽度
export function dateFormat(date, format = 'yyyy-MM-dd') {
    console.log(date);
    let result = format
    if (result.indexOf('yyyy') != -1) {
        result = result.replace('yyyy', date.getFullYear())
    }
    if (result.indexOf('MM') != -1) {
        let month = date.getMonth() + 1
        result = result.replace('MM', month)
    }
    if (result.indexOf('dd') != -1) {
        result = result.replace('dd', date.getDate())
    }
    if (result.indexOf("HH") != -1) {
        result = result.replace('HH', date.getHours())
    }
    if (result.indexOf("hh") != -1) {
        let hour = date.getHours()
        hour = hour >= 12 ? hour - 12 : hour
        result = result.replace('hh', hour)
    }
    if (result.indexOf('mm') != -1) {
        result = result.replace('mm', date.getMinutes())
    }
    if (result.indexOf('ss') != -1) {
        result = result.replace('ss', date.getSeconds())
    }
    return result
}