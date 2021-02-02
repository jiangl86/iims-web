import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
    loadingState: false,
    userId: 0,
    token: '',

}

export default new Vuex.Store({
    state,
    mutations,
    actions: {},
    modules: {}
})