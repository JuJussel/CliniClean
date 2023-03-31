<template>
    <div>
        <cui-table :data="vaccines || []" style="max-height: 245px" >
            <template #header>
                <h2>{{ $lang.vaccines }}</h2>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.name }} </td>
                <td> {{ $parseDate(row.date) }} </td>
            </template>

        </cui-table>
    </div>
</template>

<script>

import { useMedicalStore } from '@/stores/medical'
import { useEncounterStore } from '@/stores/encounter'
import { mapStores } from 'pinia'

export default {
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
        vaccines() {
            let vaccines = [];
            this.medicalStore.medicalData.encounters.forEach((enc) => {
                let procedures = enc.karte?.procedures || null;
                if (!procedures) return;
                procedures = procedures.filter((proc) => proc.cat?.code === 31);
                procedures = procedures.map((item) => {
                    item.encounter = enc.id;
                    item.date = enc.date;
                    return item;
                });
                vaccines = vaccines.concat(procedures);
            });
            return vaccines;
        },
    },
    methods: {
        openEditor(data = null) {
            if (data) Object.assign(editModal.data, data)
            this.editModal.open = true
        },
        async saveAllergy(allergy) {
            const patientId = 8
            //save to DB
            try {
                let result = await this.$api.post(
                    "patients/" + patientId + "/medical?type=allergies",
                    allergy
                )
                this.editModal.open = false
                this.medicalStore.getData('allergies')
            } catch (err) {
                this.$apiError(err)
            }
            // this.editModal.open = false
        }
    },
}
</script>