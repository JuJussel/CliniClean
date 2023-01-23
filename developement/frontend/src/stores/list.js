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
            listsDataRaw: null
        }
    },
    getters: {
        listData() {
            if (this.listDataRaW) {
                return this.listsDataRaw
            }
            this.getData()
        }
    },
    actions: {
        async getData() {
            this.loading = true
            try {
                let dbData = await apiService.get('lists/static');
                this.listsDataRaw = dbData
                this.loading = false;
            } catch (err) {
                console.log(err);
            }
        }
    }
})