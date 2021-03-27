import store from '../store'

var checkAcl = function(target, req) {

    if (store.getters.userInfo.user_group === 99) {
        return true
    }

    if (!target || !req) {
        return false
    }

    if (target === 'open') {
        return true
    }

    if (typeof target === 'string') {
        target = [target]
    }


    if(target.filter(t => store.getters.permissions.hasOwnProperty(t)) < 1) {
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