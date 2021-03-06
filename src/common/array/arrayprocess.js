import Vue from 'vue'

//给数组里面的每个object元素添加新的key值，
//arr为要变更额数据
//newKeys为要添加的key,为数组
//froms为数据来源对应的key，数组
//示例，比如数组users [{id:1,name:'张三'},{id:2,name:'李四'}]要加key为userId,userName,取值分别为以前的id,name
//则调用方式为addKeysToData(users, ['userId','userName'], ['id','name']) ,
//执行完成后数据为[{id:1,name:'张三',userId:1,userName:'张三'},{id:2,name:'李四',userId:2,userName:'李四'}]

export function addKeysToData(arr, newKeys, froms) {
    if (Array.isArray(arr)) {
        arr.map((ele) => {
                for (let i = 0; i < newKeys.length; i++) {
                    Vue.set(ele, newKeys[i], ele[froms[i]])
                        // Object.defineProperty(ele, newKeys[i], {
                        //     value: ele[froms[i]],
                        //     writable: true,
                        //     enumerable: true,
                        //     configurable: true
                        // })
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

//将数组根据key值转换为有层级的树结构数组，必须有id属性
export function arrayToTree(arr, key = 'parent_id') {
    let tree = [] //最后生成的树列表
        //先对arr进行排序，按id降序排列
    arr.sort((a, b) => {
        return a.id < b.id ? 1 : -1
    })

    //循环遍历建树，直接数组为空，为防止数据错误导致死循环，暂时循环50次后退出
    let times = 0
    while (arr.length > 0 && times < 50) {
        times++
        for (let i = arr.length - 1; i >= 0; i--) {
            let ele = arr[i]
                //如果是一节节点，直接插入tree列表
            if (!ele[key]) {
                tree.push(ele)
                arr.splice(i, 1)
            }
            //如果不是，则查找上级其父节点
            else {
                let parentItem = findParent(tree, ele, key)
                    //如果找到其父节点
                if (parentItem) {
                    //如父节点已有子列表，则将当前节点插入父节点的childrenlist中
                    if (parentItem.childrenList) {
                        parentItem.childrenList.push(ele)
                    }
                    //如果还没有子列表，创建childrenList,并将元素插入其中
                    else {
                        Vue.set(parentItem, "children", 1);
                        Vue.set(parentItem, "childrenList", []);
                        parentItem.childrenList.push(ele);
                    }
                    arr.splice(i, 1)
                }
            }
        }
    }
    return tree
}

//将两个数组合并成一个数组，并根据key值转换为有层级的树结构数组，必须有id属性,两个数组分别来自不同数据源，因此ID可能有重复，第二个数组仅只能包含最末级子节点
export function twoArrayToTree(arr1, arr2, key = "parent_id") {
    //先处理第二个数据，给id加上唯一标识
    for (let i = 0; i < arr2.length; i++) {
        arr2[i].id = 'c' + arr2[i].id
    }
    let arr = []; //临时数组，合并arr1和arr2
    arr.push(...arr1);
    arr.push(...arr2);
    let tree = arrayToTree(arr); //最后生成的树列表

    //去除掉第二个数组id前的标识
    for (let i = 0; i < arr2.length; i++) {
        arr2[i].id = arr2[i].id.substring(1)
    }
    return tree;
}

//tree是一个列表，其中每个元素可能会有childrenList属性（当有子节点时）
function findParent(tree, item, key) {
    let parent = null
    for (let i = 0; i < tree.length; i++) {
        let ele = tree[i]
        if (item[key] == ele.id) {
            parent = ele
            break
        }
        if (ele.childrenList) {
            parent = findParent(ele.childrenList, item, key)
            if (parent != null) {
                return parent
            }
        }
    }
    return parent
}