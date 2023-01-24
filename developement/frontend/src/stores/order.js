import { defineStore } from 'pinia'
import apiService from '@/services/api.service.js'

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
                let dbData = await apiService.get('orders');
                this.orderData = dbData
                this.loading = false;
            } catch (err) {
                console.log(err);
            }
        }
    }
})