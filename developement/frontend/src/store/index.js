import createPersistedState from "vuex-persistedstate";
import { createStore } from "vuex";

var defaultState = function () {
    return {
        user: null,
        activeTab: "dashboard",
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
        activePatient: null,
        activeEncounter: null,
        settings: null,
        config: null,
        notifications: [],
        viewData: {},
        layoutData: {}
    };
}

var defaultEncounter = {
    karte: {
        soap: null,
        procedures: [],
        images: []
    }
}

export const store = createStore({
    plugins: [createPersistedState()],
    state() {
        return defaultState();
    },

    getters: {
        staticLists: (state) => state.staticLists.db,
        user: (state) => state.user,
        userFullName: (state) => state.user?.nameLast + state.user?.nameFirst,
        activeTab: (state) => state.activeTab,
        encounterTypes: (state) => state.staticLists.encounterTypes,
        occupations: (state) => state.staticLists.occupations || null,
        relations: (state) => state.staticLists.relations || null,
        procedureCategories: (state) =>
            state.staticLists.procedureCategories || null,
        shotLocations: (state) => state.staticLists.shotLocations || null,
        perscriptionTypes: (state) =>
            state.staticLists.perscriptionTypes || null,
        perscriptionTimings: (state) =>
            state.staticLists.perscriptionTimings || null,
        settings: (state) => state.settings,
        activeEncounter: (state) => state.activeEncounter || null,
        activePatient: (state) => state.activePatient || null,
        activePatientHistory: (state) => state.activePatient || null,
        diseaseFlags: (state) => state.staticLists.disease || null,
        notifications: (state) => state.notifications,
        userGroups: (state) => state.staticLists.userGroups,
        viewData: (state) => state.viewData,
        layoutData: (state) => state.layoutData
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
        SET_ACTIVE_TAB(state, view) {
            state.activeTab = view;
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
        SET_SHOT_LOCATIONS(state, data) {
            state.staticLists.shotLocations = data;
        },
        SET_PERSCRIPTION_TYPES(state, data) {
            state.staticLists.perscriptionTypes = data;
        },
        SET_PERSCRIPTION_TIMINGS(state, data) {
            state.staticLists.perscriptionTimings = data;
        },
        SET_ACTIVE_ENCOUNTER(state, data) {
            let encounter = Object.assign(defaultEncounter, data)
            state.activeEncounter = encounter;
        },
        SET_ACTIVE_PATIENT(state, data) {
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
        },
        SET_LAYOUT_DATA(state, data) {
            Object.assign(state.layoutData, data);
        },
        CLEAR_STORE(state) {
            Object.assign(state, defaultState());
        }
    },
    actions: {},
});
