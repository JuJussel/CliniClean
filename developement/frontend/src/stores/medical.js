import { defineStore } from 'pinia'
import apiService from '@/services/api.service.js'
import { usePatientStore } from './patient'

export const useMedicalStore = defineStore({
    id: 'medical',
    persist: {
        enabled: true
    },
    state: () => {
        return {
            loading: false,
            medicalData: {}
        }
    },
    actions: {
        async getData(type = null) {
            this.loading = true;
            const patientStore = usePatientStore();

            let uri = 'patients/' + patientStore.patientData.id + '/medical';
            if (type) {
                uri = uri + '?type=' + type;
            }
            try {
                let dbData = await apiService.get(uri);
                type ? this.medicalData[type] = dbData.medicalData : this.medicalData = dbData.medicalData;
                this.loading = false;
            } catch (err) {
                console.log(err);
            }
        },
    }
})