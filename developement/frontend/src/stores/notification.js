import { defineStore } from 'pinia'

export const useNotificationStore = defineStore({
    id: 'notification',
    persist: {
        enabled: true
    },
    state: () => {
        return {
            loading: false,
            notifications: []
        }
    }
})