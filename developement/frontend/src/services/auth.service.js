import Http from './http.service'

const http = Http

const auth = {
    check: function() {
      let r = http.get('auth/check', null, null)
      return r
    },
    remove: function() {
      http.delete('auth/logout', null, null)
      localStorage.clear()
    }
}

export default {
  install: (app) => {
      app.config.globalProperties.$auth = auth
  }

}