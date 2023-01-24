import createPersistedState from "vuex-persistedstate";
import { createStore } from "vuex";

var defaultState = function () {
    return {
        layoutData: {
            medical: null,
        }
    };
}

export const store = createStore({
    plugins: [createPersistedState()],
    state() {
        return defaultState();
    },

    getters: {
        layoutData: (state) => state.layoutData
    },

    mutations: {
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
