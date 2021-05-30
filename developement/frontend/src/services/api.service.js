import Http from './http.service'
import moment from 'moment'

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
    doctors: {
        get: {
            all: function() {
                return http.get('doctors')
            }
        }
    },
    encounters: {
        get: {
            today: function() {
                const data = {
                    start: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                    end: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
                }
                return http.get('encounters/range', data)
            },
            range: function(data) {
                return http.get('encounters/range', data)
            }
        },
        post: function(data) {
            return http.post('encounters/', data)
        }
    },
    lists: {
        get: {
            encounterTypes: function() {
                return http.get('lists/encounterTypes')
            }
        }
    },
    patients: {
        get: {
            insuranceSets: function(id) {
                return http.get('patients/' + id + '/insuranceSets')
            },
        },
        search: function(data) {
            return http.get('patients/search', data)
        },
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