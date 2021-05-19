import createPersistedState from 'vuex-persistedstate'
import { createStore } from 'vuex'

export const store = createStore({
  plugins: [createPersistedState()],

  state () {
    return {
      user: null,
      activeView: 'home'
    }
  },

  getters: {
      user: state => state.user,
      userFullName: state => state.user?.nameLast + state.user?.nameFirst,
      activeView: state => state.activeView
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_ACTIVE_VIEW(state, view) {
      state.activeView = view
    }
  },
  actions: {

  }
})