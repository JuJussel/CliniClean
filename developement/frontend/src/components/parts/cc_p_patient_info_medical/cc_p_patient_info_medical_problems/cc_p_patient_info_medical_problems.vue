<template>
    <!-- Compact Version -->
    <div v-if="compact">
        <cui-table :data="medicalStore.medicalData?.problems || []" style="max-height: 245px" >
            <template #header>
                <h2>{{ $lang.problem }} {{ $lang.valid }}</h2>
                <cui-button
                    icon="fas fa-plus"
                    :label="$lang.register"
                    @click="openEditor"
                    v-if="encounterStore.encounterData"
                />
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.name }} </td>
            </template>
        </cui-table>

        <!-- 
            Full Version 
            name, 
            description(textfield), 
            first seen, 
            last seen, 
            impact (textfield),
            label (dangerous, inconvenient, cosmetic, custom)
        -->
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
                {{ $lang.problem }}
                {{ editModal.data ? $lang.edit : $lang.register }}
            </template>
            <problemEditor 
                :allergy="editModal.data" 
                @loading="editModal.loading = true"
                @close="editModal.open = false"
                @update="saveProblem">
            </problemEditor>
        </cui-card>
    </cui-modal>
</template>

<script>

import problemEditor from './cc_p_patient_info_medical_problem_edit.vue'
import { useMedicalStore } from '@/stores/medical'
import { useEncounterStore } from '@/stores/encounter'
import { mapStores } from 'pinia'

export default {
    components: { problemEditor },
    props: {
        compact: {
            type: Boolean,
            default: false
        }
    },
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
        async saveProblem(problem) {
            const patientId = 8
            //save to DB
            try {
                let result = await this.$api.post(
                    "patients/" + patientId + "/medical?type=problems",
                    problem
                )
                this.editModal.open = false
                this.medicalStore.getData('problems')
            } catch (err) {
                this.$apiError(err)
            }
            // this.editModal.open = false
        }
    },
}
</script>