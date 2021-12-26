<template>
    <div style="display: flex; height: 100%">
        <div>
            <basic :patientId="patientId" outline :square="false"/>
        </div>
        <div class="cc-local-main-grid">
            <cui-table :data="encounterHistory" outline>
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
            
            <div style="padding: 10px">
                <h2>地図</h2>
                <GMapMap
                    :center="{lat: 51.093048, lng: 6.842120}"
                    :zoom="7"
                    map-type-id="terrain"
                />
            </div>

            <cui-table :data="encounterReservations" outline>
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

        </div>
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
        grid-template-columns: 40% calc(60% - 80px);
        grid-template-rows: calc(50% - 21px) calc(50% - 21px);
        column-gap: 40px;
        row-gap: 40px;
        flex-grow: 1;
        height: 100%;
        margin-left: 40px
    }
    .vue-map-container {
        height: 100%;
        border-radius: 15px;
        overflow: hidden;
        margin: 10px;
    }
</style>