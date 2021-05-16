import Http from './http'

const http = Http

//function(route, data, abortSignal = null)
const  api = {
    auth: {
        get: null,
        post: function(data = {}, abortSignal = null) {
            return http.post('Sessions', data, abortSignal)
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
    install: (app) => {
        app.config.globalProperties.$api = api
    }
}