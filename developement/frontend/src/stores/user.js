import { defineStore } from 'pinia'
import apiService from '@/services/api.service.js'

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