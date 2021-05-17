import Http from './http.service'

const http = Http

const auth = {
    check: function() {
        return http.get('auth/check', null, null)
    }
}

// const isAuthenticated = function() {

//     const user = store.getters.user
//     const token = window.localStorage.getItem('accessToken')

//     if(user && token) {
//         console.log('checking...');
//         Api.api.auth.get({token: token, userId: user.id})
//         .then(() => {
//             console.log('ISOK');
//             return true
//         })
//         .catch(() => {
//             return false
//         })
//     } else {
//         return false
//     }

//   }

  export default {
    install: (app) => {
        app.config.globalProperties.$auth = auth
    }

  }