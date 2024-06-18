import { defineStore } from 'pinia'

export const useUiStore = defineStore({
    id: 'ui',
    persist: {
        enabled: true
    },
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
            toasts: []
        }
    },
})

export default useUiStore