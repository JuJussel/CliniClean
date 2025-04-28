import { defineStore } from 'pinia'
import useApi from "@/composables/apiComposable.js"

export const useOrderStore = defineStore({
    id: 'order',
    persist: {
        enabled: true
    },
    state: () => {
        return {
            loading: false,
            orderData: [],
            activeOrder: null
        }
    },
    actions: {
        async getOrders(patient = null) {
            this.loading = true
            try {
                let dbData = await useApi.get('orders');
                this.orderData = dbData
                this.loading = false;
            } catch (err) {
                console.log(err);
            }
        }
    }
})