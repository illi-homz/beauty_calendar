import Vue from 'vue'
import Vuex from 'vuex'
import clients from './clients'
import events from './events'
import services from './services'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    clients,
    events,
    services
  }
})
