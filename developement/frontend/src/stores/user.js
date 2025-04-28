import { defineStore } from 'pinia'

export const useUserStore = defineStore({
    id: 'user',
    persist: {
        enabled: true
    },
    state: () => {
        return {
            loading: false,
            userData: null
        }
    },
    getters: {
        fullName() {
            return this.userData?.nameLast + this.userData?.nameFirst
        }
    }
})