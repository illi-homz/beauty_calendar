import clientsApi from '../API/clients'

export default {
  state: {
    clients: [],
    currentClient: {},
  },
  mutations: {
    SET_CLIENTS(state, clients) {
      state.clients = [...clients]
    },
    SET_CURRENT_CLIENT(state, client) {
      state.currentClient = client
    },
    CLEAN_CURRENT_CLIENT(state) {
      state.currentClient = {}
    }
  },
  actions: {
    async ADD_CLIENT({commit, dispatch}, client) {
      await clientsApi.addClient({...client})
      await dispatch('GET_CLIENTS')
    },
    async GET_CLIENT({commit}, id) {
      return await clientsApi.getClient(id)
    },
    async GET_CLIENTS({commit}) {
      const clients = await clientsApi.getClients().then(data => data)
      commit('SET_CLIENTS', clients)
    },
    async UPDATE_CLIENT({commit}, {id, changes}) {
      return await clientsApi.updateClient(id, changes)
    },
    async DEL_CLIENT({commit, dispatch}, id) {
      await clientsApi.delClient(id)
      await dispatch('GET_CLIENTS')
    }
  },
  getters: {
    CLIENTS: state => state.clients,
    CURRENT_CLIENT: state => state.currentClient,
  }
}
