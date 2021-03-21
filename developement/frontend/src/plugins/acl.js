import store from '../store'

var checkAcl = function(target, req) {

    if(!target && !req && !store.getters.permissions[target]) {
        return false
    }

    let userPerm = store.getters.permissions[target]

    if (req > userPerm) {
        return false
    }

    return true
}

export default {
    
    install(Vue) {
        (Vue.prototype.$acl = function(target, req) {
            return checkAcl(target, req)
        })
    }

}