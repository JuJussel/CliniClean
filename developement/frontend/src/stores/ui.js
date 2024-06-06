import { defineStore } from 'pinia'

export const useUiStore = defineStore({
    id: 'ui',
    persist: {
        enabled: true
    },
    state: () => {
        return {
            loading: false,
            activeTab: "dashboard",
            medicalTab: null,
            modals: {
                receptionModalRegister: false,
                receptionModalReservation: false,
                receptionModalPatientEdit: false,
                receptionModalInsuranceEdit: false
            }
        }
    }
})

export default useUiStore