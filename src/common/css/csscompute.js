//获取dom元素的宽度
export function getEleWidth(el) {
    let width = window.getComputedStyle(
        el
    ).width
    width = Number(width.substring(0, width.indexOf('px')))
    return width
}

//获取dom元素的高度,el是dom元素
export function getEleHeight(el) {
    let height = window.getComputedStyle(
        el
    ).height
    height = Number(height.substring(0, height.indexOf('px')))
    return height
}