import { defineStore } from 'pinia'
import apiService from '@/services/api.service.js'

export const useMedicalStore = defineStore({
    id: 'medical',
    persist: {
        enabled: true
    },
    state: () => {
        return {
            loading: true,
            patientId: 8,
            medicalData: {}
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
                let dbData = await apiService.get('patients/' + this.patientId + '/medical');
                this.loading = false;
            } catch (err) {
                console.log(err);
            }
        },

        async getPartialData(type = null) {
            this.loading = true;
            if (!type) {
                console.log("Error");
                return
            }
            try {
                let dbData = await apiService.get('patients/' + this.patientId + '/medical?type=' + type);
                this.medicalData[type] = dbData.data
                this.loading = false;
            } catch (err) {
                console.log(err);
            }
        },
    }
})