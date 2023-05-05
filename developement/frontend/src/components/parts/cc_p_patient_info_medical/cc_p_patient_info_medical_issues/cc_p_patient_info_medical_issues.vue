<template>
    <div style="height: calc(100%); display: grid; grid-template-rows: 50% auto;">
        <cui-card noPadding>
            <allergies></allergies>
        </cui-card>
                <cui-card noPadding>
            <allergies></allergies>
        </cui-card>

    </div>
</template>

<script>

import { useMedicalStore } from '@/stores/medical'
import { useEncounterStore } from '@/stores/encounter'
import { mapStores } from 'pinia'
import allergies from './cc_p_patient_info_medical_allergies'

export default {
    components: {
        allergies
    },
    data() {
        return {
        }
    },
    computed: {
        ...mapStores(useMedicalStore, useEncounterStore),
    },
    methods: {
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