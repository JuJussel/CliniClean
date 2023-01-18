import { defineStore } from 'pinia'
import apiService from '@/services/api.service.js'

export const useMedicalStore = defineStore({
    id: 'medical',
    persist: {
        enabled: true
    },
    state: () => {
        return {
            loading: false,
            patientId: null,
            patientData: null
        }
    },
    actions: {
        async getFullData() {
            this.loading = true;
            if (!patientId) {
                console.log("Error");
                return
            }
            try {
                let dbData = await apiService.get('patients/' + this.patientId);
                this.patientData = dbData.data
                this.loading = false;

            } catch (err) {
                console.log(err);
            }
        },
    }
})