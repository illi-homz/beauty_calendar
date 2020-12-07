import servicesApi from '../API/services'

export default {
  state: {
    services: []
  },
  mutations: {
    SET_SERVICES(state, services) {
      state.services = [...services]
    }
  },
  actions: {
    async ADD_SERVICE({commit, dispatch}, service) {
      const id = await servicesApi.addService({...service})
      await dispatch('GET_SERVICES')
      return id
    },
    async GET_SERVICE({commit}, id) {
      return await servicesApi.getService(id)
    },
    async GET_SERVICES({commit}) {
      const services = await servicesApi.getServices().then(data => data)
      commit('SET_SERVICES', services)
      return services
    },
    async UPDATE_SERVICE({commit, dispatch}, {id, changes}) {
      return await servicesApi.updateService(id, changes)
    },
    DEL_SERVICE({commit}, id) {
      servicesApi.delService(id)
    },
    async REMOVE_ALL_SERVICES({commit}) {
      await servicesApi.removeAllServices()
      await dispatch('GET_SERVICES')
    }
  },
  getters: {
    SERVICES: state => state.services
  }
}
