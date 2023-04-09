<template>
    <div style="height: calc(100% - 31px)">
        <div class="card-container">
            <cui-card>
                <template v-slot:header>
                    <div style="display: flex; justify-content: space-between; width: 100%">
                        <h2>{{ $lang.lifestyleHabits }}</h2>
                        <cui-button
                            icon="fas fa-plus"
                            :label="$lang.edit"
                            v-if="encounterStore.encounterData"
                            @click="modals.habits.visible = true"
                        />
                    </div>
                </template>
                <div>
                    <!-- Table with v-for. -->
                        <div>{{ $lang.tobacco }}</div>
                        <div>{{ $lang.coffee }}</div>
                        <div>{{ $lang.alcohol }}</div>
                        <div>{{ $lang.recreationalDrugs }}</div>
                        <div>{{ $lang.counseling }}</div>
                        <div>{{ $lang.exercisePatterns }}</div>
                        <div>{{ $lang.hazardousActivities }}</div>
                        <div>{{ $lang.sleepPatterns }}</div>
                </div>
            </cui-card>
            <cui-card>
                <template v-slot:header>
                    <h2>Social</h2>
                </template>
                <div></div>
            </cui-card>
        </div>
        <!-- <cui-table :data="vaccines || []" style="max-height: 245px" >
            <template #header>
                <h2>{{ $lang.lifestyle }}</h2>
            </template>
            <template v-slot:row="{ row }">
                <td> {{ row.name }} </td>
                <td> {{ $parseDate(row.date) }} </td>
            </template>

        </cui-table> -->
    </div>
        <cui-modal
        :visible="modals.habits.visible"
        :closable="!modals.habits.loading"
        @close="modals.habits.visible = false"
    >
        <cui-card
            style="width: 600px; height: 640px"
            v-if="modals.habits.visible"
        >
            <template #header>
                {{ $lang.lifestyleHabits }}
            </template>
        </cui-card>
    </cui-modal>
</template>

<script>

import { useMedicalStore } from '@/stores/medical'
import { useEncounterStore } from '@/stores/encounter'
import { mapStores } from 'pinia'

export default {
    data() {
        return {
            modals: {
                habits: {
                    open: false,
                    loading: false
                }
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
                let result = await this.$api.post(
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

<style scoped>
.card-container {
    height: 100%;
    display: grid;
    grid-template-rows: 50% auto
}
</style>