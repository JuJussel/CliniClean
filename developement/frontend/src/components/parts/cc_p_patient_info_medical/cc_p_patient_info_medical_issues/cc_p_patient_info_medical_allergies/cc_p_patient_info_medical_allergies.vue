<template>
    <div>
        <cui-table :data="medicalStore.medicalData?.allergies || []" outline>
            <template #header>
                <h2>{{ $lang.allergy }}</h2>
                <cui-button
                    icon="fas fa-plus"
                    :label="$lang.register"
                    @click="openEditor"
                    v-if="encounterStore.encounterData"
                />
            </template>
            <template #thead>
                <cui-th>{{ $lang.title }}</cui-th>
                <cui-th>{{ $lang.servrenity }}</cui-th>
                <cui-th>{{ $lang.startDate }}</cui-th>
                <cui-th>{{ $lang.endDate }}</cui-th>
                <cui-th>{{ $lang.reaction }}</cui-th>
                <cui-th>{{ $lang.note }}</cui-th>
                <cui-th></cui-th>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.name }} </td>
                <td> {{ row.level }} </td>
                <td> {{ $parseDate(row.start) }} </td>
                <td> {{ $parseDate(row.end) }} </td>
                <td>
                    <cui-tooltip v-if="row.reaction !== ''" onHover>
                        <div style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">  {{ row.reaction }} </div>
                        <template #tooltip>
                            <div> {{ row.reaction }} </div>
                        </template>
                    </cui-tooltip>

                </td>   
                <td>
                    <cui-tooltip v-if="row.note !== ''" onHover>
                        <div style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"> {{ row.note }} </div>
                        <template #tooltip>
                            <div> {{ row.note }} </div>
                        </template>
                    </cui-tooltip>
                </td>
                <td></td>
            </template>

        </cui-table>
    </div>
    <cui-modal
        :visible="editModal.open"
        @close="editModal.open = false"
    >
        <cui-card
            style="width: 450px; height: 480px"
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