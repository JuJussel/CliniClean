import Http from './http.service'
import moment from 'moment'

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
                    //>----Doctors-----//
                    doctors: {
                        all: function() {
                            return new Promise(function (resolve, reject) {
                                http.get('doctors')
                                .then(result => {
                                    resolve(result)
                                })
                                .catch(result => {
                                    instance.$cui.notification({ text: result, color: 'danger' })
                                    reject
                                })
                            })
                        }
                    },
                    //>----Patients-----//
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
                                http.get('patients/' + id + '/details')
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
                    //>----Encounters-----//
                    encounters: {
                        today: function() {
                            const data = {
                                start: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                                end: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
                            }
                            return new Promise (function(resolve, reject) {
                                http.get('encounters/range', data)
                                .then(result => {
                                    resolve(result)
                                })
                                .catch(result => {
                                    instance.$cui.notification({ text: result, color: 'danger' })
                                    reject
                                })
                            })
                        },
                        range: function(range) {
                            return new Promise (function(resolve, reject) {
                                http.get('encounters/range', range)
                                .then(result => {
                                    resolve(result)
                                })
                                .catch(result => {
                                    instance.$cui.notification({ text: result, color: 'danger' })
                                    reject
                                })
                            })
                        }
                    },
                    //>----Lists-----//
                    lists: {
                        //>----Encounter Types-----//
                        encounterTypes: function() {
                            if (instance.$store.getters.encounterTypes) {
                                console.log(instance.$store.getters.encounterTypes);
                                return instance.$store.getters.encounterTypes
                            } else {
                                return new Promise (function(resolve, reject) {
                                    return http.get('lists/encounterTypes')
                                    .then(result => {
                                        instance.$store.commit('SET_ENCOUNTER_TYPES', result)
                                        resolve(result)
                                    })
                                    .catch(result => {
                                        instance.$cui.notification({ text: result, color: 'danger' })
                                        reject
                                    })
                                })
                            }
                        },

                    }
                }
            }


            return helper

        }
    }
}