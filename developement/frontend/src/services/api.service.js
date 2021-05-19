import Http from './http.service'

const http = Http

//function(route, data, abortSignal = null)
const  api = {
    auth: {
        login: function(data = {}) {
            return http.post('auth/login', data)
        },
        get: function() {
            return http.get('auth/check')
        }
    },
    user: {
        get: null,
        post: null,
        update: null
    },
    encounters: {
        get: function(data=null) {
            return http.get('encounters', data)
        }
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