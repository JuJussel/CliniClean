import { createStore } from 'vuex'

export const store = createStore({
  state () {
    return {
      user: null
    }
  },
  getters: {
      user: state => state.user
  }
})