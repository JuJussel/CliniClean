import Http from './http.service'
// import moment from 'moment'

export default {
    install: (app) => {
        const http = Http
        app.config.globalProperties.$dataService = function() {
            const instance = this
            const helper = {
                //-------------------------//
                //--------Getter-----------//
                //-------------------------//
                get: {
                    //>----Patient-----//
                    patient: {
                        //>>---Search-----//
                        search: function(data) {
                            return new Promise (function(resolve, reject) {
                                http.get('patients/search', data)
                                .then(result => {
                                    resolve(result)
                                })
                                .catch(result => {
                                    instance.$cui.notification({ text: result, color: 'danger' })
                                    reject
                                })
                            })
                        },
                        //>>---Details-----//
                        details: function(id) {
                            return new Promise (function(resolve, reject) {
                                http.get('patients/' + id + 'details')
                                .then(result => {
                                    resolve(result)
                                })
                                .catch(result => {
                                    instance.$cui.notification({ text: result, color: 'danger' })
                                    reject
                                })
                            })
                        },
                        //>>---Insurance Sets-----//
                        insuranceSets: function(id) {
                            return new Promise (function(resolve, reject) {
                                http.get('patients/' + id + '/insuranceSets')
                                .then(result => {
                                    resolve(result)
                                })
                                .catch(result => {
                                    instance.$cui.notification({ text: result, color: 'danger' })
                                    reject
                                })
                            })
                        },
                    },
                    //>----Lists-----//
                    lists: {
                        //>----Encounter Types-----//
                        encounterTypes: function() {
                            return new Promise (function(resolve, reject) {
                                return http.get('lists/encounterTypes')
                                .then(result => {
                                    resolve(result)
                                })
                                .catch(result => {
                                    instance.$cui.notification({ text: result, color: 'danger' })
                                    reject
                                })
                            })
                        },

                    }
                }
            }


            return helper

        }
    }
}