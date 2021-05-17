import Http from './http.service'

const http = Http

const auth = {
    check: function() {
      return http.get('auth/check', null, null)
    },
    remove: function() {
      localStorage.clear()
    },
    add: function(token) {
      localStorage.setItem('accessToken', token)
    }
}

export default {
  install: (app) => {
      app.config.globalProperties.$auth = auth
  }

}