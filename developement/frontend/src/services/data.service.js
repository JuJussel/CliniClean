import Http from './http.service'
import moment from 'moment'

export default {
    install: (app) => {
        const http = Http
        app.config.globalProperties.$dataService = function() {
            const instance = this
            const helper = {
                //-------------------------//
                //----------Get------------//
                //-------------------------//
                get: {
                    //>----Authentication-----//
                    auth: function() {
                        return new Promise(function (resolve, reject) {
                            http.get('auth/check')
                            .then(result => {
                                resolve(result)
                            })
                            .catch(result => {
                                instance.$cui.notification({ text: result, color: 'danger' })
                                reject
                            })
                        })
                    },
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
                        //>----Insurance Providers-----//
                        insuranceProviders: function(number) {
                            return new Promise (function(resolve, reject) {
                                return http.get('lists/insuranceProviders/' + number)
                                .then(result => {
                                    instance.$store.commit('SET_OCCUPATIONS', result)
                                    resolve(result)
                                })
                                .catch(result => {
                                    instance.$cui.notification({ text: result, color: 'danger' })
                                    reject
                                })
                            })
                        },
                        //>----Occupations-----//
                        occupations: function() {
                            if (instance.$store.getters.occupations) {
                                return instance.$store.getters.occupations
                            } else {
                                return new Promise (function(resolve, reject) {
                                    return http.get('lists/occupations')
                                    .then(result => {
                                        instance.$store.commit('SET_OCCUPATIONS', result)
                                        resolve(result)
                                    })
                                    .catch(result => {
                                        instance.$cui.notification({ text: result, color: 'danger' })
                                        reject
                                    })
                                })
                            }
                        },
                        //>----Relations-----//
                        relations: function() {
                            if (instance.$store.getters.relations) {
                                return instance.$store.getters.relations
                            } else {
                                return new Promise (function(resolve, reject) {
                                    return http.get('lists/relations')
                                    .then(result => {
                                        instance.$store.commit('SET_RELATIONS', result)
                                        resolve(result)
                                    })
                                    .catch(result => {
                                        instance.$cui.notification({ text: result, color: 'danger' })
                                        reject
                                    })
                                })
                            }
                        },
                        //>----Addresses-----//
                        addresses: function(zip) {
                            return new Promise (function(resolve, reject) {
                                return http.get('lists/addresses/' + zip)
                                .then(result => {
                                    resolve(result)
                                })
                                .catch(result => {
                                    instance.$cui.notification({ text: result, color: 'danger' })
                                    reject
                                })
                            })
                        }
                    }
                },
                //-------------------------//
                //----------Post-----------//
                //-------------------------//
                post: {
                    //>----Authentication-----//
                    auth: function(data) {
                        return new Promise(function(resolve,reject) {
                            return http.post('auth/login', data)
                            .then(result => {
                                resolve(result)
                            })
                            .catch(() => {
                                instance.$cui.notification({ text: 'ユーザー名又はパスワードが違います。ご確認してください。', color: 'danger' })
                                reject
                            })
                        }) 
                    },
                    //>----Encounters-----//
                    encounters: function(data) {
                        return new Promise(function(resolve,reject) {
                            return http.post('encounters', data)
                            .then(result => {
                                resolve(result)
                            })
                            .catch(result => {
                                instance.$cui.notification({ text: result, color: 'danger' })
                                reject
                            })
                        }) 
                    },
                    //>----patients-----//
                    patients: function(data) {
                        return new Promise(function(resolve,reject) {
                            return http.post('patients', data)
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
                //-------------------------//
                //----------Put-----------//
                //-------------------------//
                put: {
                    patients: function(data) {
                        return new Promise(function(resolve,reject) {
                            return http.put('patients/' + data.id, data)
                            .then(result => {
                                resolve(result);
                            })
                            .catch(result => {
                                instance.$cui.notification({ text: result, color: 'danger' })
                                reject
                            })
                        })

                    }
                }

            }

            return helper

        }
    }
}