import { defineStore } from 'pinia'
import useApi from "@/composables/apiComposable.js"

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
                let dbData = await useApi.get('patients/' + this.patientData.id);
                this.patientData = dbData
                this.loading = false;

            } catch (err) {
                console.log(err);
            }
        },
    }
})