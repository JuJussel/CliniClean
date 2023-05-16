<template>
    <div class="table-cont">
            <allergies></allergies>
            <problems></problems>

    </div>
</template>

<script>

import { useMedicalStore } from '@/stores/medical'
import { useEncounterStore } from '@/stores/encounter'
import { mapStores } from 'pinia'
import allergies from './cc_p_patient_info_medical_allergies'
import problems from './cc_p_patient_info_medical_problems'

export default {
    components: {
        allergies,
        problems
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
.table-cont {
    height: calc(100% - 5px);
    display: grid;
    grid-template-rows: 50%;
    grid-gap: 20px
}
</style>