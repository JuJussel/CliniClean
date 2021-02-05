import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const defaultState = () => {
  return {
    permissions: [ //Get from Backend
      'settings.user',
      'settings.groups'
    ],
    user: {
      id: 0,
      name_first: null,
      name_last: null,
      role: null
    },
    sessionID: null,
    date: '',
    activePatientID: null,
    activeShinsatuID: null,
    activeInsID: null,
    lists: {
      shinsatuTypes: null,
      suppliers: null
    },
    isHoliday: false,
    kouiCats: {
      12: {
        search: "",
        results: [],
        name: "セット",
        type: "12",
        icon: "fas fa-list",
      },
      25: {
        search: "",
        results: [],
        name: "処方",
        type: "25",
        icon: "fas fa-pills",
      },
      30: {
        search: "",
        results: [],
        name: "接種",
        type: "30",
        icon: "fas fa-syringe",
      },
      31: {
        search: "",
        results: [],
        name: "予防",
        type: "31",
        icon: "fas fa-viruses",
      },
      40: {
        search: "",
        results: [],
        name: "手術",
        type: "40",
        icon: "fas fa-procedures",
      },
      50: {
        search: "",
        results: [],
        name: "処置",
        type: "50",
        icon: "fas fa-band-aid",
      },
      60: {
        search: "",
        results: [],
        name: "検査",
        type: "60",
        icon: "fas fa-microscope",
      },
      70: {
        search: "",
        results: [],
        name: "画像",
        type: "70",
        icon: "fas fa-x-ray",
      },
      90: {
        search: "",
        results: [],
        name: "健診",
        type: "90",
        icon: "fas fa-notes-medical",
      },
    }
  }
}
const state = defaultState()

const mutations =  {
  SET_SESSION_ID(state, id) {
    state.sessionID = id
  },
  SET_USER_DATA(state, data) {
    state.user = data
  },
  RESET_STATE(state) {
    Object.assign(state, defaultState())
  },
  SET_SHINSATU_DATA(state, data) {
    state.activePatientID = data.patientID
    state.activeShinsatuID = data.shinsatuID
    state.activeInsID = data.insID
  },
  SET_LIST_SHINSATUTYPES(state, data) {
    state.lists.shinsatuTypes = data
  },
  SET_HOLIDAY(state, data) {
    state.isHoliday = data
  },
  SET_SUPPLIERS(state, data) {
    state.lists.suppliers = data
  }

}

const getters = {
    userInfo: state => state.user,
    userFullName: state => state.user.name_last + state.user.name_first,
    activePatient: state => state.activePatientID,
    activeShinsatu: state => state.activeShinsatuID,
    activeInsID: state => state.activeInsID,
    shinsatuTypes: state => state.lists.shinsatuTypes,
    isHoliday: state => state.isHoliday,
    suppliers: state => state.lists.suppliers,
    kouiCats: state => state.kouiCats,
    permissions: state => state.permissions
}

export default new Vuex.Store({
  state,
  mutations,
  getters
})
