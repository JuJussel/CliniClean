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
            activePatientDataBasic: null,
            activePatientDataMedical: null,
        }
    },
    actions: {
        async getData(id = null) {
            this.loading = true;
            if (id) {
                this.patientData = {
                    id: id
                }
            }
            try {
                let dbData = await apiService.get('patients/' + this.patientData.id);
                this.patientData = dbData
                this.loading = false;

            } catch (err) {
                console.log(err);
            }
        },
    }
})