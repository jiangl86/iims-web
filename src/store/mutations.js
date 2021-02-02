import store from "."

export default {
    //更改当前用户id
    changeUserId(state, userId) {
        state.userId = userId
    },
    //更改当前token
    changeToken(state, token) {
        state.token = token
    },
    //清空token，退出时
    clearToken(state) {
        state.token = ''
    },
    clearUser(state) {
        state.userId = 0
    }


}