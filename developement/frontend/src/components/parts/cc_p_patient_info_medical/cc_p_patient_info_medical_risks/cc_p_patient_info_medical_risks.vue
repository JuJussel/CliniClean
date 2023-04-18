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
                            @click="openHabits"
                        />
                    </div>
                </template>
                <div style="display: flex; flex-wrap: wrap">
                    <cui-card style="width: 200px" v-for="(item,index) in habitCats" :key="index">
                        <div style="display: flex; align-items: center;">
                            <i style="margin-right: 10px" :class="habitTemplate.find(i => i.name === item.name).icon"></i>
                            {{ $lang[item.name] }}
                        </div>
                        <div v-if="item.value !== ''" style="margin: 0 0 0 30px;padding: 10px; background-color: var(--cui-gray-2); border-radius: 10px;">{{ item.value }}</div>
                    </cui-card>
                </div>
            </cui-card>
            <cui-card>
                <template v-slot:header>
                    <h2>Social</h2>
                </template>
                Coming soon...
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
            style="width: 1000px; height: 750px"
            v-if="modals.habits.visible"
        >
            <template #header>
                {{ $lang.lifestyleHabits }}
            </template>
            <div style="display: flex; flex-wrap: wrap">
                <cui-card style="width: 300px" v-for="(item,index) in habitInput" :key="index">
                    <div style="display: flex; align-items: center;">
                        <i style="margin-right: 10px" :class="habitTemplate.find(i => i.name === item.name).icon"></i>
                        {{ $lang[item.name] }}
                    </div>
                    <cui-textarea v-model="item.value" rows="5" cols="33" />
                </cui-card>
            </div>
            <template #footer>
                <cui-button
                    :label="$lang.cancel"
                    @click="this.modals.habits.visible = false"
                    plain
                    :loading="modals.habits.loading"
                />
                <cui-button
                    :label="$lang.save"
                    primary
                    @click="saveHabit"
                    :loading="modals.habits.loading"
                />
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
                    visible: false,
                    loading: false
                }
            },
            habitInput: null,
            habitTemplate: [
                {name: "tobacco", icon: "fa-solid fa-smoking", value: ""},
                {name: "coffee", icon: "fa-solid fa-mug-hot", value: ""},
                {name: "alcohol", icon: "fa-solid fa-martini-glass", value: ""},
                {name: "recreationalDrugs", icon: "fa-solid fa-cannabis", value: ""},
                {name: "counseling", icon: "fa-solid fa-couch", value: ""},
                {name: "exercisePatterns", icon: "fa-solid fa-dumbbell", value: ""},
                {name: "hazardousActivities", icon: "fa-solid fa-bomb", value: ""},
                {name: "sleepPatterns", icon: "fa-solid fa-moon", value: "" }
            ]
        }
    },
    computed: {
        ...mapStores(useMedicalStore, useEncounterStore),
        habitCats() {
            return this.medicalStore.medicalData.habits || this.habitTemplate
        }
    },
    methods: {
        openHabits() {
            let habitData = this.medicalStore.medicalData.habits || this.$copy(this.habitCats)
            habitData.forEach(item => delete item.icon)
            this.habitInput = habitData
            this.modals.habits.visible = true
        },

        async saveHabit() {
            this.modals.habits.loading = true
            const patientId = this.encounterStore.encounterData.patient.id
            //save to DB
            try {
                let result = await this.$api.post(
                    "patients/" + patientId + "/medical?type=habits",
                    this.habitInput
                )
                this.modals.habits.visible = false
                this.modals.habits.loading = false
                this.medicalStore.getData('habits')
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