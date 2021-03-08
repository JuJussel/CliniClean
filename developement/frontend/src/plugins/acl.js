import store from '../store'

var checkAcl = function(elm) {
    if(!elm) {
        return true
    }
    if (store.getters.permissions.includes(elm)) {
        return true
    } else {
        return false
    }
}

export default {
    
    install(Vue) {
        (Vue.prototype.$acl = function(elm) {
            let store = Vue.store
            return checkAcl(elm)
        })
    }

}