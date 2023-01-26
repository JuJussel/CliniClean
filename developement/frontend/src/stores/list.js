import { defineStore } from 'pinia'
import apiService from '@/services/api.service.js'

export const useListStore = defineStore({
    id: 'list',
    persist: {
        enabled: true
    },
    state: () => {
        return {
            loading: false,
            listData: null
        }
    },
    actions: {
        async getData() {
            this.loading = true
            try {
                let dbData = await apiService.get('lists/static');
                this.listData = dbData
                this.loading = false;
            } catch (err) {
                console.log(err);
                this.loading = false;
            }
        }
    }
})