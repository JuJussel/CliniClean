import { getActivePinia } from "pinia"
import useApi from "@/composables/apiComposable.js"


export default {
  check: async function () {

    return await useApi.get('auth/check')

  },
  remove: async function () {

    await useApi.delete('auth/logout')
    localStorage.clear()
    sessionStorage.clear()
    getActivePinia()._s.forEach(store => store.$reset());
  }

}
