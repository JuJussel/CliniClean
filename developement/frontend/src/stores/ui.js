import { defineStore } from 'pinia'

export const useUiStore = defineStore({
    id: 'ui',
    persist: {
        enabled: false
    },
    /////////////////////////////////////////////////////////////////////////////////////
    // STATE
    /////////////////////////////////////////////////////////////////////////////////////
    state: () => {
        return {
            loading: false,
            activeTab: shallowRef(null),
            medicalTab: null,
            modals: {
                receptionModalRegister: false,
                receptionModalReservation: false,
                receptionModalPatientEdit: false,
                receptionModalInsuranceEdit: false
            },
            notification: [],
            toasts: [],
            tabs: {
                reception: {
                    multiview: {
                        mode: null,
                    }
                }
            },
            navigation: {
                history: [],
                transitionName: 'slide-left',
                suppressWatcher: false,
            },
        }
    },
})

export default useUiStore