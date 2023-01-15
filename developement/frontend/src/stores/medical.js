import { defineStore } from 'pinia'
import apiService from '@/services/api.service.js'

export const useMedicalStore = defineStore({
    id: 'medical',
    state: () => {
        return {
            loading: true,
            patientId: null,
        }
    },
    actions: {
        async getFullData(patient = null) {
            this.loading = true;
            const patientId = patient || this.patientId;
            if (!patientId) {
                console.log("Error");
                return
            }
            try {
                let dbData = await this.$api.get('patient/' + patientId + '/medical');
                console.log(dbData);
                loading = false;
            } catch (err) {
                console.log(err);
            }
        },
    }
})