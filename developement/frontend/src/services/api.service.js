import Http from './http.service'

const http = Http

//function(route, data, abortSignal = null)
const  api = {
    auth: {
        login: function(data = {}, abortSignal = null) {
            return http.post('auth/login', data, abortSignal)
        },
        get: function(data = {}) {
            console.log('check');
            return http.get('auth/check', data)
        }
    },
    user: {
        get: null,
        post: null,
        update: null
    },
    patient: {
        get: null,
        details: {
            get: null,
            post: null,
            put: null
        },
        medical: {
            get: null,
            post: null,
            put: null
        }

    }
}

export default {
    api,
    install: (app) => {
        app.config.globalProperties.$api = api
    }
}