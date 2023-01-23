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
        config: null,
        notifications: [],
        layoutData: {
            medical: null,
            reception: null,
            orders: null
        }
    };
}

export const store = createStore({
    plugins: [createPersistedState()],
    state() {
        return defaultState();
    },

    getters: {
        staticLists: (state) => state.staticLists,
        userFullName: (state) => state.user?.nameLast + state.user?.nameFirst,
        activeTab: (state) => state.activeTab,
        activePatient: (state) => state.activePatient || null,
        notifications: (state) => state.notifications,
        layoutData: (state) => state.layoutData
    },

    mutations: {
        SET_STATIC_LISTS(state, data) {
            Object.assign(state.staticLists, data)
        },
        SET_ACTIVE_TAB(state, view) {
            state.activeTab = view;
        },
        RESET_PATIENT_INFO(state) {
            state.activePatient = null;
        },
        SET_NOTIFICATIONS(state, data) {
            state.notifications = data;
        },
        SET_LAYOUT_DATA(state, data) {
            let target = data[0]
            let content = data[1]
            if (!state.layoutData[target]) state.layoutData[target] = {}
            Object.assign(state.layoutData[target], content);
        },
        CLEAR_STORE(state) {
            Object.assign(state, defaultState());
        }
    },
    actions: {},
});
