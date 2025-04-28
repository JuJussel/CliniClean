import Http from './http.service'
import { getActivePinia } from "pinia"

const http = Http

const auth = function () {
  const helper = {
    check: function () {
      let r = http.get('auth/check')
      return r
    },
    remove: function () {

      http.delete('auth/logout')
      localStorage.clear()
      sessionStorage.clear()
      getActivePinia()._s.forEach(store => store.$reset());
    }
  }
  return helper
}

export default {
  install: (app) => {
    app.config.globalProperties.$auth = auth
  }

}