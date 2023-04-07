<template>
    <div>
        <cui-table :data="medicalStore.medicalData?.allergies || []" style="max-height: 245px" >
            <template #header>
                <h2>{{ $lang.allergy }} {{ $lang.valid }}</h2>
                <cui-button
                    icon="fas fa-plus"
                    :label="$lang.register"
                    @click="openEditor"
                    v-if="encounterStore.encounterData"
                />
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.name }} </td>
                <td> {{ row.level }} </td>
            </template>

        </cui-table>
    </div>
    <cui-modal
        :visible="editModal.open"
        @close="editModal.open = false"
    >
        <cui-card
            style="width: 450px; height: 320px"
            v-if="editModal.open"
        >
            <template #header>
                {{ $lang.allergy }}
                {{ editModal.data ? $lang.edit : $lang.register }}
            </template>
            <allegryEditor 
                :allergy="editModal.data" 
                @loading="editModal.loading = true"
                @close="editModal.open = false"
                @update="saveAllergy">
            </allegryEditor>
        </cui-card>
    </cui-modal>
</template>

<script>

import allegryEditor from './cc_p_patient_info_medical_allergy_edit.vue'
import { useMedicalStore } from '@/stores/medical'
import { useEncounterStore } from '@/stores/encounter'
import { mapStores } from 'pinia'

export default {
    components: { allegryEditor },
    data() {
        return {
            editModal: {
                open: false,
                data: null,
            }
        }
    },
    computed: {
        ...mapStores(useMedicalStore, useEncounterStore),
    },
    methods: {
        openEditor(data = null) {
            if (data) Object.assign(editModal.data, data)
            this.editModal.open = true
        },
        async saveAllergy(allergy) {
            const patientId = this.encounterStore.encounterData.patient.id
            //save to DB
            try {
                await this.$api.post(
                    "patients/" + patientId + "/medical?type=allergies",
                    allergy
                )
                this.editModal.open = false
                this.medicalStore.getData('allergies')
            } catch (err) {
                this.$apiError(err)
            }
        }
    },
}
</script>