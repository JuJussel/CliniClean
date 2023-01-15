import { defineStore } from 'pinia'
import apiService from '@/services/api.service.js'

export const useAllergyStore = defineStore({
    id: 'allergy',
    state: () => {
        return {
            list: ['1', '2', 'allergy'],
            loading: false
        }
    },
    actions: {
        async setData(data = null) {
            this.loading = true
            if (data) {
                state.list = data
            } else {
                this.list = await apiService.get('doctors')
            }
            this.loading = false
            // API call to get data
        }

    }
})