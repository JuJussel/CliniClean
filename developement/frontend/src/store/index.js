import createPersistedState from 'vuex-persistedstate'
import { createStore } from 'vuex'

export const store = createStore({
  plugins: [createPersistedState()],

  state () {
    return {
      user: null
    }
  },

  getters: {
      user: state => state.user
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
    }
  }
})