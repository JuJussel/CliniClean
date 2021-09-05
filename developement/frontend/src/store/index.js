import createPersistedState from 'vuex-persistedstate'
import { createStore } from 'vuex'

export const store = createStore({
           plugins: [createPersistedState()],

           state() {
               return {
                   user: null,
                   activeView: "home",
                   staticLists: [],
                   transferData: {
                       reception: null,
                       patientList: null,
                   },
                   settings: null,
                   config: null
               };
           },

           getters: {
               config: (state) => state.config,
               user: (state) => state.user,
               userFullName: (state) =>
                   state.user?.nameLast + state.user?.nameFirst,
               activeView: (state) => state.activeView,
               encounterTypes: (state) => state.staticLists.encounterTypes,
               occupations: (state) => state.staticLists.occupations,
               relations: (state) => state.staticLists.relations,
               transferData: (state) => state.transferData,
               procedureCategories: (state) =>
                   state.staticLists.procedureCategories,
               shotLocations: (state) => state.staticLists.shotLocations,
               perscriptionTypes: (state) =>
                   state.staticLists.perscriptionTypes,
               perscriptionTimings: (state) =>
                   state.staticLists.perscriptionTimings,
               settings: (state) => state.settings,
           },

           mutations: {
               SET_CONFIG(state, config) {
                   state.config = config;
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
           },
           actions: {},
       });