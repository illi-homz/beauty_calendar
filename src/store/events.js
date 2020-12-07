import eventsApi from '../API/events'

export default {
  state: {
    events: []
  },
  mutations: {
    SET_EVENTS(state, events) {
      state.events = [...events]
    }
  },
  actions: {
    async ADD_EVENT({commit, dispatch}, event) {
      const id = await eventsApi.addEvent({...event})
      await dispatch('GET_EVENTS')
      return id
    },
    async GET_EVENT({commit}, id) {
      return await eventsApi.getEvent(id)
    },
    async GET_EVENTS({commit}) {
      const events = await eventsApi.getEvents().then(data => data)
      commit('SET_EVENTS', events)
      return events
    },
    async UPDATE_EVENT({commit, dispatch}, {id, changes}) {
      return await eventsApi.updateEvent(id, changes)
    },
    DEL_EVENT({commit}, id) {
      eventsApi.delEvent(id)
    },
    async REMOVE_ALL_EVENTS({commit}) {
      await eventsApi.removeAllEvents()
      await dispatch('GET_EVENTS')
    },
    async GET_EVENTS_BY_CLIENT_ID({commit}, id) {
      return await eventsApi.getEventsByClientId(id).then(data => data)
    },
    async DEL_EVENTS_BY_CLIENT_ID({commit}, id) {
      await eventsApi.delEventsByClientId(id).then(data => data)
    },
    async GET_EVENTS_BY_DATE({commit}, days) {
      return await eventsApi.getEventsByDate(days).then(data => data)
    }
  },
  getters: {
    EVENTS: state => state.events
  }
}
