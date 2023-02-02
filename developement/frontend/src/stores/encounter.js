import { defineStore } from 'pinia'

export const useEncounterStore = defineStore({
    id: 'encounter',
    persist: {
        enabled: true
    },
    state: () => {
        return {
            loading: false,
            encounterData: null
        }
    }
})