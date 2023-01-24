import Http from './http.service';
import dayjs from 'dayjs';

export default {
    install: (app, options) => {
        const http = Http
        app.config.globalProperties.$dataService = function () {
            const instance = this
            const helper = {
                //-------------------------//
                //----------Get------------//
                //-------------------------//
                get: {
                    //>----Authentication-----//
                    auth: function () {
                        return new Promise(function (resolve, reject) {
                            http.get("auth/check")
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch((result) => {
                                    instance.$cui.notification({
                                        text: result,
                                        color: "danger",
                                    });
                                    reject;
                                });
                        });
                    },
                    //>----User-----//
                    users: {
                        all: function () {
                            return new Promise(function (resolve, reject) {
                                http.get("users")
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        favourites: function (userId) {
                            return new Promise(function (resolve, reject) {
                                http.get("users/" + userId + "/favourites")
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                    },
                    //>----Doctors-----//
                    doctors: {
                        all: function () {
                            return new Promise(function (resolve, reject) {
                                http.get("doctors")
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                    },
                    //>----Patients-----//
                    patient: {
                        //>>---Search-----//
                        search: function (data) {
                            return new Promise(function (resolve, reject) {
                                http.get("patients/search", data)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        //>>---Details-----//
                        details: function (id) {
                            return new Promise(function (resolve, reject) {
                                http.get("patients/" + id)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        //>>---Medical History-----//
                        medicalHistory: function (id) {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .get("patients/" + id + "/medicalHistory")
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        //>>---Insurance Sets-----//
                        insuranceSets: function (id) {
                            return new Promise(function (resolve, reject) {
                                http.get("patients/" + id + "/insuranceSets")
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        //>>---Payments-----//
                        payments: function (id, date) {
                            return new Promise(function (resolve, reject) {
                                http.get("patients/" + id + "/payments/" + date)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        //>>---Encounters-----//
                        encounters: function (id) {
                            return new Promise(function (resolve, reject) {
                                http.get("patients/" + id + "/encounters")
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        orders: function (id) {
                            return new Promise(function (resolve, reject) {
                                http.get("patients/" + id + "/orders")
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });

                        },
                    },
                    //>----Encounters-----//
                    encounters: {
                        today: function () {
                            const data = {
                                start: dayjs()
                                    .startOf("day"),
                                end: dayjs()
                                    .endOf("day")
                            };
                            return new Promise(function (resolve, reject) {
                                http.get("encounters/range", data)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        range: function (range) {
                            return new Promise(function (resolve, reject) {
                                http.get("encounters/range", range)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        findOne: function (id) {
                            return new Promise(function (resolve, reject) {
                                http.get("encounters/" + id)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        }
                    },
                    //>----Lists-----//
                    lists: {
                        //>----Health Check Examinations-----//
                        healthCheckExams: function () {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .get("lists/healthCheckExams/")
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        //>----Static Lists-----//
                        static: function () {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .get("lists/static")
                                    .then((result) => {
                                        instance.$store.commit(
                                            "SET_STATIC_LISTS",
                                            result
                                        );
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },

                        //>----Encounter Types-----//
                        encounterTypes: function () {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .get("lists/encounterTypes")
                                    .then((result) => {
                                        instance.$store.commit(
                                            "SET_STATIC_LISTS",
                                            { encounterTypes: result }
                                        );
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        //>----Insurance Providers-----//
                        insuranceProviders: function (number) {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .get("lists/insuranceProviders/" + number)
                                    .then((result) => {
                                        instance.$store.commit(
                                            "SET_STATIC_LISTS",
                                            { occupations: result }
                                        );
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        //>----Addresses-----//
                        addresses: function (zip) {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .get("lists/addresses/" + zip)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        //>----Schemas-----//
                        schemas: function () {
                            return new Promise(function (resolve, reject) {
                                http.get("lists/schemas/")
                                    .then((result) => {
                                        let schemaList = result.map(
                                            (schema) => {
                                                let filename = schema;
                                                return (schema = {
                                                    name: filename.split(
                                                        "."
                                                    )[0],
                                                    url:
                                                        options.schemaUrl +
                                                        filename,
                                                });
                                            }
                                        );
                                        resolve(schemaList);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        //>----Diseases-----//
                        diseases: function (data) {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .get("lists/diseases/" + data)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },

                    },
                    medications: {
                        search: function (cat, search) {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .get("medications/" + cat + "/" + search)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                    },
                    procedures: {
                        //>----Procedure Categories Types-----//
                        categories: function () {
                            if (instance.$store.getters.staticLists.procedureCategories) {
                                return instance.$store.getters.staticLists
                                    .procedureCategories;
                            } else {
                                return new Promise(function (resolve, reject) {
                                    return http
                                        .get("procedures/categories/")
                                        .then((result) => {
                                            instance.$store.commit(
                                                "SET_STATIC_LISTS",
                                                { procedureCategories: result }
                                            );
                                            resolve(result);
                                        })
                                        .catch((result) => {
                                            instance.$cui.notification({
                                                text: result,
                                                color: "danger",
                                            });
                                            reject;
                                        });
                                });
                            }
                        },
                        favourites: function (cat) {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .get("procedures/" + cat + "/favourites")
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        search: function (cat, search) {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .get(
                                        "procedures/" +
                                        cat +
                                        "/search/" +
                                        search
                                    )
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                        examresults: function (procedure) {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .get(
                                        "procedures/" +
                                        procedure +
                                        "/examresults"
                                    )
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                    },
                    // settings: {
                    //     public: function () {


                    //         return new Promise(function (
                    //             resolve,
                    //             reject
                    //         ) {
                    //             http.get("settings/public")
                    //                 .then((result) => {
                    //                     instance.$store.commit(
                    //                         "SET_SETTINGS",
                    //                         result
                    //                     );
                    //                     resolve(result);
                    //                 })
                    //                 .catch((result) => {
                    //                     instance.$cui.notification(
                    //                         {
                    //                             text: result,
                    //                             color:
                    //                                 "danger",
                    //                         }
                    //                     );
                    //                     reject;
                    //                 });
                    //         });

                    //     }
                    // },
                    orders: function () {
                        return new Promise(function (resolve, reject) {
                            http.get("orders")
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch((result) => {
                                    instance.$cui.notification({
                                        text: result,
                                        color: "danger",
                                    });
                                    reject;
                                });
                        });

                    },
                    //>----Notifications-----//
                    notifications: function () {
                        return new Promise(function (resolve, reject) {
                            http.get("notifications")
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch((result) => {
                                    instance.$cui.notification({
                                        text: result,
                                        color: "danger",
                                    });
                                    reject;
                                });
                        });
                    },
                    //>----Files-----//
                    files: function (data) {
                        return new Promise(function (resolve, reject) {
                            http.post("files", data)
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch((result) => {
                                    instance.$cui.notification({
                                        text: result,
                                        color: "danger",
                                    });
                                    reject;
                                });
                        });
                    }

                },
                //-------------------------//
                //----------Post-----------//
                //-------------------------//
                post: {
                    //>----Authentication-----//
                    auth: function (data) {
                        return new Promise(function (resolve, reject) {
                            return http
                                .post("auth/login", data)
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch(() => {
                                    instance.$cui.notification({
                                        text:
                                            "ユーザー名又はパスワードが違います。ご確認してください。",
                                        color: "danger",
                                    });
                                    reject();
                                });
                        });
                    },
                    //>----Encounters-----//
                    encounters: function (data) {
                        return new Promise(function (resolve, reject) {
                            return http
                                .post("encounters", data)
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch((result) => {
                                    instance.$cui.notification({
                                        text: result,
                                        color: "danger",
                                    });
                                    reject();
                                });
                        });
                    },
                    //>----Patients-----//
                    patients: function (data) {
                        return new Promise(function (resolve, reject) {
                            return http
                                .post("patients", data)
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch((result) => {
                                    instance.$cui.notification({
                                        text: result,
                                        color: "danger",
                                    });
                                    reject;
                                });
                        });
                    },
                    //>----Insurance-----//
                    insurance: function (data) {
                        return new Promise(function (resolve, reject) {
                            return http
                                .post("patients/" + data[0].patient.id + "/insurance", data)
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch((result) => {
                                    console.log(result);
                                    instance.$cui.notification({
                                        text: result,
                                        color: "danger",
                                    });
                                    reject(result);
                                });
                        });
                    },

                    //>----Uploads-----//
                    uploads: {
                        single: function (data) {
                            return new Promise(function (resolve, reject) {
                                http.post("uploads/single", data)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                    },
                    //>----Orders-----//
                    orders: function (data) {
                        return new Promise(function (resolve, reject) {
                            return http
                                .post("orders", data)
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch((result) => {
                                    instance.$cui.notification({
                                        text: result,
                                        color: "danger",
                                    });
                                    reject;
                                });
                        });
                    },
                    medical: {
                        vitals: function (data) {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .post("patients/" + data.patientId + "/medical/vitals", data)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject(result);
                                    });
                            });
                        },
                        diseases: function (data) {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .post("patients/" + data.patientId + "/medical/diseases", data)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject(result);
                                    });
                            });
                        }
                    }
                },
                //-------------------------//
                //----------Put-----------//
                //-------------------------//
                put: {
                    patients: function (data) {
                        return new Promise(function (resolve, reject) {
                            return http
                                .put("patients/" + data.id, data)
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch((result) => {
                                    instance.$cui.notification({
                                        text: result,
                                        color: "danger",
                                    });
                                    reject(result);
                                });
                        });
                    },
                    medical: {
                        basics: function (data) {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .put("patients/" + data.patientId + "/medical/basics", data.data)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject(result);
                                    });
                            });
                        }
                    },
                    encounters: function (encounter) {
                        return new Promise(function (resolve, reject) {
                            return http
                                .put("encounters/" + encounter.id, encounter)
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch((result) => {
                                    instance.$cui.notification({
                                        text: result,
                                        color: "danger",
                                    });
                                    reject(result);
                                });
                        });
                    },
                    user: {
                        favourites: function (userId, item) {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .put(
                                        "users/" + userId + "/favourites",
                                        item
                                    )
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject(result);
                                    });
                            });
                        },
                        updateUser: function (data) {
                            return new Promise(function (resolve, reject) {
                                return http
                                    .put(
                                        "users/" + data.id,
                                        data
                                    )
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject(result);
                                    });
                            });
                        }
                    },
                    orders: function (order) {
                        return new Promise(function (resolve, reject) {
                            return http
                                .put("orders/" + order._id, order)
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch((result) => {
                                    instance.$cui.notification({
                                        text: result,
                                        color: "danger",
                                    });
                                    reject(result);
                                });
                        });
                    },
                    notifications: function (data) {
                        return new Promise(function (resolve, reject) {
                            return http
                                .put("notifications/" + data, { read: true })
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch((result) => {
                                    instance.$cui.notification({
                                        text: result,
                                        color: "danger",
                                    });
                                    reject(result);
                                });
                        });
                    },
                    //>----Uploads-----//
                    uploads: {
                        single: function (data) {
                            return new Promise(function (resolve, reject) {
                                http.put("uploads/single", data)
                                    .then((result) => {
                                        resolve(result);
                                    })
                                    .catch((result) => {
                                        instance.$cui.notification({
                                            text: result,
                                            color: "danger",
                                        });
                                        reject;
                                    });
                            });
                        },
                    }
                },
                //-------------------------//
                //----------Delete---------//
                //-------------------------//
                delete: {
                    orders: function (orderId) {
                        return new Promise(function (resolve, reject) {
                            return http
                                .delete("orders/" + orderId)
                                .then((result) => {
                                    resolve(result);
                                })
                                .catch((result) => {
                                    instance.$cui.notification({
                                        text: result,
                                        color: "danger",
                                    });
                                    reject(result);
                                });
                        });
                    },
                },
            };

            return helper

        }
    }
}