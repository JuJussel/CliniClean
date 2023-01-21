import { defineStore } from 'pinia'
import apiService from '@/services/api.service.js'

export const usePatientStore = defineStore({
    id: 'patient',
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
        async getFullData(id) {
            this.loading = true;
            if (!id) {
                console.log("Error");
                return
            }
            this.patientId = id
            try {
                let dbData = await apiService.get('patients/' + this.patientId);
                this.patientData = dbData.patientData
                this.loading = false;

            } catch (err) {
                console.log(err);
            }
        },
    }
})