import Http from './http.service'

const http = Http

const auth = function () {
  const instance = this
  const helper = {
    check: function () {
      let r = http.get('auth/check')
      return r
    },
    remove: function () {

      http.delete('auth/logout')
      localStorage.clear()
      sessionStorage.clear()
      instance.$store.commit('CLEAR_STORE')
    }
  }
  return helper
}

export default {
  install: (app) => {
    app.config.globalProperties.$auth = auth
  }

}