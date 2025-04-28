import { defineStore } from 'pinia'
import useApi from "@/composables/apiComposable.js"

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
                let dbData = await useApi.get('lists/static');
                this.listData = dbData
                this.loading = false;
            } catch (err) {
                this.loading = false;
            }
        }
    }
})