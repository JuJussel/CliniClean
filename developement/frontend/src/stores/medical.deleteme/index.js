import { defineStore } from 'pinia'
import { useAllergyStore } from './allergy'


export const useMedicalStore = defineStore({
    id: 'medical',
    getters: {

        getAllergies: () => {
            const allergies = useAllergyStore()
            return allergies.list
        }
    },
    actions: {
        setAllergyData() {
            const allergies = useAllergyStore()
            allergies.setData()
        }

    }
})