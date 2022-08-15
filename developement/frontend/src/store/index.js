import createPersistedState from "vuex-persistedstate";
import { createStore } from "vuex";

export const store = createStore({
    plugins: [createPersistedState()],

    state() {
        return {
            user: null,
            activeView: "home",
            staticLists: {
                userGroups: [
                    { id: 1, name: "Reception" },
                    { id: 2, name: "Nurse" },
                    { id: 3, name: "Doctor" },
                    { id: 99, name: "Admin" },
                ],
                db: null,
                disease: {
                    suspectFlags: [
                        { value: "", label: "なし" },
                        { value: "S", label: "疑い" },
                        { value: "A", label: "急性" },
                        { value: "SA", label: "疑いかつ急性" },
                    ],
                    outcomeFlags: [
                        { value: "", label: "なし" },
                        { value: "F", label: "治癒" },
                        { value: "D", label: "死亡" },
                        { value: "C", label: "中止" },
                        { value: "S", label: "移行" },
                    ],
                },
            },
            layoutData: {
                reception: {
                }
            },
            transferData: {
                reception: null,
                patientList: null,
            },
            activePatient: null,
            settings: null,
            config: null,
            notifications: [],
            viewData: {}
        };
    },

    getters: {
        staticLists: (state) => state.staticLists.db,
        user: (state) => state.user,
        userFullName: (state) => state.user?.nameLast + state.user?.nameFirst,
        activeView: (state) => state.activeView,
        encounterTypes: (state) => state.staticLists.encounterTypes,
        occupations: (state) => state.staticLists.occupations || null,
        relations: (state) => state.staticLists.relations || null,
        transferData: (state) => state.transferData,
        procedureCategories: (state) =>
            state.staticLists.procedureCategories || null,
        shotLocations: (state) => state.staticLists.shotLocations || null,
        perscriptionTypes: (state) =>
            state.staticLists.perscriptionTypes || null,
        perscriptionTimings: (state) =>
            state.staticLists.perscriptionTimings || null,
        settings: (state) => state.settings,
        activePatientHistory: (state) => state.activePatient || null,
        diseaseFlags: (state) => state.staticLists.disease || null,
        notifications: (state) => state.notifications,
        userGroups: (state) => state.staticLists.userGroups,
        viewData: (state) => state.viewData,
        layoutData: (state) => state.layoutData,
    },

    mutations: {
        SET_STATIC_LISTS(state, lists) {
            state.staticLists.db = lists;
        },
        SET_SETTINGS(state, settings) {
            state.settings = settings;
        },

        SET_USER(state, user) {
            state.user = user;
        },
        SET_ACTIVE_VIEW(state, view) {
            state.activeView = view;
        },
        SET_ENCOUNTER_TYPES(state, data) {
            state.staticLists.encounterTypes = data;
        },
        SET_OCCUPATIONS(state, data) {
            state.staticLists.occupations = data;
        },
        SET_RELATIONS(state, data) {
            state.staticLists.relations = data;
        },
        SET_PROCEDURE_CATEGORIES(state, data) {
            state.staticLists.procedureCategories = data;
        },
        SET_TRANSFER_DATA(state, data) {
            state.transferData[data.target] = data.data;
        },
        SET_SHOT_LOCATIONS(state, data) {
            state.staticLists.shotLocations = data;
        },
        SET_PERSCRIPTION_TYPES(state, data) {
            state.staticLists.perscriptionTypes = data;
        },
        SET_PERSCRIPTION_TIMINGS(state, data) {
            state.staticLists.perscriptionTimings = data;
        },
        SET_PATIENT_INFO(state, data) {
            state.activePatient = data;
        },
        RESET_PATIENT_INFO(state) {
            state.activePatient = null;
        },
        SET_NOTIFICATIONS(state, data) {
            state.notifications = data;
        },
        SET_VIEW_DATA(state, data) {
            Object.assign(state.viewData, data);
        }
    },
    actions: {},
});
