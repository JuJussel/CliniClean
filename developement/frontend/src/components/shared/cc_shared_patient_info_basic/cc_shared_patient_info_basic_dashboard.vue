<template>
    <div class="cc-local-main-grid">
        <cui-card style="grid-row: 1/3" noPadding>
            <basic :patientId="patientId"/>
        </cui-card>
        <cui-card noPadding>
            <cui-table :data="encounterHistory">
                <template #header>
                    <h2> {{ $lang.outPatient }} {{ $lang.history }} </h2>
                </template>
                <template #thead>
                    <cui-th> {{ $lang.date }} </cui-th>
                    <cui-th> {{ $lang.encounterType  }} </cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td> {{ $parseDate(row.date) }} </td>
                    <td> {{ parseType(row.type) }} </td>
                </template>
            </cui-table>
        </cui-card>
        
        <cui-card>
            <h2>地図</h2>
            <GMapMap
                :center="{lat: 51.093048, lng: 6.842120}"
                :zoom="7"
                map-type-id="terrain"
            />
        </cui-card>

        <cui-card noPadding>
            <cui-table :data="encounterReservations">
                <template #header>
                    <h2> {{ $lang.reservation }} </h2>
                </template>
                <template #thead>
                    <cui-th> {{ $lang.date }} </cui-th>
                    <cui-th> {{ $lang.encounterType  }} </cui-th>
                </template>
                <template v-slot:row="{ row }">
                    <td> {{ $parseDate(row.date) }} </td>
                    <td> {{ parseType(row.type) }} </td>
                </template>
            </cui-table>
        </cui-card>
    </div>
</template>

<script>

import basic from "./cc_shared_patient_info.vue"

export default {
    props: {
        patientId: {
            default: null,
            type: Number
        }
    },
    components: {
        basic
    },
    async created() {
        this.encounters = await this.$dataService().get.patient.encounters(this.patientId)
    },
    data() {
        return {
            encounters: []
        }
    },
    computed: {
        encounterReservations() {
            let today = new Date().toISOString();
            return this.encounters.filter(item => item.date > today)
        },
        encounterHistory() {
            let today = new Date().toISOString();
            return this.encounters.filter(item => item.date < today)
        }

    },
    methods: {
        parseType(type) {
            return this.$store.getters.encounterTypes.find(item => item.id === type).name;
        }
    }
}
</script>

<style scoped>
    .cc-local-main-grid {
        display: grid;
        grid-template-columns: 700px auto auto;
        grid-template-rows: 50% 50%;
        height: 100%;
    }
    .vue-map-container {
        height: calc(100% - 60px);
        border-radius: 15px;
        overflow: hidden;
        margin: 10px;
    }
</style>