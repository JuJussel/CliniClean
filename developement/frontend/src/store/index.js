import createPersistedState from 'vuex-persistedstate'
import { createStore } from 'vuex'

export const store = createStore({
  plugins: [createPersistedState()],

  state () {
    return {
      user: null,
      activeView: 'home',
      staticLists: [],
      transferData: {
        reception: null,
        patientList: null
      }
    }
  },

  getters: {
      user: state => state.user,
      userFullName: state => state.user?.nameLast + state.user?.nameFirst,
      activeView: state => state.activeView,
      encounterTypes: state => state.staticLists.encounterTypes,
      occupations: state => state.staticLists.occupations,
      relations: state => state.staticLists.relations,
      transferData: state => state.transferData
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_ACTIVE_VIEW(state, view) {
      state.activeView = view
    },
    SET_ENCOUNTER_TYPES(state, data) {
      state.staticLists.encounterTypes = data
    },
    SET_OCCUPATIONS(state, data) {
      state.staticLists.occupations = data
    },
    SET_RELATIONS(state, data) {
      state.staticLists.relations = data
    },
    SET_TRANSFER_DATA(state, data) {
      state[data.target] = data.data
    }
  },
  actions: {

  }
})