//给数组里面的每个object元素添加新的key值，
//arr为要变更额数据
//newKeys为要添加的key
//froms为数据来源对应的key
//示例，比如数组users [{id:1,name:'张三'},{id:2,name:'李四'}]要加key为userId,userName,取值分别为以前的id,name
//则调用方式为addKeysToData(users, ['userId','userName'], ['id','name']) ,
//执行完成后数据为[{id:1,name:'张三',userId:1,userName:'张三'},{id:2,name:'李四',userId:2,userName:'李四'}]

export function addKeysToData(arr, newKeys, froms) {
    if (Array.isArray(arr)) {
        arr.map((ele) => {
                for (let i = 0; i < newKeys.length; i++) {
                    Object.defineProperty(ele, newKeys[i], { value: ele[froms[i]] })
                }
                return ele
            })
            // for (let i = 0; i < arr.length; i++) {
            //     for (let j = 0; j < newKeys.length; j++) {
            //         Object.defineProperty(arr[i], newKeys[j], { value: arr[i][froms[j]] })
            //     }
            // }
    }

    return arr
}

//将数组根据key值转换为有层级的树结构数组
export function arrayToTree(arr, key) {

}